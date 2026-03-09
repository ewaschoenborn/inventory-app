import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
    ChevronLeft,
    Pen,
    Droplets,
    Flame,
    Wind,
    Search,
    FileText,
    Plus,
    X,
    Trash2,
    Package,
    CheckCircle2,
} from 'lucide-react';
import { packingPlanApi } from '../../app/packingPlanApi';
import { inventoryApi } from '../../app/api';
import type { EmergencyScenarioType } from '../../db/packingPlans';
import type { IItem } from '../../db/items';
import IconContainer from '../../utils/IconContainer';
import { theme } from '../../styles/theme';
import {
    Container,
    Header,
    BackButton,
    Card,
    Button,
    ContentWrapper,
    Label,
    DataValue,
    Input,
} from '../../styles/components';

// Icon mapping for scenario types shown on the plan header.
const getScenarioIcon = (scenarioType: EmergencyScenarioType) => {
    switch (scenarioType) {
        case 'flood':
            return Droplets;
        case 'fire':
            return Flame;
        case 'storm':
            return Wind;
        case 'earthquake':
        case 'search_rescue':
            return Search;
        default:
            return FileText;
    }
};

// Human-readable labels for scenario types.
const getScenarioLabel = (scenarioType: EmergencyScenarioType): string => {
    switch (scenarioType) {
        case 'flood':
            return 'Flood';
        case 'fire':
            return 'Fire';
        case 'storm':
            return 'Storm';
        case 'earthquake':
            return 'Earthquake';
        case 'search_rescue':
            return 'Search & Rescue';
        case 'custom':
            return 'Custom';
        default:
            return scenarioType;
    }
};

