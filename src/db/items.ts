export const DamageLevelType = {
    NONE: 'none',
    MINOR: 'minor',
    MAJOR: 'major',
    TOTAL: 'total',
} as const;

export type DamageLevelType = (typeof DamageLevelType)[keyof typeof DamageLevelType];

export interface IItem {
    id: string;
    inventoryNumber?: string;
    deviceNumber?: string;
    name: string;
    isSet: boolean;
    amountTarget: number;
    amountActual: number;
    availability: number;
    damageLevel: DamageLevelType;
    lastInspection?: string; //change to moment.js Date,
    inspectionIntervalMonths?: number;
    location: string;
    level: number;
    remark?: string;
}
