import { DamageLevelType, type IItem } from '../db/items';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import type { ILabel } from '../db/labels';

export type Scope = 'user' | 'editor' | 'admin';
export interface PaginationParams {
    page: number;
    pageSize: number;
}
export interface FilterParams {
    damageLevel?: DamageLevelType | null;
    type?: 'isSet' | 'isPart' | null;
    location?: string | null;
    labels?: string[] | null;
}

interface DamageOrFilter {
    damageLevel?: DamageLevelType[] | null;
}
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export const inventoryApi = {
    async addItem(itemData: Omit<IItem, 'id'>): Promise<void> {
        try {
            await db.items.add(itemData as IItem);
        } catch (error) {
            console.error('Failed to add inventory item: ', error);
            if ((error as Error).name === 'ConstraintError') {
                console.error('Error: An item with the id or inventory number already exists.');
            }
        }
    },

    async addItemsBulk(itemsData: IItem[]): Promise<void> {
        const existing = await db.items.toArray();
        const invNumToId = new Map<string, number>(
            existing
                .filter((it) => it.inventoryNumber)
                .map((it) => [it.inventoryNumber!, it.id])
        );

        const resolved = itemsData.map((item) => {
            if (item.inventoryNumber && invNumToId.has(item.inventoryNumber)) {
                return { ...item, id: invNumToId.get(item.inventoryNumber) };
            }
            return item;
        });

        await db.items.bulkPut(resolved as IItem[]);
    },

    async fetchItemsPaginated(params: PaginationParams): Promise<PaginatedResult<IItem>> {
        const { page, pageSize } = params;
        const offset = (page - 1) * pageSize;

        try {
            const totalItems = await db.items.count();

            // Note: Using offset().limit() - offset must come before limit
            const data = await db.items.orderBy('id').offset(offset).limit(pageSize).toArray();

            const totalPages = Math.ceil(totalItems / pageSize);

            return {
                data,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalItems,
                    totalPages,
                    hasMore: page < totalPages,
                },
            };
        } catch (error) {
            console.error('Failed to fetch paginated items: ', error);
            throw error;
        }
    },
    async fetchItemsPaginatedWithFilter(
        params: PaginationParams,
        searchTerm: string,
        filters?: FilterParams
    ): Promise<PaginatedResult<IItem>> {
        const { page, pageSize } = params;
        const offset = (page - 1) * pageSize;

        try {
            const hasFilters =
                filters &&
                (filters.damageLevel ||
                    filters.type ||
                    filters.location ||
                    (filters.labels && filters.labels.length > 0));

            if (!searchTerm && !hasFilters) {
                return await this.fetchItemsPaginated(params);
            }

            // when filtering, we need to get all items and filter in memory
            const allItems = await db.items.orderBy('id').toArray();

            const term = searchTerm.toLowerCase();
            const filteredItems = allItems.filter((item) => {
                const matchesSearch =
                    !searchTerm ||
                    [item.name, item.location, item.itemId, item.inventoryNumber, item.deviceNumber].some(
                        (field) => (field || '').toLowerCase().includes(term)
                    );

                const matchesDamageLevel = !filters?.damageLevel || item.damageLevel === filters.damageLevel;
                
                const matchesType =
                    !filters?.type ||
                    (filters.type === 'isSet' ? item.isSet === true : filters.type === 'isPart' ? item.isSet === false : true);

                const matchesLocation =
                    !filters?.location || (item.location || '').toLowerCase().includes(filters.location.toLowerCase());

                const matchesLabels =
                    !filters?.labels ||
                    !filters.labels.length ||
                    filters.labels.every((labelId) => item.labels?.some((itemLabel) => itemLabel.id === labelId));

                return matchesSearch && matchesDamageLevel && matchesType && matchesLocation && matchesLabels;
            });

            const totalItems = filteredItems.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const paginatedData = filteredItems.slice(offset, offset + pageSize);

            return {
                data: paginatedData,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalItems,
                    totalPages,
                    hasMore: page < totalPages,
                },
            };
        } catch (error) {
            console.error('Failed to fetch filtered paginated items: ', error);
            throw error;
        }
    },
    useItems() {
        const items: IItem[] | undefined = useLiveQuery(() => db.items.orderBy('id').toArray(), []);
        return items ?? [];
    },
    useItemsPaginated(page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        const items: IItem[] | undefined = useLiveQuery(
            () => db.items.orderBy('id').offset(offset).limit(pageSize).toArray(),
            [page, pageSize]
        );
        return items ?? [];
    },

    useTotalItemCount() {
        const count: number | undefined = useLiveQuery(() => db.items.count(), []);
        return count ?? 0;
    },

    async deleteItem(id: number): Promise<void> {
        try {
            await db.items.delete(id);
        } catch (error) {
            console.error('Failed to delete item: ', error);
        }
    },

    async updateItem(id: number, updates: Partial<Omit<IItem, 'id'>>): Promise<void> {
        try {
            const existingItem = await db.items.get(id);
            if (!existingItem) {
                console.error(`Item with id "${id}" not found`);
                throw new Error(`Item with id "${id}" not found`);
            }

            await db.items.update(id, updates);
        } catch (error) {
            console.error('Failed to update inventory item: ', error);
            throw error;
        }
    },

    async clearAll(): Promise<void> {
        try {
            await db.items.clear();
        } catch (err) {
            console.error('Failed to clear items', err);
            throw err;
        }
    },

    async countWithFilter(filters?: DamageOrFilter): Promise<{
        totalCount: number;
        firstThreeEntries: IItem[];
    }> {
        try {
            const hasFilters = filters && filters.damageLevel && filters.damageLevel.length > 0;

            if (!hasFilters) {
                // Fast path: no filtering needed
                const totalCount = await db.items.count();
                const firstThreeEntries = await db.items.orderBy('id').limit(3).toArray();

                return { totalCount, firstThreeEntries };
            }

            // Filtering path: must fetch all, filter in-memory
            const allItems = await db.items.orderBy('id').toArray();

            const filteredItems = allItems.filter((item) => {
                const matchesDamageLevel =
                    !filters?.damageLevel?.length || filters.damageLevel.includes(item.damageLevel);

                return matchesDamageLevel;
            });

            return {
                totalCount: filteredItems.length,
                firstThreeEntries: filteredItems.slice(0, 3),
            };
        } catch (error) {
            console.error('Failed to count items with filter: ', error);
            throw error;
        }
    },

    useCountWithFilter(filters?: DamageOrFilter) {
        const result: { totalCount: number; firstThreeEntries: IItem[] } | undefined = useLiveQuery(
            () => this.countWithFilter(filters),
            [filters?.damageLevel]
        );

        return result ?? { totalCount: 0, firstThreeEntries: [] };
    },

    useCountItemsWithLabel(labelId: string | undefined) {
        const count = useLiveQuery(
            async () => {
                if (!labelId) return 0;
                const allItems = await db.items.toArray();
                return allItems.filter(item => item.labels?.some(l => l.id === labelId)).length;
            },
            [labelId]
        );
        return count ?? 0;
    },

    async removeLabelFromAllItems(labelId: string): Promise<void> {
        try {
            const allItems = await db.items.toArray();
            const itemsToUpdate = allItems.filter((item) => item.labels?.some((label) => label.id === labelId));

            if (itemsToUpdate.length > 0) {
                const updates = itemsToUpdate.map((item) => {
                    const newLabels = item.labels?.filter((label) => label.id !== labelId);
                    return {
                        ...item,
                        labels: newLabels,
                    };
                });
                await db.items.bulkPut(updates);
            }
        } catch (error) {
            console.error(`Failed to remove label ${labelId} from all items:`, error);
            throw error;
        }
    },
};

export const labelsApi = {
    async getAllLabels(): Promise<ILabel[]> {
        try {
            const labels = await db.labels.orderBy('id').toArray();
            return labels;
        } catch (error) {
            console.error('Failed to fetch all labels: ', error);
            throw error;
        }
    },
    async addLabel(label: ILabel): Promise<void> {
        try {
            await db.labels.put(label);
        } catch (error) {
            console.error('Failed to add label: ', error);
            throw error;
        }
    },
    async deleteLabel(labelId: string): Promise<void> {
        try {
            await db.labels.delete(labelId);
        } catch (error) {
            console.error('Failed to delete label: ', error);
            throw error;
        }
    },
};

export type SortField =
    | 'itemId'
    | 'name'
    | 'type'
    | 'amountActual'
    | 'availability'
    | 'damageLevel'
    | 'location'
    | 'inventoryNumber'
    | 'deviceNumber'
    | 'nextInspection';

export type SortDirection = 'asc' | 'desc';