const PackingPlanDetails = () => {
    const { planId } = useParams<{ planId: string }>();
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingPlan, setIsDeletingPlan] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [packMode, setPackMode] = useState(false);
    const [packedItemIds, setPackedItemIds] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    // Live data for plan header, plan items, and inventory selection.
    const plan = planId ? packingPlanApi.usePackingPlan(planId) : undefined;
    const planItems = planId ? packingPlanApi.usePackingPlanItems(planId) : [];
    const allInventoryItems = inventoryApi.useItems();

    const handleAddItem = async () => {
        // Add a new item row to the plan (after basic checks).
        if (!planId || !selectedItemId || quantity < 1) {
            alert('Please select an item and enter a valid quantity.');
            return;
        }

        // Check if item already exists in plan
        const existingItem = planItems.find((item) => item.Iid.toString() === selectedItemId);
        if (existingItem) {
            alert('This item is already in the packing plan.');
            return;
        }

        try {
            const maxOrder = planItems.length > 0 ? Math.max(...planItems.map((i) => i.order)) : -1;
            await packingPlanApi.addPackingPlanItem({
                packingPlanId: planId,
                Iid: Number(selectedItemId),
                requiredQuantity: quantity,
                order: maxOrder + 1,
            });
            setShowAddItemModal(false);
            setSelectedItemId('');
            setQuantity(1);
            setSearchTerm('');
        } catch (error) {
            console.error('Failed to add item:', error);
            alert('Failed to add item to packing plan.');
        }
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        // Update required quantity for an existing plan item.
        if (newQuantity < 1) {
            alert('Quantity must be at least 1.');
            return;
        }
        try {
            await packingPlanApi.updatePackingPlanItem(itemId, { requiredQuantity: newQuantity });
        } catch (error) {
            console.error('Failed to update quantity:', error);
            alert('Failed to update quantity.');
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        // Remove an item row from the plan.
        if (!window.confirm('Are you sure you want to remove this item from the packing plan?')) {
            return;
        }
        try {
            await packingPlanApi.deletePackingPlanItem(itemId);
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Failed to remove item from packing plan.');
        }
    };

    // Get item details for display
    const getItemDetails = (itemId: number): IItem | undefined => {
        return allInventoryItems.find((item) => item.id === itemId);
    };

    // Persist per-plan packed state in localStorage (if available).
    const packedStorageKey = useMemo(() => {
        if (!planId) return '';
        return `packingPlan:${planId}:packedItemIds`;
    }, [planId]);

    useEffect(() => {
        if (!packedStorageKey) return;
        try {
            const raw = localStorage.getItem(packedStorageKey);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return;
            setPackedItemIds(new Set(parsed.filter((x) => typeof x === 'string')));
        } catch {}
    }, [packedStorageKey]);

    useEffect(() => {
        if (!packedStorageKey) return;
        if (packedItemIds.size === 0) return;
        try {
            localStorage.setItem(packedStorageKey, JSON.stringify(Array.from(packedItemIds)));
        } catch {}
    }, [packedItemIds, packedStorageKey]);

    useEffect(() => {
        if (!planId || planItems.length === 0) return;
        const itemIdsInPlan = new Set(planItems.map((pi) => pi.Iid.toString()));
        setPackedItemIds((prev) => {
            if (prev.size === 0) return prev;
            const next = new Set(Array.from(prev).filter((id) => itemIdsInPlan.has(id)));
            return next.size === prev.size ? prev : next;
        });
    }, [planId, planItems]);

    const togglePacked = (itemId: string) => {
        // Toggle packed/unpacked for an item row.
        setPackedItemIds((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) next.delete(itemId);
            else next.add(itemId);
            return next;
        });
    };

    const packedCount = planItems.reduce((acc, pi) => acc + (packedItemIds.has(pi.Iid.toString()) ? 1 : 0), 0);

    // Filter inventory items for modal
    const filteredInventoryItems = allInventoryItems.filter((item) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.id.toString().includes(term) ||
            (item.inventoryNumber && item.inventoryNumber.toLowerCase().includes(term)) ||
            (item.location && item.location.toLowerCase().includes(term))
        );
    });

    // Exclude items already in the plan
    const availableItems = filteredInventoryItems.filter(
        (item) => !planItems.some((planItem) => planItem.Iid === item.id)
    );

    if (!plan) {
        return (
            <StyledContainer>
                <LoadingMessage>Loading packing plan...</LoadingMessage>
            </StyledContainer>
        );
    }

    const Icon = getScenarioIcon(plan.scenarioType);
    const scenarioLabel = getScenarioLabel(plan.scenarioType);

    const openDeleteConfirm = () => setShowDeleteConfirm(true);

    const handleConfirmDeletePlan = async () => {
        if (!planId) return;
        setIsDeletingPlan(true);
        try {
            await packingPlanApi.deletePackingPlan(planId);
            navigate('/packing-plans', { replace: true });
        } catch (error) {
            console.error('Failed to delete packing plan:', error);
            alert('Failed to delete packing plan.');
        } finally {
            setIsDeletingPlan(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <StyledContainer>
            <StyledHeader>
                <HeaderContent>
                    <StyledBackButton onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </StyledBackButton>
                    <Title>
                        <IconContainer icon={Icon} />
                        {plan.name}
                    </Title>
                    <HeaderEditButton $variant="primary" onClick={() => navigate(`/packing-plans/${plan.id}/edit`)}>
                        <IconContainer icon={Pen} />
                        <span>Bearbeiten</span>
                    </HeaderEditButton>
                    <HeaderDangerActionButton type="button" onClick={openDeleteConfirm}>
                        <IconContainer icon={Trash2} />
                        <span>Löschen</span>
                    </HeaderDangerActionButton>
                </HeaderContent>
            </StyledHeader>

            <StyledContentWrapper>
                <InfoCard>
                    <InfoRow>
                        <div style={{ flex: 1 }}>
                            <InfoLabel>Scenario Type</InfoLabel>
                            <InfoValue>{scenarioLabel}</InfoValue>
                        </div>
                    </InfoRow>
                </InfoCard>

                {plan.description && (
                    <DetailsCard>
                        <InfoLabel>Description</InfoLabel>
                        <InfoValue>{plan.description}</InfoValue>
                    </DetailsCard>
                )}

                <ItemsSection>
                    <ItemsHeader>
                        <InfoLabel>Items ({planItems.length})</InfoLabel>
                        <ItemsHeaderActions>
                            {packMode ? (
                                <>
                                    <PackProgress>
                                        {packedCount}/{planItems.length} packed
                                    </PackProgress>
                                    <PackButton $variant="primary" onClick={() => setPackMode(false)}>
                                        <IconContainer icon={X} />
                                        <span>Save</span>
                                    </PackButton>
                                </>
                            ) : (
                                <>
                                    <PackButton $variant="ghost" onClick={() => setPackMode(true)}>
                                        <IconContainer icon={Package} />
                                        <span>Pack</span>
                                    </PackButton>
                                    <AddItemButton
                                        $variant="primary"
                                        onClick={() =>
                                            navigate('/items', {
                                                state: {
                                                    packMode: true, // automatically activate pack mode
                                                    planId: planId, // remember which packing plan to add to
                                                },
                                            })
                                        }
                                    >
                                        <IconContainer icon={Plus} />
                                        <span>Add Item</span>
                                    </AddItemButton>
                                </>
                            )}
                        </ItemsHeaderActions>
                    </ItemsHeader>

                    {planItems.length === 0 ? (
                        <EmptyItemsMessage>
                            <p>No items in this packing plan yet.</p>
                        </EmptyItemsMessage>
                    ) : (
                        <ItemsList>
                            {planItems.map((planItem) => {
                                const item = getItemDetails(planItem.Iid);
                                const itemName = item?.name ?? 'Unknown item';
                                const itemId = item?.id ?? planItem.Iid;
                                const inventoryNumber = item?.inventoryNumber;
                                const location = item?.location;
                                const missingNote = item ? '' : ' • Item missing from inventory';
                                const isPacked = packedItemIds.has(planItem.Iid.toString());

                                return (
                                    <ItemRow key={planItem.id} data-packed={isPacked ? 'true' : 'false'}>
                                        <ItemInfo>
                                            <ItemName>
                                                <span>{itemName}</span>
                                                {isPacked && (
                                                    <PackedBadge>
                                                        <IconContainer icon={CheckCircle2} />
                                                        Packed
                                                    </PackedBadge>
                                                )}
                                            </ItemName>
                                            <ItemMeta>
                                                ID: {itemId}
                                                {inventoryNumber && ` • Inv: ${inventoryNumber}`}
                                                {location && ` • Location: ${location}`}
                                                {missingNote}
                                            </ItemMeta>
                                        </ItemInfo>
                                        <QuantityInput
                                            type="number"
                                            min="1"
                                            value={planItem.requiredQuantity}
                                            onChange={(e) => {
                                                const newQty = parseInt(e.target.value, 10);
                                                if (!isNaN(newQty) && newQty > 0) {
                                                    handleUpdateQuantity(planItem.id, newQty);
                                                }
                                            }}
                                        />
                                        {packMode ? (
                                            <PackCheckboxWrapper>
                                                <Checkbox
                                                    type="checkbox"
                                                    checked={isPacked}
                                                    onChange={() => togglePacked(planItem.Iid.toString())}
                                                />
                                            </PackCheckboxWrapper>
                                        ) : (
                                            <DeleteButton
                                                onClick={() => handleDeleteItem(planItem.id)}
                                                title="Remove item"
                                            >
                                                <IconContainer icon={Trash2} />
                                            </DeleteButton>
                                        )}
                                    </ItemRow>
                                );
                            })}
                        </ItemsList>
                    )}
                </ItemsSection>
            </StyledContentWrapper>

            {showDeleteConfirm && (
                <ModalOverlay
                    onClick={() => {
                        if (isDeletingPlan) return;
                        setShowDeleteConfirm(false);
                    }}
                >
                    <ModalBox onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <ModalHeader>
                            <ModalTitle>Packing Plan löschen?</ModalTitle>
                            <CloseButton
                                type="button"
                                onClick={() => {
                                    if (isDeletingPlan) return;
                                    setShowDeleteConfirm(false);
                                }}
                                aria-label="Close"
                            >
                                <IconContainer icon={X} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalText>
                            Diese Aktion kann nicht rückgängig gemacht werden. Der Plan und alle zugehörigen Positionen
                            werden gelöscht.
                        </ModalText>

                        <ModalButtons>
                            <ModalButton
                                $variant="ghost"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeletingPlan}
                            >
                                Abbrechen
                            </ModalButton>
                            <DangerModalButton onClick={handleConfirmDeletePlan} disabled={isDeletingPlan}>
                                {isDeletingPlan ? 'Löschen…' : 'Löschen'}
                            </DangerModalButton>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}

            {showAddItemModal && (
                <ModalOverlay onClick={() => setShowAddItemModal(false)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Add Item to Packing Plan</ModalTitle>
                            <CloseButton onClick={() => setShowAddItemModal(false)}>
                                <IconContainer icon={X} />
                            </CloseButton>
                        </ModalHeader>
                        <ModalContent>
                            <SearchInput
                                type="text"
                                placeholder="Search items by name, ID, inventory number, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ItemsSelect>
                                {availableItems.length === 0 ? (
                                    <EmptyMessage>
                                        {searchTerm
                                            ? 'No items found matching your search.'
                                            : 'No available items to add.'}
                                    </EmptyMessage>
                                ) : (
                                    availableItems.map((item) => (
                                        <ItemOption
                                            key={item.id}
                                            onClick={() => setSelectedItemId(item.id.toString())}
                                            $selected={selectedItemId === item.id.toString()}
                                        >
                                            <div>
                                                <ItemOptionName>{item.name}</ItemOptionName>
                                                <ItemOptionMeta>
                                                    ID: {item.id}
                                                    {item.inventoryNumber && ` • ${item.inventoryNumber}`}
                                                    {item.location && ` • ${item.location}`}
                                                </ItemOptionMeta>
                                            </div>
                                        </ItemOption>
                                    ))
                                )}
                            </ItemsSelect>
                            {selectedItemId && (
                                <QuantitySection>
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <QuantityInput
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                                    />
                                </QuantitySection>
                            )}
                        </ModalContent>
                        <ModalButtons>
                            <ModalButton $variant="ghost" onClick={() => setShowAddItemModal(false)}>
                                Cancel
                            </ModalButton>
                            <ModalButton
                                $variant="primary"
                                onClick={handleAddItem}
                                disabled={!selectedItemId || quantity < 1}
                            >
                                Add Item
                            </ModalButton>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}
        </StyledContainer>
    );
};

export default PackingPlanDetails;

// ─── Styled Components ────────────────────────────────────

const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};
    @media (min-width: ${theme.breakpoints.lg}) {
        max-width: 1000px;
        margin: 0 auto;
    }
`;

const StyledHeader = styled(Header)`
    padding: ${theme.spacing.md} 0;
    margin-bottom: 0;
    margin-left: 0;
    position: relative;
`;

const HeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.md};
    }
`;

const HeaderEditButton = styled(Button)`
    display: flex;
    align-items: center;
    box-shadow: ${theme.shadows.sm};
    margin-left: auto;
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};

    &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.sm};
        span {
            display: none;
        }
    }
`;

// Shared button styling for this view (keeps all non-header action buttons visually consistent)
const DetailActionButton = styled(Button)`
    box-sizing: border-box;
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
    min-width: 132px;
    border: 1px solid transparent;
`;

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
`;

const Title = styled.h1`
    font-size: ${theme.typography.fontSize.lg};
    margin: 0;
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.medium};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const StyledContentWrapper = styled(ContentWrapper)`
    padding: 0 ${theme.spacing.lg};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.md};
    }
`;

const InfoCard = styled(Card)`
    margin-bottom: ${theme.spacing.lg};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const DetailsCard = styled(Card)`
    margin-bottom: ${theme.spacing.lg};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.secondary};
    gap: ${theme.spacing.md};
