import { theme } from './theme';

export type ThemeStatus = 'good' | 'warning' | 'error' | 'critical' | 'neutral';

/**
 * Maps status strings to theme status types
 */
export const mapStatusToTheme = (status?: string): ThemeStatus => {
    if (status === 'Good' || status === 'OK' || status === 'GREEN') return 'good';
    if (status === 'Minor' || status === 'Soon' || status === 'YELLOW' || status === 'Low') return 'warning';
    if (status === 'Damaged' || status === 'RED') return 'error';
    if (status === 'Out of order' || status === 'Critical') return 'critical';
    return 'neutral';
};

/**
 * Maps damage level to status string
 */
export const mapDamageLevelToStatus = (damageLevel?: string): string => {
    if (damageLevel === 'none') return 'Good';
    if (damageLevel === 'minor') return 'Minor';
    if (damageLevel === 'major') return 'Damaged';
    if (damageLevel === 'total') return 'Out of order';
    return 'Good';
};




