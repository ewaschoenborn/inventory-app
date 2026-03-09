import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import type { IPackingPlan, IPackingPlanItem } from '../db/packingPlans';

export const packingPlanApi = {
    async addPackingPlan(planData: Omit<IPackingPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const now = new Date().toISOString();
            const id = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const plan: IPackingPlan = {
                ...planData,
                id,
                createdAt: now,
                updatedAt: now,
            };
            await db.packingPlans.add(plan);
            return id;
        } catch (error) {
            console.error('Failed to add packing plan: ', error);
            throw error;
        }
    },

    async updatePackingPlan(id: string, updates: Partial<Omit<IPackingPlan, 'id' | 'createdAt'>>): Promise<void> {
        try {
            const existingPlan = await db.packingPlans.get(id);
            if (!existingPlan) {
                throw new Error(`Packing plan with id "${id}" not found`);
            }
            await db.packingPlans.update(id, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Failed to update packing plan: ', error);
            throw error;
        }
    },

    async deletePackingPlan(id: string): Promise<void> {
        try {
            // Delete all items associated with this plan
            await db.packingPlanItems.where('packingPlanId').equals(id).delete();
            // Delete the plan
            await db.packingPlans.delete(id);
        } catch (error) {
            console.error('Failed to delete packing plan: ', error);
            throw error;
        }
    },

    async getPackingPlan(id: string): Promise<IPackingPlan | undefined> {
        try {
            return await db.packingPlans.get(id);
        } catch (error) {
            console.error('Failed to get packing plan: ', error);
            throw error;
        }
    },

    async getAllPackingPlans(): Promise<IPackingPlan[]> {
        try {
            return await db.packingPlans.orderBy('createdAt').reverse().toArray();
        } catch (error) {
            console.error('Failed to get all packing plans: ', error);
            throw error;
        }
    },

    usePackingPlans() {
        const plans: IPackingPlan[] | undefined = useLiveQuery(
            () => db.packingPlans.orderBy('createdAt').reverse().toArray(),
            []
        );
        return plans ?? [];
    },

    usePackingPlan(planId: string) {
        const plan: IPackingPlan | undefined = useLiveQuery(() => db.packingPlans.get(planId), [planId]);
        return plan;
    },

    // Packing Plan Items
    async addPackingPlanItem(itemData: Omit<IPackingPlanItem, 'id'>): Promise<string> {
        try {
            const id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const item: IPackingPlanItem = {
                ...itemData,
                id,
            };
            await db.packingPlanItems.add(item);
            return id;
        } catch (error) {
            console.error('Failed to add packing plan item: ', error);
            throw error;
        }
    },

    async updatePackingPlanItem(id: string, updates: Partial<Omit<IPackingPlanItem, 'id'>>): Promise<void> {
        try {
            await db.packingPlanItems.update(id, updates);
        } catch (error) {
            console.error('Failed to update packing plan item: ', error);
            throw error;
        }
    },

    async deletePackingPlanItem(id: string): Promise<void> {
        try {
            await db.packingPlanItems.delete(id);
        } catch (error) {
            console.error('Failed to delete packing plan item: ', error);
            throw error;
        }
    },

    async getPackingPlanItems(packingPlanId: string): Promise<IPackingPlanItem[]> {
        try {
            return await db.packingPlanItems.where('packingPlanId').equals(packingPlanId).sortBy('order');
        } catch (error) {
            console.error('Failed to get packing plan items: ', error);
            throw error;
        }
    },

    usePackingPlanItems(packingPlanId: string) {
        const items: IPackingPlanItem[] | undefined = useLiveQuery(
            () => db.packingPlanItems.where('packingPlanId').equals(packingPlanId).sortBy('order'),
            [packingPlanId]
        );
        return items ?? [];
    },
};