`;

const InfoLabel = styled(Label)`
    margin-bottom: ${theme.spacing.xs};
`;

const InfoValue = styled(DataValue)`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const StyledButton = styled(DetailActionButton)``;

const HeaderDangerActionButton = styled(Button)`
    display: flex;
    align-items: center;
    box-shadow: ${theme.shadows.sm};
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
    background-color: ${theme.colors.status.error.main};
    color: white;
    border-color: ${theme.colors.status.error.main};

    &:hover:not(:disabled) {
        background-color: ${theme.colors.status.error.dark};
        border-color: ${theme.colors.status.error.dark};
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.md};
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.sm};
        span {
            display: none;
        }
    }
`;

const LoadingMessage = styled.p`
    text-align: center;
    margin-top: ${theme.spacing.xl};
    color: ${theme.colors.text.secondary};
`;

const ItemsSection = styled(Card)`
    margin-bottom: ${theme.spacing.lg};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const ItemsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.md};
`;

const ItemsHeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};

    & > ${DetailActionButton} {
        min-width: 132px;
    }
`;

const AddItemButton = styled(DetailActionButton)``;

const PackButton = styled(AddItemButton)``;

const EmptyItemsMessage = styled.div`
    text-align: center;
    padding: ${theme.spacing.xl};
    color: ${theme.colors.text.secondary};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.md};
