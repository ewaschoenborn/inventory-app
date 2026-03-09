import React from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronUp } from 'lucide-react';
import IconContainer from '../utils/IconContainer';

export type QuantitySpinnerProps = {
    value: number;
    min?: number;
    max?: number;
    disabled?: boolean;
    onChange: (newValue: number) => void;
    ariaLabel?: string;
};

export default function QuantitySpinner(props: QuantitySpinnerProps) {
    const { value, onChange, disabled = false, ariaLabel } = props;
    const min = props.min ?? 1;
    const max = props.max ?? Number.POSITIVE_INFINITY;

    const safeValue = Number.isFinite(value) ? value : min;
    const canDecrement = !disabled && safeValue > min;
    const canIncrement = !disabled && safeValue < max;

    const stop = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    return (
        <Pill
            aria-label={ariaLabel}
            aria-disabled={disabled}
            $disabled={disabled}
            onClick={stop}
            onPointerDown={stop}
        >
            <Value aria-label="Quantity">{safeValue}</Value>
            <Arrows $disabled={disabled}>
                <ArrowButton
                    type="button"
                    aria-label="Increase quantity"
                    disabled={!canIncrement}
                    onClick={(e) => {
                        stop(e);
                        if (!canIncrement) return;
                        onChange(Math.min(max, safeValue + 1));
                    }}
                    onPointerDown={stop}
                >
                    <IconContainer icon={ChevronUp} width="0.95em" height="0.95em" />
                </ArrowButton>
                <ArrowButton
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={!canDecrement}
                    onClick={(e) => {
                        stop(e);
                        if (!canDecrement) return;
                        onChange(Math.max(min, safeValue - 1));
                    }}
                    onPointerDown={stop}
                >
                    <IconContainer icon={ChevronDown} width="0.95em" height="0.95em" />
                </ArrowButton>
            </Arrows>
        </Pill>
    );
}

const Pill = styled.div<{ $disabled: boolean }>`
    height: 38px;
    min-width: 74px;
    display: inline-flex;
    align-items: stretch;
    border-radius: 999px;
    overflow: hidden;
    user-select: none;

    background: ${(p) => (p.$disabled ? 'var(--color-bg-accent)' : 'var(--color-primary)')};
    color: ${(p) => (p.$disabled ? 'var(--color-font-secondary)' : 'white')};
    border: 1px solid var(--color-bg-accent-darker);

    box-shadow: ${(p) => (p.$disabled ? 'none' : '0 2px 6px rgba(var(--color-primary-rgb), 0.25)')};
`;

const Value = styled.div`
    flex: 1;
    min-width: 38px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
`;

const Arrows = styled.div<{ $disabled: boolean }>`
    width: 30px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid ${(p) => (p.$disabled ? 'var(--color-bg-accent-darker)' : 'rgba(255, 255, 255, 0.25)')};
`;

const ArrowButton = styled.button`
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: inherit;
    padding: 0;
    cursor: pointer;

    &:active:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
    }

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
`;
