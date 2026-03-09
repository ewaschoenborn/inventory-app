import styled from 'styled-components';
import { theme } from './theme';

// Card component
export const Card = styled.div<{ $withLeftBorder?: boolean; $leftBorderColor?: string }>`
    background: ${theme.colors.background.white};
    border: 0.5px solid ${theme.colors.border.default};
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.xl};
    box-shadow: ${theme.shadows.sm};
    box-sizing: border-box;
    ${({ $withLeftBorder, $leftBorderColor }) =>
        $withLeftBorder ? `border-left: 4px solid ${$leftBorderColor || theme.colors.status.neutral.main};` : ''}
`;

// Form Input
export const Input = styled.input`
    width: 100%;
    padding: ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.base};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border.default};
    background-color: ${theme.colors.background.light};
    color: ${theme.colors.text.primary};
    font-family: ${theme.typography.fontFamily};
    box-sizing: border-box;
    transition: ${theme.transitions.default};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        background-color: ${theme.colors.background.white};
        box-shadow: 0 0 0 3px ${theme.colors.primaryLight};
    }

    &::placeholder {
        color: ${theme.colors.text.placeholder};
    }
`;

// Form Select
export const Select = styled.select`
    width: 100%;
    padding: ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.base};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border.default};
    background-color: ${theme.colors.background.light};
    color: ${theme.colors.text.primary};
    font-family: ${theme.typography.fontFamily};
    box-sizing: border-box;
    transition: ${theme.transitions.default};
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        background-color: ${theme.colors.background.white};
        box-shadow: 0 0 0 3px ${theme.colors.primaryLight};
    }
`;

// Textarea
export const Textarea = styled.textarea`
    width: 100%;
    min-height: 80px;
    padding: ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.base};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border.default};
    background-color: ${theme.colors.background.light};
    color: ${theme.colors.text.primary};
    resize: none;
    overflow: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: ${theme.typography.fontFamily};
    line-height: 1.5;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${theme.colors.status.neutral.main};
        background-color: ${theme.colors.background.white};
    }
`;

// Label (for form labels - keep existing uppercase style)
export const Label = styled.label`
    display: block;
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.xs};
    text-transform: uppercase;
    letter-spacing: ${theme.typography.letterSpacing.tight};
    margin-bottom: ${theme.spacing.sm};
`;

// Data Label (for data display labels - consistent grey tone, smaller font)
export const DataLabel = styled.span`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    font-weight: ${theme.typography.fontWeight.medium};
    line-height: 1.4;
`;

// Data Value (darker color, same or slightly larger than labels)
export const DataValue = styled.span`
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.normal};
    line-height: 1.5;
`;

// Button variants
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.sm};
    padding: 0 ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    border: none;
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.semibold};
    cursor: pointer;
    transition: ${theme.transitions.default};

    ${({ $variant = 'primary' }) => {
        switch ($variant) {
            case 'primary':
                return `
                    background-color: ${theme.colors.primary};
                    color: white;
                    height: 44px;
                    
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.primaryHover};
                        transform: translateY(-1px);
                        box-shadow: ${theme.shadows.lg};
                    }
                `;
            case 'secondary':
                return `
                    background-color: ${theme.colors.text.muted};
                    color: white;
                    height: 44px;
                    
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.text.secondary};
                        transform: translateY(-1px);
                        box-shadow: ${theme.shadows.lg};
                    }
                `;
            case 'ghost':
                return `
                    background-color: ${theme.colors.background.gray};
                    color: ${theme.colors.border.dark};
                    border: 1px solid ${theme.colors.border.dark};
                    height: 36px;
                    padding: 0 ${theme.spacing.lg};
                    font-size: ${theme.typography.fontSize.sm};
                    font-weight: ${theme.typography.fontWeight.medium};
                    
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.border.light};
                        border-color: ${theme.colors.text.secondary};
                        color: ${theme.colors.text.secondary};
                        transform: translateY(-1px);
                    }
                `;
            case 'danger':
                return `
                    background-color: ${theme.colors.status.error.main};
                    color: white;
                    height: 44px;

                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.status.error.dark};
                        transform: translateY(-1px);
                        box-shadow: ${theme.shadows.lg};
                    }
                `;
        }
    }}

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

// Button Group
export const ButtonGroup = styled.div<{ $direction?: 'row' | 'column' }>`
    display: flex;
    gap: ${theme.spacing.md};
    flex-direction: ${({ $direction = 'column' }) => $direction};
    
    ${Button} {
        flex: 1;
    }
    
    @media (min-width: ${theme.breakpoints.sm}) {
        flex-direction: row;
        
        ${Button} {
            flex: 0 1 auto;
        }
    }
`;

// Form Group
export const FormGroup = styled.div`
    margin-bottom: ${theme.spacing.xl};
`;

