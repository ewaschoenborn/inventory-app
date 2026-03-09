import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import styled from 'styled-components';
import { ChevronLeft } from 'lucide-react';
import { db } from '../../db/db';
import { type IItem, type DamageLevelType, ItemValidationSchema } from '../../db/items';
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

const AddItem = () => {
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Form state mirrors the IItem shape but stays partial until validation.
    const [formData, setFormData] = useState<Partial<IItem>>({
        itemId: '',
        name: '',
        inventoryNumber: '',
        deviceNumber: '',
        isSet: false,
        amountTarget: 0,
        amountActual: 0,
        availability: 0,
        damageLevel: 'none',
        lastInspection: '',
        inspectionIntervalMonths: 0,
        location: '',
        level: 0,
        remark: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Auto-grow textarea to fit remark content.
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };
    useEffect(() => adjustTextareaHeight(), [formData.remark]);

    // Validate a single field against the shared schema.
    const validateField = async (key: keyof IItem, value: any) => {
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

    const handleChange = (key: keyof IItem, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (touched[key]) {
            validateField(key, value);
        }
    };

    const handleBlur = (key: keyof IItem) => {
        setTouched((prev) => ({ ...prev, [key]: true }));
        validateField(key, formData[key]);
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
