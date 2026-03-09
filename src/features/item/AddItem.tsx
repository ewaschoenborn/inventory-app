import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import styled from 'styled-components';
import { Check, ChevronLeft, X, Trash } from 'lucide-react';
import { db } from '../../db/db';
import { type IItem, type DamageLevelType, ItemValidationSchema } from '../../db/items';
import { type ILabel } from '../../db/labels';
import DamageLevelTranslation from '../../utils/damageLevels';
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
import {
    LabelSearchInput,
    LabelDropdown,
    LabelOption,
    LabelBadge,
    NoLabels,
    SelectedLabels,
} from '../../utils/LabelBadge';
import { theme } from '../../styles/theme';
import IconContainer from '../../utils/IconContainer';
import { labelsApi, inventoryApi } from '../../app/api';

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
    padding: 20px;
    border-radius: 8px;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
    margin: 0 0 10px 0;
`;

const ModalText = styled.div`
    margin: 0 0 16px 0;
`;

const ModalButtons = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const ConfirmationInput = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
`;

const WarningText = styled.div`
    color: #f00;
    font-weight: bold;
`;

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

const DropdownContainer = styled.div`
    position: relative;
`;

const CreateLabelContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    padding-top: ${theme.spacing.sm};
    border-top: 1px solid ${theme.colors.border.light};
    padding-bottom: ${theme.spacing.sm};
    padding-left: ${theme.spacing.sm};
    padding-right: ${theme.spacing.sm};
    align-items: center;
    position: sticky;
    bottom: 0;
    background-color: ${theme.colors.background.white};
    z-index: 1;
`;

const ColorInput = styled(Input)`
    width: 48px;
    aspect-ratio: 1;
    padding: 0;
    border-radius: 50%;
    height: 38px;
    border: none;
    cursor: pointer;
    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    &::-webkit-color-swatch {
        border: none;
        border-radius: 50%;
    }
