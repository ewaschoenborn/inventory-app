import styled from 'styled-components';

export const LabelSelectorWrapper = styled.div`
    position: relative;
`;

export const LabelSearchInput = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
`;

export const SelectedLabels = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
`;

export const LabelBadge = styled.div<{ color: string }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: ${(props) => hexToRgba(props.color, 0.25)};
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        background-color: ${(props) => props.color};
        border-radius: 50%;
        flex-shrink: 0;
    }
`;

export const LabelDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const LabelOption = styled.div<{ $isSelected: boolean; color: string }>`
    padding: 8px;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: ${(props) => (props.$isSelected ? '#f0f8ff' : 'transparent')};
    &:hover {
        background: var(--color-bg-accent);
    }

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        background-color: ${(props) => props.color};
        border-radius: 50%;
        margin-right: 8px;
        flex-shrink: 0;
    }

    & > :last-child {
        margin-left: auto;
    }
`;

export const NoLabels = styled.div`
    padding: 8px;
    color: #999;
    text-align: center;
`;

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