`;

const ItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const PackProgress = styled.div`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    margin-right: ${theme.spacing.xs};
    white-space: nowrap;
`;

const ItemRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.background.light};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border.default};

    &[data-packed='true'] {
        background-color: ${theme.colors.status.good.light};
        border-color: ${theme.colors.status.good.main};
    }
`;

const Checkbox = styled.input`
    margin-top: 3px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${theme.colors.primary};
`;

const PackCheckboxWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    padding-top: 2px;
`;

const ItemInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const ItemName = styled.div`
    font-weight: ${theme.typography.fontWeight.medium};
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing.sm};
`;

const PackedBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    border-radius: 999px;
    background-color: ${theme.colors.status.good.main};
    color: white;
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.semibold};

    & svg {
        color: white;
    }
`;

const ItemMeta = styled.div`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
`;

const QuantityInput = styled(Input)`
    width: 80px;
    padding: ${theme.spacing.sm};
    text-align: center;
`;

const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.sm};
    border: none;
    background: transparent;
    color: ${theme.colors.status.error.main};
    cursor: pointer;
    border-radius: ${theme.borderRadius.md};
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${theme.colors.status.error.light};
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalBox = styled.div`
    background: white;
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.lg};
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
`;

const ModalText = styled.p`
    margin: 0 0 ${theme.spacing.lg} 0;
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    line-height: 1.5;
`;

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.xs};
    border: none;
    background: transparent;
    color: ${theme.colors.text.secondary};
    cursor: pointer;
    border-radius: ${theme.borderRadius.md};
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${theme.colors.background.light};
        color: ${theme.colors.text.primary};
    }
