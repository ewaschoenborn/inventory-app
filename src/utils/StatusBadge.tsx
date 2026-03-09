import styled from 'styled-components';
import type { DamageLevelType } from '../db/items';
import DamageLevelTranslation from './damageLevels';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import IconContainer from './IconContainer';

export const DamageLevelStyles = {
    none: {
        color: 'var(--color-success-text)',
        colorBg: 'var(--color-success-bg)',
        colorRGB: 'var(--color-success-text-rgb)',
        icon: CheckCircle2,
    },
    minor: {
        color: 'var(--color-warning-text)',
        colorBg: 'var(--color-warning-bg)',
        colorRGB: 'var(--color-warning-text-rgb)',
        icon: AlertCircle,
    },
    major: {
        color: 'var(--color-danger-text)',
        colorBg: 'var(--color-danger-bg)',
        colorRGB: 'var(--color-danger-text-rgb)',
        icon: XCircle,
    },
    total: {
        color: 'var(--color-forbidden-text)',
        colorBg: 'var(--color-forbidden-bg)',
        colorRGB: 'var(--color-forbidden-text-rgb)',
        icon: XCircle,
    },
};

const StatusBadge = (props: { damageLevelType: DamageLevelType; omitText?: boolean }) => {
    const { damageLevelType } = props;

    const damageStyle = DamageLevelStyles[damageLevelType] || DamageLevelStyles.none;

    return (
        <StatusBadgeWrapper $color={damageStyle.color} $bgColor={damageStyle.colorBg} $omitText={props.omitText}>
            <IconContainer icon={damageStyle.icon} />{' '}
            {props.omitText ? '' : (DamageLevelTranslation[damageLevelType] ?? '-')}
        </StatusBadgeWrapper>
    );
};

export const StatusBadgeWrapper = styled.span<{ $color: string; $bgColor: string; $omitText?: boolean }>`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px ${(p) => (p.$omitText ? '' : '10px')};
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    background-color: ${(p) => p.$bgColor};
    color: ${(p) => p.$color};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        border-radius: 500px;
    }
`;

export default StatusBadge;
