
import * as yup from 'yup';
import type { ILabel } from './labels';

export const DamageLevelType = {
    NONE: 'none',
    MINOR: 'minor',
    MAJOR: 'major',
    TOTAL: 'total',
} as const;


export type DamageLevelType = (typeof DamageLevelType)[keyof typeof DamageLevelType];

export interface IItem {
    id: number;
    itemId: string;
    inventoryNumber?: string;
    deviceNumber?: string;
    name: string;
    isSet: boolean;
    art: string;
    amountTarget: number;
    amountActual: number;
    availability: number;
    damageLevel: DamageLevelType;
    lastInspection?: string; //change to moment.js Date,
    inspectionIntervalMonths?: number;
    location: string;
    level: number;
    remark?: string;
    labels?: ILabel[];
}

export const ItemValidationSchema = yup.object().shape({
    itemId: yup.string().required('ID ist erforderlich.').min(1, 'ID darf nicht leer sein.'),
    name: yup.string().required('Name ist erforderlich.').min(1, 'Name darf nicht leer sein.'),
    inventoryNumber: yup.string().optional(),
    deviceNumber: yup.string().optional(),
    location: yup.string().optional(),
    remark: yup.string().optional(),
    amountTarget: yup.number().optional().min(0, 'Zielmenge darf nicht negativ sein.'),
    amountActual: yup.number().optional().min(0, 'Istmenge darf nicht negativ sein.'),
    availability: yup
        .number()
        .optional()
        .min(0, 'Verfügbarkeit darf nicht negativ sein.')
        .when('amountActual', {
            is: (val: any) => typeof val === 'number',
            then: (schema: yup.NumberSchema) =>
                schema.max(yup.ref('amountActual') as any, 'Verfügbarkeit darf nicht größer als Istmenge sein.'),
        }),
    level: yup.number().optional(),
    inspectionIntervalMonths: yup.number().optional().min(0, 'Inspektionsinterval darf nicht negativ sein.'),
    isSet: yup.boolean(),
    damageLevel: yup.string(),
    lastInspection: yup.string(),
});
