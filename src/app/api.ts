import { type IItem } from '../db/items';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

export type Scope = 'user' | 'editor' | 'admin';

export const inventoryApi = {
    async addItem(itemData: Omit<IItem, 'id'>): Promise<void> {
        try {
            await db.items.add(itemData as IItem);
        } catch (error) {
            console.error('Failed to add inventory item: ', error);
            if ((error as Error).name === 'ConstraintError') {
                console.error('Error: An item with this "Sachnummer" (id) already exists.');
            }
        }
    },
    useItems() {
        const items: IItem[] | undefined = useLiveQuery(() => db.items.orderBy('id').toArray(), []);
        return items ?? [];
    },
    async deleteItem(id: string): Promise<void> {
        try {
            await db.items.delete(id);
        } catch (error) {
            console.error('Failed to delete item: ', error);
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
};
