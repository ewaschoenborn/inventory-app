import { type IDbInventoryItem, type IDbItemDefinition } from '../db/legacy.items';
import { db } from '../db/legacy.db';

import { useLiveQuery } from 'dexie-react-hooks';

export const inventoryApi = {
    async addInventoryItem(itemData: Omit<IDbInventoryItem, 'id'>): Promise<number | undefined> {
        try {
            const id = await db.inventoryItems.add(itemData as IDbInventoryItem);
            return id;
        } catch (error) {
            console.error('Failed to add inventory item: ', error);
            if ((error as Error).name === 'ConstraintError') {
                alert('Error: An item with this "Sachnummer" (externalId) already exists.');
            }
            return undefined;
        }
    },
    useInventoryItems() {
        const items: IDbInventoryItem[] | undefined = useLiveQuery(
            () => db.inventoryItems.orderBy('position').toArray(),
            []
        );
        return items ?? [];
    },

    async updateItemAmount(id: number, newAmount: number): Promise<void> {
        try {
            await db.inventoryItems.update(id, { amountActual: newAmount });
        } catch (error) {
            console.error('Failed to update item amount: ', error);
        }
    },

    async deleteInventoryItem(id: number): Promise<void> {
        try {
            await db.inventoryItems.delete(id);
        } catch (error) {
            console.error('Failed to delete item: ', error);
        }
    },
};

export const lookupApi = {
    useOrganisationalUnits: () => useLiveQuery(() => db.organisationalUnits.toArray(), []) ?? [],
    useItemTypes: () => useLiveQuery(() => db.itemTypes.toArray(), []) ?? [],
    useManufacturers: () => useLiveQuery(() => db.manufacturers.toArray(), []) ?? [],
    useItemDefinitions: () => useLiveQuery(() => db.itemDefinitions.toArray(), []) ?? [],

    async addLookupItem(table: 'organisationalUnits' | 'itemTypes' | 'manufacturers', name: string) {
        try {
            await db[table].add({ name });
        } catch (error) {
            console.error(`Failed to add to ${table}: `, error);
        }
    },

    async addItemDefinition(def: Omit<IDbItemDefinition, 'id'>) {
        try {
            await db.itemDefinitions.add(def as IDbItemDefinition);
        } catch (error) {
            console.error('Failed to add item definition: ', error);
        }
    },
};

export type Scope = 'user' | 'editor' | 'admin';