`;

const AddItem = () => {
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Form state mirrors the IItem shape but stays partial until validation.
    const [formData, setFormData] = useState<Partial<IItem>>({
        itemId: '',
        name: '',
        inventoryNumber: '',
        deviceNumber: '',
        isSet: false,
        art: '',
        amountTarget: 0,
        amountActual: 0,
        availability: 0,
        damageLevel: 'none',
        lastInspection: '',
        inspectionIntervalMonths: 0,
        location: '',
        level: 0,
        remark: '',
        labels: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [allLabels, setAllLabels] = useState<ILabel[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<ILabel[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState<string>(theme.colors.primary);
    const [labelToDelete, setLabelToDelete] = useState<ILabel | null>(null);
    const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

    const itemsWithLabelToDeleteCount = inventoryApi.useCountItemsWithLabel(labelToDelete?.id);

    useEffect(() => {
        const fetchLabels = async () => {
            const allLabels = await labelsApi.getAllLabels();
            setAllLabels(allLabels);
        };
        fetchLabels();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Auto-grow textarea to fit remark content.
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };
    useEffect(() => adjustTextareaHeight(), [formData.remark]);

    // Validate a single field against the shared schema.
    const validateField = async (key: keyof IItem, value: string | number | boolean | ILabel[] | undefined) => {
        try {
            await ItemValidationSchema.validateAt(key, { ...formData, [key]: value });
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                setErrors((prev) => ({
                    ...prev,
                    [key]: error.message,
                }));
            }
        }
    };

    const handleChange = (key: keyof IItem, value: string | number | boolean | ILabel[] | undefined) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (touched[key]) {
            validateField(key, value);
        }
    };

    const handleBlur = (key: keyof IItem) => {
        setTouched((prev) => ({ ...prev, [key]: true }));
        validateField(key, formData[key]);
    };

    const handleCreateLabel = async () => {
        if (!newLabelName.trim()) return;

        const newLabel: ILabel = {
            id: crypto.randomUUID(),
            name: newLabelName.trim(),
            color: newLabelColor,
        };
        await db.labels.add(newLabel);
        setAllLabels((prev) => [...prev, newLabel]);
        setSelectedLabels((prev) => [...prev, newLabel]);
        setNewLabelName('');
    };

    const handleLabelSelection = (label: ILabel) => {
        setSelectedLabels((prev) => {
            if (prev.some((l) => l.id === label.id)) {
                return prev.filter((l) => l.id !== label.id);
            } else {
                return [...prev, label];
            }
        });
    };

    const confirmDeleteLabel = async () => {
        if (!labelToDelete || deleteConfirmationInput.toLowerCase() !== 'ja') return;

        try {
            await labelsApi.deleteLabel(labelToDelete.id);
            await inventoryApi.removeLabelFromAllItems(labelToDelete.id);
            setAllLabels((prev) => prev.filter((l) => l.id !== labelToDelete.id));
            setSelectedLabels((prev) => prev.filter((l) => l.id !== labelToDelete.id));
        } catch (error) {
            console.error('Failed to delete label:', error);
            alert('Fehler beim Löschen des Labels.');
        } finally {
            setLabelToDelete(null);
            setDeleteConfirmationInput('');
        }
    };

    const handleSave = async () => {
        // Validate all fields and block if schema errors exist.
        const allKeys = Object.keys(formData) as (keyof IItem)[];
        setTouched(allKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        try {
            await ItemValidationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            await saveItem();
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path] = err.message;
                    }
                });
                setErrors(newErrors);
            } else {
                console.error(error);
                alert('Fehler beim Speichern.');
            }
        }
    };

    const saveItem = async () => {
        // Normalize optional fields before persisting to Dexie.
        try {
            const cleanedItem: Omit<IItem, 'id'> = {
                itemId: formData.itemId!.trim(),
                name: formData.name!.trim(),
                isSet: formData.isSet ?? false,
                art: formData.art ?? '',
                amountTarget: formData.amountTarget ?? 0,
                amountActual: formData.amountActual ?? 0,
                availability: formData.availability ?? 0,
                damageLevel: formData.damageLevel ?? 'none',
                level: formData.level ?? 0,

                inventoryNumber: formData.inventoryNumber?.trim() || undefined,
                deviceNumber: formData.deviceNumber?.trim() || undefined,
                lastInspection: formData.lastInspection?.trim() || '',
                inspectionIntervalMonths: formData.inspectionIntervalMonths ?? 0,
                location: formData.location?.trim() || '',
                remark: formData.remark?.trim() || '',
                labels: selectedLabels,
            };

            const newItemId = await db.items.add(cleanedItem as IItem);
            navigate(`/items/${newItemId}`, { replace: true });
        } catch (err) {
            console.error(err);
            alert('Fehler beim Speichern des Gegenstands.');
        }
    };

    const RequiredStar = () => <span style={{ color: 'red' }}> *</span>;

    const renderError = (key: keyof IItem) =>
        touched[key] && errors[key] ? <ErrorText>{errors[key]}</ErrorText> : null;

    const filteredLabels = allLabels.filter((label) => label.name.toLowerCase().includes(searchTerm.toLowerCase()));

    function handleLabelClick(id: string): void {
        const label = allLabels.find((l) => l.id === id);
        if (label) {
            handleLabelSelection(label);
        }
    }

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
                        <Label htmlFor="name">
                            Name
                            <RequiredStar />
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name eingeben"
                            value={formData.name ?? ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            onBlur={() => handleBlur('name')}
                        />
                        {renderError('name')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="itemId">
                            Sachnummer
                            <RequiredStar />
                        </Label>
                        <Input
                            id="itemId"
                            name="itemId"
                            type="text"
                            placeholder="ID eingeben"
                            value={formData.itemId ?? ''}
                            onChange={(e) => handleChange('itemId', e.target.value)}
                            onBlur={() => handleBlur('itemId')}
                        />
                        {renderError('itemId')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="labels">Labels</Label>
                        <DropdownContainer ref={dropdownRef}>
                            <LabelSearchInput
                                type="text"
                                placeholder="Labels suchen..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsDropdownOpen(true)}
                            />
                            {isDropdownOpen && (
                                <LabelDropdown>
                                    {filteredLabels.length > 0 ? (
                                        filteredLabels.map((label) => (
                                            <LabelOption
                                                key={label.id}
                                                onClick={() => handleLabelClick(label.id)}
                                                $isSelected={selectedLabels.some((l) => l.id === label.id)}
                                                color={label.color}
                                            >
                                                {label.name}
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {selectedLabels.some((l) => l.id === label.id) && (
                                                        <IconContainer icon={Check} />
                                                    )}
                                                    <IconContainer
                                                        icon={Trash}
                                                        color={theme.colors.status.error.main}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setLabelToDelete(label);
                                                        }}
                                                    />
                                                </div>
                                            </LabelOption>
                                        ))
                                    ) : (
                                        <NoLabels>Keine Labels gefunden</NoLabels>
                                    )}

                                    <CreateLabelContainer>
                                        <ColorInput
                                            type="color"
                                            value={newLabelColor}
                                            onChange={(e) => setNewLabelColor(e.target.value)}
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Neues Label erstellen"
                                            value={newLabelName}
                                            onChange={(e) => setNewLabelName(e.target.value)}
                                        />
                                        <StyledButton $variant="primary" onClick={handleCreateLabel}>
                                            Erstellen
                                        </StyledButton>
                                    </CreateLabelContainer>
                                </LabelDropdown>
                            )}
                        </DropdownContainer>
                        {selectedLabels.length > 0 && (
                            <SelectedLabels>
                                {selectedLabels.map((label) => {
                                    const foundLabel = allLabels.find((l) => l.id === label.id);
                                    function removeLabel(labelId: string): void {
                                        const newSelectedLabels = selectedLabels.filter((l) => l.id !== labelId);
                                        setSelectedLabels(newSelectedLabels);
                                    }

                                    return foundLabel ? (
                                        <LabelBadge
                                            key={foundLabel.id}
                                            onClick={() => removeLabel(foundLabel.id)}
                                            color={foundLabel.color}
                                        >
                                            {foundLabel.name} <IconContainer icon={X} />
                                        </LabelBadge>
                                    ) : null;
                                })}
                            </SelectedLabels>
                        )}
                        {labelToDelete && (
                            <ModalOverlay>
                                <ModalBox role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
                                    <ModalTitle id="delete-confirm-title">Label löschen bestätigen</ModalTitle>
                                    <ModalText>
                                        <WarningText>
                                            WARNUNG: Dieses Label wird von{' '}
                                            {itemsWithLabelToDeleteCount === 1
                                                ? '1 Gegenstand'
                                                : `${itemsWithLabelToDeleteCount} Gegenständen`}{' '}
                                            entfernt!
                                        </WarningText>
                                        Bitte geben Sie "ja" ein, um zu bestätigen, dass Sie dieses Label endgültig
                                        löschen möchten.
                                    </ModalText>
                                    <ConfirmationInput
                                        type="text"
                                        value={deleteConfirmationInput}
                                        onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && deleteConfirmationInput.toLowerCase() === 'ja') {
                                                confirmDeleteLabel();
                                            }
                                        }}
                                        placeholder='Geben Sie "ja" ein'
                                        autoFocus
                                    />
                                    <ModalButtons>
                                        <StyledButton
                                            $variant="primary"
                                            onClick={confirmDeleteLabel}
                                            disabled={deleteConfirmationInput.toLowerCase() !== 'ja'}
                                        >
                                            Bestätigen
                                        </StyledButton>
                                        <StyledButton
                                            $variant="ghost"
                                            onClick={() => {
                                                setLabelToDelete(null);
                                                setDeleteConfirmationInput('');
                                            }}
                                        >
                                            Abbrechen
                                        </StyledButton>
                                    </ModalButtons>
                                </ModalBox>
                            </ModalOverlay>
                        )}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="inventoryNumber">Inventarnummer</Label>
                        <Input
                            id="inventoryNumber"
                            name="inventoryNumber"
                            type="text"
                            placeholder="Inventarnummer eingeben"
                            value={formData.inventoryNumber ?? ''}
                            onChange={(e) => handleChange('inventoryNumber', e.target.value)}
                            onBlur={() => handleBlur('inventoryNumber')}
                        />
                        {renderError('inventoryNumber')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="deviceNumber">Gerätenummer</Label>
                        <Input
                            id="deviceNumber"
                            name="deviceNumber"
                            type="text"
                            placeholder="Gerätenummer eingeben"
                            value={formData.deviceNumber ?? ''}
                            onChange={(e) => handleChange('deviceNumber', e.target.value)}
                            onBlur={() => handleBlur('deviceNumber')}
                        />
                        {renderError('deviceNumber')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="damageLevel">Schaden</Label>
                        <Select
                            id="damageLevel"
                            name="damageLevel"
                            value={formData.damageLevel ?? 'none'}
                            onChange={(e) => handleChange('damageLevel', e.target.value as DamageLevelType)}
                            onBlur={() => handleBlur('damageLevel')}
                        >
                            <option value="none">{DamageLevelTranslation.none}</option>
                            <option value="minor">{DamageLevelTranslation.minor}</option>
                            <option value="major">{DamageLevelTranslation.major}</option>
                            <option value="total">{DamageLevelTranslation.total}</option>
                        </Select>
                        {renderError('damageLevel')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="isSet">Typ</Label>
                        <Select
                            id="isSet"
                            name="isSet"
                            value={formData.isSet ? 'yes' : 'no'}
                            onChange={(e) => handleChange('isSet', e.target.value === 'yes')}
                            onBlur={() => handleBlur('isSet')}
                        >
                            <option value="yes">Satz</option>
                            <option value="no">(Einzelnes) Teil</option>
                        </Select>
                        {renderError('isSet')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="amountTarget">Zielmenge</Label>
                        <Input
                            id="amountTarget"
                            name="amountTarget"
                            type="number"
                            placeholder="Zielmenge eingeben"
                            value={formData.amountTarget ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('amountTarget', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('amountTarget')}
                        />
                        {renderError('amountTarget')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="amountActual">Istmenge</Label>
                        <Input
                            id="amountActual"
                            name="amountActual"
                            type="number"
                            placeholder="Istmenge eingeben"
                            value={formData.amountActual ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('amountActual', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('amountActual')}
                        />
                        {renderError('amountActual')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="availability">Verfügbarkeit</Label>
                        <Input
                            id="availability"
                            name="availability"
                            type="number"
                            placeholder="Verfügbarkeit eingeben"
                            value={formData.availability ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('availability', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('availability')}
                        />
                        {renderError('availability')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="location">Ort</Label>
                        <Input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="Ort eingeben"
                            value={formData.location ?? ''}
                            onChange={(e) => handleChange('location', e.target.value)}
                            onBlur={() => handleBlur('location')}
                        />
                        {renderError('location')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="level">Ebene</Label>
                        <Input
                            id="level"
                            name="level"
                            type="number"
                            placeholder="Ebene eingeben"
                            value={formData.level ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('level', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('level')}
                        />
                        {renderError('level')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="lastInspection">Letzte Inspektion</Label>
                        <Input
                            id="lastInspection"
                            name="lastInspection"
                            type="date"
                            value={formData.lastInspection ?? ''}
                            onChange={(e) => handleChange('lastInspection', e.target.value)}
                            onBlur={() => handleBlur('lastInspection')}
                        />
                        {renderError('lastInspection')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="inspectionIntervalMonths">Inspektionsintervall (Monate)</Label>
                        <Input
                            id="inspectionIntervalMonths"
                            name="inspectionIntervalMonths"
                            type="number"
                            placeholder="Intervall in Monaten"
                            value={formData.inspectionIntervalMonths ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                handleChange('inspectionIntervalMonths', v === '' ? undefined : Number(v));
                            }}
                            onBlur={() => handleBlur('inspectionIntervalMonths')}
                        />
                        {renderError('inspectionIntervalMonths')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="remark">Kommentar</Label>
                        <Textarea
                            id="remark"
                            name="remark"
                            ref={textareaRef}
                            rows={3}
                            placeholder="Kommentar eingeben"
                            value={formData.remark ?? ''}
                            onChange={(e) => handleChange('remark', e.target.value)}
                            onBlur={() => handleBlur('remark')}
                            style={{ resize: 'none' }}
                        />
                        {renderError('remark')}
                    </StyledFormGroup>

                    <StyledButtonGroup>
                        <StyledButton $variant="primary" onClick={handleSave}>
                            Hinzufügen
                        </StyledButton>
                        <StyledButton $variant="ghost" onClick={() => navigate(-1)}>
                            Abbrechen
                        </StyledButton>
                    </StyledButtonGroup>
                </StyledCard>
            </StyledContentWrapper>
        </StyledContainer>
    );
};

export default AddItem;
