export interface IOrganisationalUnit {
    id?: number;
    name: string;
}

export const CompoundType = {
    SET: 'set',
    PART: 'part',
} as const;

export type CompoundType = (typeof CompoundType)[keyof typeof CompoundType];

export interface IItemType {
    id?: number;
    name: string; // e.g. 'Kettensäge', 'Funkgerät'
}

export interface IManufacturer {
    id?: number;
    name: string;
}

export interface IDbItemDefinition {
    id?: number;
    name?: string; // e.g. 'Gegenstand_74'; may be ommitted if 'type' is specified

    manufacturerId?: number;
    itemTypeId?: number;
}

export interface IDbInventoryItem {
    id?: number;
    externalId: string; // "Sachnummer"
    floor: number; // "Ebene"
    amountTarget: number;
    amountActual: number;
    isAvailable: boolean;
    position: string; // "Ort"
    inventoryId?: string;
    deviceId?: string;

    compoundType: CompoundType; // 'set' | 'part'

    organisationalUnitId: number;
    itemDefinitionId: number;
}
