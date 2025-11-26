import Dexie, { type Table } from 'dexie';
import type {
    IOrganisationalUnit,
    IItemType,
    IManufacturer,
    IDbItemDefinition,
    IDbInventoryItem,
} from './legacy.items';

export class InventoryDb extends Dexie {
    public organisationalUnits!: Table<IOrganisationalUnit, number>;
    public itemTypes!: Table<IItemType, number>;
    public manufacturers!: Table<IManufacturer, number>;

    public itemDefinitions!: Table<IDbItemDefinition, number>;
    public inventoryItems!: Table<IDbInventoryItem, number>;

    constructor() {
        super('InventoryDb');

        this.version(1).stores({
            organisationalUnits: '++id, &name', // PrimaryKey: id, UniqueIndex: name
            itemTypes: '++id, &name', // PrimaryKey: id, UniqueIndex: name
            manufacturers: '++id, &name', // PrimaryKey: id, UniqueIndex: name

            itemDefinitions: ['++id', 'name', 'manufacturerId', 'itemTypeId', '[manufacturerId+itemTypeId]'].join(','),

            inventoryItems: [
                '++id',
                '&externalId',
                'position',
                'inventoryId',
                'deviceId',
                'floor',
                'isAvailable',
                'compoundType',
                'organisationalUnitId',
                'itemDefinitionId',
            ].join(','),
        });
    }
}

// Global instance for your app
export const db = new InventoryDb();