// Status Badge
export const StatusBadge = styled.span<{ $status?: 'good' | 'warning' | 'error' | 'critical' | 'neutral' }>`
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    padding: ${theme.spacing.xs} 10px;
    border-radius: ${theme.borderRadius.xl};
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.semibold};

    ${({ $status = 'neutral' }) => {
        const statusColors = theme.colors.status[$status];
        return `
            background-color: ${statusColors.light};
            color: ${statusColors.dark};
        `;
    }}
`;

// Info Card (with status border)
export const InfoCard = styled.div<{ $status?: 'good' | 'warning' | 'error' | 'critical' | 'neutral' }>`
    width: 100%;
    max-width: 100%;
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
    background-color: ${theme.colors.background.white};
    box-sizing: border-box;
    border-left: 4px solid ${({ $status = 'neutral' }) => theme.colors.status[$status].main};
    border: 1px solid ${({ $status = 'neutral' }) => theme.colors.status[$status].light};
    border-left-width: 4px;
    box-shadow: ${theme.shadows.md};
`;

// Container
export const Container = styled.div<{ $maxWidth?: string }>`
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    
    ${({ $maxWidth }) =>
        $maxWidth &&
        `
        @media (min-width: ${theme.breakpoints.lg}) {
            max-width: ${$maxWidth};
            margin: 0 auto;
        }
    `}
`;

// Content Wrapper
export const ContentWrapper = styled.div`
    padding: ${theme.spacing.xl};
`;

// Back Button (shared across multiple components)
export const BackButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.medium};
    transition: ${theme.transitions.default};
    border-radius: ${theme.borderRadius.md};

    &:hover {
        color: ${theme.colors.primary};
        background-color: ${theme.colors.background.light};
    }

    &:active {
        opacity: 0.7;
        background-color: ${theme.colors.background.gray};
    }
`;

// Header (common header pattern)
export const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: 0 ${theme.spacing.lg} ${theme.spacing.xl} 0;
    margin-bottom: 0;
`;

// Subtitle (for item details headers)
export const Subtitle = styled.div`
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.muted};
    font-weight: ${theme.typography.fontWeight.medium};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    margin: 0;
    padding: 0;

    @media (min-width: ${theme.breakpoints.md}) {
        font-size: ${theme.typography.fontSize.md};
    }
`;

// Helper Text (for form hints)
export const HelperText = styled.p`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
    margin: ${theme.spacing.xs} 0 0 0;
    font-style: italic;
`;

// Controls Wrapper (sticky wrapper for filters/controls)
export const ControlsWrapper = styled.div`
    width: 100%;
    max-width: 100%;
    margin-top: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.lg};
    box-sizing: border-box;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: ${theme.colors.background.lighter};
    padding-top: ${theme.spacing.sm};
    padding-bottom: ${theme.spacing.sm};

    @media (min-width: ${theme.breakpoints.lg}) {
        width: 100%;
        max-width: 896px;
        margin: ${theme.spacing.sm} auto ${theme.spacing.xl} auto;
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        background-color: ${theme.colors.background.lighter};
    }
`;

// Item Card (for item lists)
export const ItemCard = styled.div<{ $status?: 'good' | 'warning' | 'error' | 'critical' | 'neutral' }>`
    width: 100%;
    max-width: 100%;
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.md};
    background-color: ${theme.colors.background.white};
    box-sizing: border-box;
    border-left: 4px solid ${({ $status = 'neutral' }) => theme.colors.status[$status].main};
    border: 1px solid ${({ $status = 'neutral' }) => theme.colors.status[$status].light};
    border-left-width: 4px;
    box-shadow: ${theme.shadows.md};
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.lg};
        border-color: ${({ $status = 'neutral' }) => theme.colors.status[$status].main};
    }
`;

// Card Header
export const CardHeader = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.sm};
`;

// Card Header Left
export const CardHeaderLeft = styled.div`
    flex: 1;
    min-width: 0;
`;

// Card Header Right
export const CardHeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    flex-shrink: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.sm};
`;

// Item Title
export const ItemTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    font-size: ${theme.typography.fontSize.md};
    color: ${theme.colors.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: ${theme.spacing.xs};
`;

// Inventory Number
export const InventoryNumber = styled.div`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.placeholder};
    margin-top: 2px;
`;

// Info Row
export const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.secondary};
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.sm};
`;

// Info Item
export const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
`;

// Info Item Right
export const InfoItemRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: ${theme.spacing.xs};
    text-align: right;
    min-width: 0;
    flex-shrink: 0;
`;

// Quantity Label
export const QuantityLabel = styled.div`
    font-size: 11px;
    color: ${theme.colors.text.muted};
    white-space: nowrap;
    line-height: 1.4;
`;

// Unavailable Badge
export const UnavailableBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    padding: ${theme.spacing.xs} 10px;
    border-radius: ${theme.borderRadius.xl};
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.semibold};
    background-color: ${theme.colors.status.error.light};
    color: ${theme.colors.status.error.dark};
`;

// Cards Container
export const CardsContainer = styled.div`
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 0 ${theme.spacing.lg};
`;
