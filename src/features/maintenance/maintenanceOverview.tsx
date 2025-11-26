import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { inventoryApi } from '../../app/api';
import type { IItem, DamageLevelType } from '../../db/items';
import PageHeader from '../../layout/PageHeader';

// ─── Helpers ──────────────────────────────────────────────
type MaintenanceStatus = 'GREEN' | 'YELLOW' | 'RED';

const getMaintenanceStatus = (item: IItem): MaintenanceStatus => {
    if (item.amountActual === 0 || item.availability === 0) return 'RED';
    const ratio = item.amountTarget > 0 ? item.amountActual / item.amountTarget : 1;
    if (ratio < 0.5) return 'RED';
    if (ratio < 1.0) return 'YELLOW';
    return 'GREEN';
};

const colorFor = (status: MaintenanceStatus) => {
    switch (status) {
        case 'GREEN':
            return '#27ae60';
        case 'YELLOW':
            return '#f39c12';
        case 'RED':
            return '#e46e61ff';
    }
};

// ─── Component ────────────────────────────────────────────
const MaintenanceOverview = () => {
    const items = inventoryApi.useItems(); // CALL the hook function
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const rows = useMemo(() => {
        return items.map((item: IItem) => {
            const status = getMaintenanceStatus(item);
            return { item, status, color: colorFor(status) };
        });
    }, [items]);

    return (
        <div>
            <PageHeader title="Maintenance Overview" />

            <Legend>
                <LegendItem>
                    <Badge bg={colorFor('GREEN')} /> OK (sufficient stock)
                </LegendItem>
                <LegendItem>
                    <Badge bg={colorFor('YELLOW')} /> Low (below target)
                </LegendItem>
                <LegendItem>
                    <Badge bg={colorFor('RED')} /> Critical / Unavailable
                </LegendItem>
            </Legend>

            <CardList>
                {rows.length === 0 && <Empty>No inventory items found.</Empty>}
                {rows.map(({ item, color }) => (
                    <Card
                        key={item.id}
                        color={color}
                        expanded={expandedId === item.id}
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                        <CardHeader>
                            {item.inventoryNumber || item.id}
                            <span style={{ fontSize: '0.9em', color: '#555', marginLeft: '8px' }}>
                                ({item.location})
                            </span>
                        </CardHeader>

                        {expandedId === item.id && (
                            <CardDetails>
                                <p>
                                    <strong>Name:</strong> {item.name}
                                </p>
                                <p>
                                    <strong>Device Number:</strong> {item.deviceNumber || '-'}
                                </p>
                                <p>
                                    <strong>Is Set:</strong> {item.isSet ? 'Yes' : 'No'}
                                </p>
                                <p>
                                    <strong>Actual / Target:</strong> {item.amountActual} / {item.amountTarget}
                                </p>
                                <p>
                                    <strong>Availability:</strong> {item.availability}
                                </p>
                                <p>
                                    <strong>Damage Level:</strong> {item.damageLevel}
                                </p>
                                <p>
                                    <strong>Level:</strong> {item.level}
                                </p>
                                <p>
                                    <strong>Last Inspection:</strong> {item.lastInspection || '-'}
                                </p>
                                <p>
                                    <strong>Inspection Interval (months):</strong>{' '}
                                    {item.inspectionIntervalMonths || '-'}
                                </p>
                                <p>
                                    <strong>Remark:</strong> {item.remark || '-'}
                                </p>
                            </CardDetails>
                        )}
                    </Card>
                ))}
            </CardList>
        </div>
    );
};

export default MaintenanceOverview;

const Page = styled.div`
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
`;

const Legend = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;
`;

const LegendItem = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 14px;
`;

const Badge = styled.span<{ bg: string }>`
    width: 14px;
    height: 14px;
    display: inline-block;
    border-radius: 3px;
    background: ${({ bg }) => bg};
`;

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const Card = styled.div<{ color: string; expanded: boolean }>`
    background: ${({ color }) => color};
    color: white;
    border-radius: 10px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${({ expanded }) => (expanded ? '0 6px 12px rgba(0,0,0,0.25)' : '0 2px 4px rgba(0,0,0,0.1)')};
    transform: ${({ expanded }) => (expanded ? 'scale(1.02)' : 'scale(1)')};
`;

const CardHeader = styled.h3`
    margin: 0;
    font-size: 18px;
`;

const CardDetails = styled.div`
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.15);
    padding: 8px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.4;
`;

const Empty = styled.div`
    color: #7f8c8d;
    text-align: center;
    padding: 30px;
`;
