import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wrench } from 'lucide-react';
import { inventoryApi } from '../../app/api';
import type { IItem } from '../../db/items';
import { theme } from '../../styles/theme';
import {
    Container,
    Header,
    BackButton,
    ItemCard,
    StatusBadge,
    CardHeader,
    CardHeaderLeft,
    ItemTitle,
    DataLabel,
    DataValue,
    ContentWrapper,
} from '../../styles/components';

// ─── Helpers ──────────────────────────────────────────────
type MaintenanceStatus = 'GREEN' | 'YELLOW' | 'RED';
type ThemeStatus = 'good' | 'warning' | 'error';

// Compute a simple stock-based status for maintenance visibility.
const getMaintenanceStatus = (item: IItem): MaintenanceStatus => {
    if (item.amountActual === 0 || item.availability === 0) return 'RED';
    const ratio = item.amountTarget > 0 ? item.amountActual / item.amountTarget : 1;
    if (ratio < 0.5) return 'RED';
    if (ratio < 1.0) return 'YELLOW';
    return 'GREEN';
};

// Map status to theme badges used by the UI.
const mapStatusToTheme = (status: MaintenanceStatus): ThemeStatus => {
    switch (status) {
        case 'GREEN':
            return 'good';
        case 'YELLOW':
            return 'warning';
        case 'RED':
            return 'error';
    }
};

// ─── Component ────────────────────────────────────────────
const MaintenanceOverview = () => {
    const navigate = useNavigate();
    const items = inventoryApi.useItems();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Precompute rows with status so render stays simple.
    const rows = useMemo(() => {
        return items.map((item: IItem) => {
            const status = getMaintenanceStatus(item);
            return { item, status, themeStatus: mapStatusToTheme(status) };
        });
    }, [items]);

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledBackButton onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                </StyledBackButton>
                <Title>
                    <Wrench size={20} color={theme.colors.text.muted} />
                    Wartung
                </Title>
            </StyledHeader>

            <StyledContentWrapper>
                <Legend>
                    <LegendItem>
                        <StatusBadge $status="good" />
                        <LegendText>OK (ausreichender Bestand)</LegendText>
                    </LegendItem>
                    <LegendItem>
                        <StatusBadge $status="warning" />
                        <LegendText>Niedrig (unter Ziel)</LegendText>
                    </LegendItem>
                    <LegendItem>
                        <StatusBadge $status="error" />
                        <LegendText>Kritisch / Nicht verfügbar</LegendText>
                    </LegendItem>
                </Legend>

                <CardList>
                    {rows.length === 0 && <Empty>Keine Inventargegenstände gefunden.</Empty>}
                    {rows.map(({ item, themeStatus }) => (
                        <StyledItemCard
                            key={item.id}
                            $status={themeStatus}
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        >
                            <CardHeader>
                                <CardHeaderLeft>
                                    <ItemTitle>{item.inventoryNumber || item.id}</ItemTitle>
                                    {item.location && <ItemSubtitle>({item.location})</ItemSubtitle>}
                                </CardHeaderLeft>
                            </CardHeader>

                            {expandedId === item.id && (
                                <CardDetails>
                                    <DetailRow>
                                        <DataLabel>Name:</DataLabel>
                                        <DataValue>{item.name}</DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Gerätenummer:</DataLabel>
                                        <DataValue>{item.deviceNumber || '-'}</DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Ist Satz:</DataLabel>
                                        <DataValue>{item.isSet === true ? 'Ja' : item.isSet === false ? 'Nein' : '-'}</DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Ist / Ziel:</DataLabel>
                                        <DataValue>
                                            {item.amountActual} / {item.amountTarget}
                                        </DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Verfügbarkeit:</DataLabel>
                                        <DataValue>{item.availability}</DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Schaden:</DataLabel>
                                        <DataValue>{item.damageLevel}</DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Ebene:</DataLabel>
                                        <DataValue>{item.level}</DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Letzte Inspektion:</DataLabel>
                                        <DataValue>{item.lastInspection || '-'}</DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Inspektionsintervall (Monate):</DataLabel>
                                        <DataValue>{item.inspectionIntervalMonths || '-'}</DataValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DataLabel>Kommentar:</DataLabel>
                                        <DataValue>{item.remark || '-'}</DataValue>
                                    </DetailRow>
                                </CardDetails>
                            )}
                        </StyledItemCard>
                    ))}
                </CardList>
            </StyledContentWrapper>
        </StyledContainer>
    );
};

export default MaintenanceOverview;

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
    padding: 0;
`;

const ItemSubtitle = styled.div`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    margin-top: ${theme.spacing.xs};
`;

const Legend = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
    align-items: center;
    flex-wrap: wrap;
`;

const LegendItem = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    align-items: center;
    font-size: ${theme.typography.fontSize.sm};
`;

const LegendText = styled.span`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.sm};
`;

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledItemCard = styled(ItemCard)`
    margin-bottom: 0;
`;

const CardDetails = styled.div`
    margin-top: ${theme.spacing.md};
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.background.light};
    border-top: 1px solid ${theme.colors.border.default};
`;

const DetailRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${theme.spacing.sm};
    gap: ${theme.spacing.md};

    &:last-child {
        margin-bottom: 0;
    }
`;

const Empty = styled.div`
    color: ${theme.colors.text.muted};
    text-align: center;
    padding: ${theme.spacing.xxl};
    font-size: ${theme.typography.fontSize.base};
`;
