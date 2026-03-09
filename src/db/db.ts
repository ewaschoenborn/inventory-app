import Dexie, { type Table } from 'dexie';
import type { IItem } from './items';
import type { IPackingPlan, IPackingPlanItem } from './packingPlans';

export class InventoryDb extends Dexie {
    public items!: Table<IItem, number>;
    public packingPlans!: Table<IPackingPlan, string>;
    public packingPlanItems!: Table<IPackingPlanItem, string>;

    constructor() {
        super('InventoryDb');

        this.version(1).stores({
            items: [
                '++id',
                'itemId',
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
        });

        this.version(2).stores({
            items: [
                '++id',
                'itemId',
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
            packingPlans: '&id,scenarioType,createdAt',
            packingPlanItems: '&id,packingPlanId,Iid,order',
        });

        this.version(3).stores({
            items: [
                '++id',
                'itemId',
                '&inventoryNumber',
                '&deviceNumber',
                'name',
                'isSet',
                'art',
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
            packingPlans: '&id,scenarioType,createdAt',
            packingPlanItems: '&id,packingPlanId,Iid,order',
        });

        this.version(4).stores({
            items: [
                '++id',
                'itemId',
                '&inventoryNumber',
                'deviceNumber',
                'name',
                'isSet',
                'art',
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
            packingPlans: '&id,scenarioType,createdAt',
            packingPlanItems: '&id,packingPlanId,Iid,order',
        });
    }
}

export const db = new InventoryDb();
