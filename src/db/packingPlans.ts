// Emergency scenario types
export const EmergencyScenarioType = {
    FLOOD: 'flood',
    FIRE: 'fire',
    EARTHQUAKE: 'earthquake',
    STORM: 'storm',
    SEARCH_RESCUE: 'search_rescue',
    CUSTOM: 'custom',
} as const;

export type EmergencyScenarioType = (typeof EmergencyScenarioType)[keyof typeof EmergencyScenarioType];

// Packing plan (emergency scenario template)
export interface IPackingPlan {
    id: string;
    name: string; // e.g., "Hochwasser" (Flood)
    scenarioType: EmergencyScenarioType;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

// Items in a packing plan
export interface IPackingPlanItem {
    id: string;
    packingPlanId: string;
    itemId: string; // Reference to IItem
    requiredQuantity: number; // How many are needed for this scenario
    notes?: string; // Optional notes about why this item is needed
    order: number; // Display order
}

