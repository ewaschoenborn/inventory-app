import { Box, FileText, Layers, MapPin, Pen, ChevronLeft, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../db/db';
import type { IItem } from '../../db/items';
import StatusBadge from '../../utils/StatusBadge';
import IconContainer from '../../utils/IconContainer';
import { theme } from '../../styles/theme';
import {
    Container,
    Header,
    BackButton,
    InfoCard,
    Card,
    Textarea,
    Button,
    Label,
    DataValue,
    ContentWrapper,
} from '../../styles/components';
import { mapStatusToTheme, mapDamageLevelToStatus } from '../../styles/utils';
import { LabelBadge } from '../../utils/LabelBadge';
import { addMonths } from '../../utils/date';


const ItemDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<IItem | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            const itemId = id ? parseInt(id, 10) : null;
            if (!itemId) return;
            const dbItem = await db.items.get(itemId);
            if (dbItem) {
                setItem(dbItem);
            }
        };
        fetchItem();
    }, [id]);

    const handleAdditionalDocs = () => {
        alert('Additional Docs clicked!');
    };

    const handleDelete = async () => {
        if (!item?.id) return;

        const confirmed = window.confirm(`Möchtest du "${item.name}" wirklich löschen?`);
        if (!confirmed) return;

        await db.items.delete(item.id);
        navigate('/items');
    };

    if (!item) return <p className="text-center mt-4">Loading item...</p>;

    const statusString = mapDamageLevelToStatus(item.damageLevel);
    const themeStatus = mapStatusToTheme(statusString);

    return (
        <StyledContainer>
            <StyledHeader>
                <HeaderContent>
                    <StyledBackButton onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </StyledBackButton>

                    <Title>
                        {item.isSet === true ? (
                            <Layers size={20} color={theme.colors.text.muted} />
                        ) : item.isSet === false ?(
                            <Box size={20} color={theme.colors.text.muted} />
                        ) : (
                            ''
                        )}
                        {item.name}
                    </Title>

                    <HeaderActions>
                        <HeaderEditButton $variant="primary" onClick={() => navigate(`/items/${item.id}/modify`)}>
                            <IconContainer icon={Pen} />
                            <span>Bearbeiten</span>
                        </HeaderEditButton>

                        <HeaderDeleteButton onClick={handleDelete}>
                            <IconContainer icon={Trash2} />
                            <span>Löschen</span>
                        </HeaderDeleteButton>
                    </HeaderActions>
                </HeaderContent>
            </StyledHeader>

            <StyledContentWrapper>
                <Subtitle>Inventarnummer: {item.inventoryNumber ?? 'nicht vorhanden'}</Subtitle>

                <StyledInfoCard $status={themeStatus}>
                    <CardContent>
                        <InfoRow>
                            <div style={{ flex: 1 }}>
                                <InfoLabel>Status</InfoLabel>
                                <InfoValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                                    <StatusBadge damageLevelType={item.damageLevel} />
                                </InfoValue>
                            </div>
                            {item.location && (
                                <div style={{ flex: 1 }}>
                                    <InfoLabel>Ort</InfoLabel>
                                    <InfoValue>
                                        <MapPin size={14} />
                                        {item.location + (item.level ? `, Ebene: ${item.level}` : '')}
                                    </InfoValue>
                                </div>
                            )}
                        </InfoRow>
                    </CardContent>
                </StyledInfoCard>

                <StyledDetailsCard>
                    <InfoLabel>Menge</InfoLabel>
                    <InfoValue>
                        Verfügbar: {item.availability} | Vorhanden: {item.amountActual} | Ziel: {item.amountTarget}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel>Weitere Informationen</InfoLabel>
                    <InfoValue>Sachnummer: {item.itemId || '-'}</InfoValue>
                    <InfoValue>Inventarnummer: {item.inventoryNumber || '-'}</InfoValue>
                    <InfoValue>Gerätenummer: {item.deviceNumber || '-'}</InfoValue>
                    <InfoValue>
                        Typ: {item.isSet === true ? 'Satz' : item.isSet === false ? 'Einzelstück' : '-'}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel>Labels</InfoLabel>
                    <InfoValue>
                        {item.labels && item.labels.length > 0 ? (
                            <LabelContainer>
                                {item.labels.map((label) => (
                                    <LabelBadge key={label.id} color={label.color}>
                                        {label.name}
                                    </LabelBadge>
                                ))}
                            </LabelContainer>
                        ) : (
                            '-'
                        )}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel>Wartungsinformationen</InfoLabel>
                    <InfoValue>
                        Letzte Inspektion:{' '}
                        {item.lastInspection
                            ? Intl.DateTimeFormat('de-DE', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                              }).format(new Date(item.lastInspection))
                            : '-'}
                    </InfoValue>
                    <InfoValue>
                        Inspektionsintervall:{' '}
                        {item.inspectionIntervalMonths ? item.inspectionIntervalMonths + ' Monate' : '-'}
                    </InfoValue>
                    <InfoValue>
                        Berechnete nächste Inspektion:{' '}
                        {item.lastInspection && item.inspectionIntervalMonths
                            ? Intl.DateTimeFormat('de-DE', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                              }).format(addMonths(new Date(item.lastInspection), item.inspectionIntervalMonths))
                            : '-'}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel style={{ marginBottom: theme.spacing.md }}>Kommentare</InfoLabel>
                    <StyledTextarea value={item.remark || ''} disabled readOnly />
                </StyledDetailsCard>

                <ButtonContainer>
                    <StyledButton $variant="primary" onClick={handleAdditionalDocs}>
                        <IconContainer icon={FileText} />
                        Weitere Dokumente
                    </StyledButton>
                </ButtonContainer>
            </StyledContentWrapper>
        </StyledContainer>
    );
};

export default ItemDetails;

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

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    margin-left: auto;
`;

const HeaderEditButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    box-shadow: ${theme.shadows.sm};

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

const HeaderDeleteButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    box-shadow: ${theme.shadows.sm};
    background: ${theme.colors.status.error.main};
    color: white;

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

const Subtitle = styled.div`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    margin-bottom: ${theme.spacing.lg};
    font-weight: ${theme.typography.fontWeight.medium};
`;

const StyledInfoCard = styled(InfoCard)`
    margin-bottom: ${theme.spacing.lg};
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
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

const StyledDetailsCard = styled(Card)`
    margin-bottom: ${theme.spacing.lg};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const StyledTextarea = styled(Textarea)`
    min-height: 80px;
`;

const StyledButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    flex-direction: column;

    & > ${StyledButton} {
        width: 100%;
    }

    @media (min-width: ${theme.breakpoints.md}) {
        flex-direction: row;
        justify-content: flex-start;

        & > ${StyledButton} {
            width: unset;
        }
    }
`;

const LabelContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.xs};
    flex-wrap: wrap;
`;