`;

const ModalContent = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
`;

const SearchInput = styled(Input)`
    width: 100%;
`;

const ItemsSelect = styled.div`
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.background.light};
`;

const ItemOption = styled.div<{ $selected: boolean }>`
    padding: ${theme.spacing.md};
    cursor: pointer;
    border-bottom: 1px solid ${theme.colors.border.default};
    background-color: ${({ $selected }) => ($selected ? theme.colors.primaryLight : theme.colors.background.white)};
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${({ $selected }) => ($selected ? theme.colors.primaryLight : theme.colors.background.light)};
    }

    &:last-child {
        border-bottom: none;
    }
`;

const ItemOptionName = styled.div`
    font-weight: ${theme.typography.fontWeight.medium};
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs};
`;

const ItemOptionMeta = styled.div`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
`;

const EmptyMessage = styled.div`
    padding: ${theme.spacing.xl};
    text-align: center;
    color: ${theme.colors.text.muted};
`;

const QuantitySection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const ModalButtons = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    justify-content: flex-end;

    & > ${DetailActionButton} {
        min-width: 132px;
    }
`;

const ModalButton = styled(DetailActionButton)`
    padding: 0 ${theme.spacing.lg};
`;

const DangerModalButton = styled(ModalButton)`
    background-color: ${theme.colors.status.error.main};
    color: white;
    border: 1px solid ${theme.colors.status.error.main};

    &:hover:not(:disabled) {
        background-color: ${theme.colors.status.error.dark};
        border-color: ${theme.colors.status.error.dark};
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.md};
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;
