import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft, Plus, X, Trash2 } from 'lucide-react';
import { packingPlanApi } from '../../app/packingPlanApi';
import { inventoryApi } from '../../app/api';
import { EmergencyScenarioType } from '../../db/packingPlans';
import type { IItem } from '../../db/items';
import IconContainer from '../../utils/IconContainer';
import {
    Container,
    Card,
    FormGroup,
    Label,
    Input,
    Select,
    Textarea,
    Button,
    ContentWrapper,
    BackButton,
    Header,
    ButtonGroup,
} from '../../styles/components';
import { theme } from '../../styles/theme';

const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};

    @media (min-width: ${theme.breakpoints.lg}) {
        max-width: 960px;
        margin: 0 auto;
    }
`;

const StyledHeader = styled(Header)`
    padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 0;
    margin-bottom: 0;
    margin-left: 0;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
`;

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
`;

const StyledContentWrapper = styled(ContentWrapper)`
    padding: 0;
`;

const StyledCard = styled(Card)`
    padding: ${theme.spacing.xl};
    box-shadow: ${theme.shadows.sm};
    border-radius: ${theme.borderRadius.lg};
    margin-top: 0;
`;

const StyledFormGroup = styled(FormGroup)`
    margin-bottom: ${theme.spacing.lg};
`;

const StyledButtonGroup = styled(ButtonGroup)`
    margin-top: ${theme.spacing.xl};
    width: 100%;
    flex-direction: row;
    gap: ${theme.spacing.md};
`;

const StyledButton = styled(Button)`
    height: 48px;
    font-size: ${theme.typography.fontSize.base};
    padding: 0 ${theme.spacing.xl};
`;

const ErrorText = styled.small`
    color: ${theme.colors.status.error.dark};
    display: block;
    margin-top: ${theme.spacing.xs};
`;

const ItemsSection = styled(Card)`
    margin-top: ${theme.spacing.xl};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const ItemsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.md};
`;

const AddItemButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
`;

const EmptyItemsMessage = styled.div`
    text-align: center;
    padding: ${theme.spacing.lg};
    color: ${theme.colors.text.secondary};
`;

const ItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const ItemRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.background.light};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border.default};
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
`;

const ModalButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.sm};
`;

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

interface TempPackingPlanItem {
    Iid: number;
    quantity: number;
}

const CreatePackingPlan = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{
        name: string;
        scenarioType: EmergencyScenarioType;
        description: string;
    }>({
        name: '',
        scenarioType: EmergencyScenarioType.FLOOD,
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [tempItems, setTempItems] = useState<TempPackingPlanItem[]>([]);

    const allInventoryItems = inventoryApi.useItems();

    const handleChange = (key: string, value: string | EmergencyScenarioType) => {
        setFormData((prev) => ({ ...prev, [key]: value }));

        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required.';
        }

        if (!formData.scenarioType) {
            newErrors.scenarioType = 'Scenario type is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTempItem = () => {
        if (selectedItemId === null || quantity < 1) {
            alert('Please select an item and enter a valid quantity.');
            return;
        }

        if (tempItems.some((item) => item.Iid === selectedItemId)) {
            alert('This item is already added.');
            return;
        }

        setTempItems((prev) => [...prev, { Iid: selectedItemId, quantity }]);
        setShowAddItemModal(false);
        setSelectedItemId(null);
        setQuantity(1);
        setSearchTerm('');
    };

    const handleRemoveTempItem = (Iid: number) => {
        setTempItems((prev) => prev.filter((item) => item.Iid !== Iid));
    };

    const handleUpdateTempQuantity = (Iid: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setTempItems((prev) => prev.map((item) => (item.Iid === Iid ? { ...item, quantity: newQuantity } : item)));
    };

    const getItemDetails = (Iid: number): IItem | undefined => {
        return allInventoryItems.find((item) => item.id === Iid);
    };

    const filteredInventoryItems = allInventoryItems.filter((item) => {
        if (!searchTerm) return true;

        const term = searchTerm.toLowerCase();

        return (
            item.name.toLowerCase().includes(term) ||
            item.itemId.toLowerCase().includes(term) ||
            (item.inventoryNumber ? item.inventoryNumber.toLowerCase().includes(term) : false) ||
            (item.location ? item.location.toLowerCase().includes(term) : false)
        );
    });

    const availableItems = filteredInventoryItems.filter(
        (item) => !tempItems.some((tempItem) => tempItem.Iid === item.id)
    );

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);

        try {
            const planId = await packingPlanApi.addPackingPlan({
                name: formData.name.trim(),
                scenarioType: formData.scenarioType,
                description: formData.description.trim() || undefined,
            });

            for (let i = 0; i < tempItems.length; i++) {
                await packingPlanApi.addPackingPlanItem({
                    packingPlanId: planId,
                    Iid: tempItems[i].Iid,
                    requiredQuantity: tempItems[i].quantity,
                    order: i,
                });
            }

            navigate(`/packing-plans/${planId}`);
        } catch (error) {
            console.error('Failed to create packing plan:', error);
            alert('Failed to create packing plan.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderError = (key: string) => (errors[key] ? <ErrorText>{errors[key]}</ErrorText> : null);

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledBackButton onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                </StyledBackButton>
            </StyledHeader>

            <StyledContentWrapper>
                <StyledCard>
                    <StyledFormGroup>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g. Flood Aachen"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {renderError('name')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="scenarioType">Scenario Type</Label>
                        <Select
                            id="scenarioType"
                            name="scenarioType"
                            value={formData.scenarioType}
                            onChange={(e) => handleChange('scenarioType', e.target.value as EmergencyScenarioType)}
                        >
                            {Object.values(EmergencyScenarioType).map((type) => (
                                <option key={type} value={type}>
                                    {getScenarioLabel(type)}
                                </option>
                            ))}
                        </Select>
                        {renderError('scenarioType')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Optional description of the packing plan..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                        />
                    </StyledFormGroup>

                    <ItemsSection>
                        <ItemsHeader>
                            <Label>Items ({tempItems.length})</Label>
                            <AddItemButton $variant="primary" onClick={() => setShowAddItemModal(true)}>
                                <IconContainer icon={Plus} />
                                <span>Add Item</span>
                            </AddItemButton>
                        </ItemsHeader>

                        {tempItems.length === 0 ? (
                            <EmptyItemsMessage>
                                <p>No items added yet.</p>
                            </EmptyItemsMessage>
                        ) : (
                            <ItemsList>
                                {tempItems.map((tempItem) => {
                                    const item = getItemDetails(tempItem.Iid);
                                    if (!item) return null;

                                    return (
                                        <ItemRow key={tempItem.Iid}>
                                            <ItemInfo>
                                                <ItemName>{item.name}</ItemName>
                                                <ItemMeta>
                                                    ID: {item.itemId}
                                                    {item.inventoryNumber && ` • Inv: ${item.inventoryNumber}`}
                                                    {item.location && ` • Location: ${item.location}`}
                                                </ItemMeta>
                                            </ItemInfo>

                                            <QuantityInput
                                                type="number"
                                                min="1"
                                                value={tempItem.quantity}
                                                onChange={(e) => {
                                                    const newQty = parseInt(e.target.value, 10);
                                                    if (!isNaN(newQty) && newQty > 0) {
                                                        handleUpdateTempQuantity(tempItem.Iid, newQty);
                                                    }
                                                }}
                                            />

                                            <DeleteButton
                                                onClick={() => handleRemoveTempItem(tempItem.Iid)}
                                                title="Remove item"
                                            >
                                                <IconContainer icon={Trash2} />
                                            </DeleteButton>
                                        </ItemRow>
                                    );
                                })}
                            </ItemsList>
                        )}
                    </ItemsSection>

                    <StyledButtonGroup>
                        <StyledButton $variant="ghost" onClick={() => navigate(-1)} disabled={isSaving}>
                            Cancel
                        </StyledButton>
                        <StyledButton $variant="primary" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </StyledButton>
                    </StyledButtonGroup>
                </StyledCard>
            </StyledContentWrapper>

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
                                            onClick={() => setSelectedItemId(item.id)}
                                            $selected={selectedItemId === item.id}
                                        >
                                            <div>
                                                <ItemOptionName>{item.name}</ItemOptionName>
                                                <ItemOptionMeta>
                                                    ID: {item.itemId}
                                                    {item.inventoryNumber && ` • ${item.inventoryNumber}`}
                                                    {item.location && ` • ${item.location}`}
                                                </ItemOptionMeta>
                                            </div>
                                        </ItemOption>
                                    ))
                                )}
                            </ItemsSelect>

                            {selectedItemId !== null && (
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
                                onClick={handleAddTempItem}
                                disabled={selectedItemId === null || quantity < 1}
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

export default CreatePackingPlan;
