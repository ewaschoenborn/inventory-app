import Dexie, { type Table } from 'dexie';
import type { IItem } from './items';

export interface IPackingPlan {
    id: string;
    name: string;
    items: string[];
    createdAt: string;
}

export class InventoryDb extends Dexie {
    public items!: Table<IItem, string>;
    public packingPlans!: Table<IPackingPlan, string>;

    constructor() {
        super('InventoryDb');

        this.version(1).stores({
            items: [
                '&id',
                '&inventoryNumber',
                '&deviceNumber',
                'name',
                'isSet',
                'amountTarget',
                'amountActual',
                'availability',
                'damageLevel',
                'lastInspection',
                'inspectionIntervalMonths',
                'location',
                'level',
                'remark',
            ].join(','),

            packingPlans: '&id,name,createdAt',
        });
    }
}

export const db = new InventoryDb();
