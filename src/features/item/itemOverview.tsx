import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Info, ArrowDownAZ, ArrowDownZA, Box, Boxes, ChevronLeft, ChevronRight, Hourglass, MapPin } from 'lucide-react';
import type { DamageLevelType, IItem } from '../../db/items';
import { ItemFilter } from './ItemFilterPanel';
import { inventoryApi, type SortDirection, type SortField } from '../../app/api';
import StatusBadge, { DamageLevelStyles } from '../../utils/StatusBadge';
import IconContainer from '../../utils/IconContainer';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React from 'react';
import { parseLocationStringRaw, mapLocationKey } from '../../utils/locationString';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setSortDirection, setSortField } from '../../store/slices/searchSlice';
import { db } from '../../db/db';
import type { IPackingPlan, IPackingPlanItem } from '../../db/packingPlans';
import { EmergencyScenarioType } from '../../db/packingPlans';

import { usePackMode } from './usePackMode';
import QuantitySpinner from '../../components/QuantitySpinner';
const ItemOverview = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const packModeState = usePackMode();
    const { packMode, selectedItemIds, toggleItem, qtyByItemId, setQuantity, planName } = packModeState;
    const searchState = useSelector((state: RootState) => state.search);
    const { query: searchTerm, sortField, sortDirection, filters } = searchState;

    const [items, setItems] = useState<IItem[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(50); // Items per page
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch items with pagination
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const result = await inventoryApi.fetchItemsPaginatedWithFilter(
                    { page: currentPage, pageSize },
                    searchTerm || '',
                    filters || {}
                );
                setItems(result.data);
                setTotalItems(result.pagination.totalItems);
                setTotalPages(result.pagination.totalPages);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [currentPage, pageSize, searchTerm, filters]);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            if (sortDirection === 'asc') {
                dispatch(setSortDirection('desc'));
            } else {
                dispatch(setSortField(null));
                dispatch(setSortDirection('asc'));
            }
        } else {
            dispatch(setSortField(field));
            dispatch(setSortDirection('asc'));
        }
    };

    const getSortedItems = (itemsToSort: IItem[]) => {
        if (!sortField) return itemsToSort;

        const sorted = [...itemsToSort];
        sorted.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'itemId':
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'type':
                    aValue = a.isSet ? 'Satz' : 'Teil';
                    bValue = b.isSet ? 'Satz' : 'Teil';
                    break;
                case 'amountActual':
                    aValue = a.amountActual ?? 0;
                    bValue = b.amountActual ?? 0;
                    break;
                case 'availability':
                    aValue = a.availability;
                    bValue = b.availability;
                    break;
                case 'damageLevel':
                    aValue = a.damageLevel;
                    bValue = b.damageLevel;
                    break;
                case 'location':
                    aValue = a.location;
                    bValue = b.location;
                    break;
                case 'inventoryNumber':
                    aValue = a.inventoryNumber ?? '';
                    bValue = b.inventoryNumber ?? '';
                    break;
                case 'deviceNumber':
                    aValue = a.deviceNumber ?? '';
                    bValue = b.deviceNumber ?? '';
                    break;
                default:
                    return 0;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return sortDirection === 'asc' ? comparison : -comparison;
            } else {
                const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                return sortDirection === 'asc' ? comparison : -comparison;
            }
        });

        return sorted;
    };

    const sortedItems = getSortedItems(items);

    const createId = (prefix = 'id'): string => {
        // `crypto.randomUUID()` is not always available (e.g. http:// on LAN IPs).
        // Use it when present, otherwise fall back to a reasonably-unique string.
        const c = globalThis.crypto as Crypto | undefined;
        if (c && 'randomUUID' in c && typeof (c as any).randomUUID === 'function') {
            return (c as any).randomUUID();
        }
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    };

    const getEffectiveAvailability = (item: IItem): number => {
        // Older DB rows / imports may not have `availability` populated.
        // In that case we fall back to `amountActual` to avoid "everything disabled" in pack mode.
        const availability = Number(item.availability);
        if (Number.isFinite(availability)) return availability;

        const amountActual = Number(item.amountActual);
        if (Number.isFinite(amountActual)) return amountActual;

        return 0;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSavePackingPlan = async () => {
        if (selectedItemIds.size === 0) {
            alert('Please select at least one item to pack.');
            return;
        }

        if (!planName.trim()) {
            alert('Please enter a plan name.');
            return;
        }

        try {
            // Create IPackingPlan
            const now = new Date().toISOString();
            const packingPlan: IPackingPlan = {
                id: createId('plan'),
                name: planName.trim(),
                scenarioType: EmergencyScenarioType.CUSTOM,
                description: '',
                createdAt: now,
                updatedAt: now,
            };

            // Insert packing plan
            await db.packingPlans.add(packingPlan);

            // Create IPackingPlanItem[] for selected items
            const packingPlanItems: IPackingPlanItem[] = Array.from(selectedItemIds).map((itemId, index) => ({
                id: createId('planItem'),
                packingPlanId: packingPlan.id,
                itemId: itemId,
                requiredQuantity: qtyByItemId[itemId] ?? 1,
                notes: '',
                order: index,
            }));

            // Bulk insert packing plan items
            await db.packingPlanItems.bulkAdd(packingPlanItems);

            // Reset pack mode
            packModeState.togglePackMode();

            // Show success message and optionally navigate
            alert('Packing plan saved successfully!');
            navigate(`/packing-plans/${packingPlan.id}`);
        } catch (error) {
            console.error('Error saving packing plan:', error);
            alert('Failed to save packing plan. Please try again.');
        }
    };

    return (
        <div>
            <ItemFilter packModeState={packModeState} onSavePackingPlan={handleSavePackingPlan} />

            {isLoading ? (
                <LoadingContainer>
                    <IconContainer icon={Hourglass} />
                    <span>Lade Inventar...</span>
                </LoadingContainer>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <HeaderCell onClick={() => handleSort('inventoryNumber')}>
                                <HeaderContent>
                                    <span>Inventar-Nr.</span>
                                    <SortIndicator
                                        active={sortField === 'inventoryNumber'}
                                        sortDirection={sortDirection}
                                    />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('name')}>
                                <HeaderContent>
                                    <span>Name</span>
                                    <SortIndicator active={sortField === 'name'} sortDirection={sortDirection} />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('type')}>
                                <HeaderContent>
                                    <span>Typ</span>
                                    <SortIndicator active={sortField === 'type'} sortDirection={sortDirection} />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('amountActual')}>
                                <HeaderContent>
                                    <span>Menge</span>
                                    <SortIndicator
                                        active={sortField === 'amountActual'}
                                        sortDirection={sortDirection}
                                    />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('damageLevel')}>
                                <HeaderContent>
                                    <span>Zustand</span>
                                    <SortIndicator active={sortField === 'damageLevel'} sortDirection={sortDirection} />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('location')}>
                                <HeaderContent>
                                    <span>Ort</span>
                                    <InfoIndicator>
                                        <p>
                                            <b>Lagerkennung:</b>{' '}
                                        </p>
                                        <p>[Ebene]-[Containertyp*][Container-Nr.].[Subcontainer-Nr.]-[Werkzeug-Nr.]</p>
                                        <p>(*R=Rollcontainer, G=EU-Box)</p>
                                    </InfoIndicator>
                                    <SortIndicator active={sortField === 'location'} sortDirection={sortDirection} />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('itemId')}>
                                <HeaderContent>
                                    <span>ID</span>
                                    <SortIndicator active={sortField === 'itemId'} sortDirection={sortDirection} />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('deviceNumber')}>
                                <HeaderContent>
                                    <span>Geräte-Nr.</span>
                                    <SortIndicator
                                        active={sortField === 'deviceNumber'}
                                        sortDirection={sortDirection}
                                    />
                                </HeaderContent>
                            </HeaderCell>
                        </TableHeader>
                        {sortedItems.map((item) => {
                            const damageLevel = DamageLevelStyles[item.damageLevel as DamageLevelType];
                            const itemId = item.id.toString();
                            const availability = getEffectiveAvailability(item);
                            const hasExplicitAvailability = Number.isFinite(Number(item.availability));
                            const isSelected = selectedItemIds.has(itemId);
                            // In pack mode we treat "Verfügbar" as the upper bound (including 0).
                            const maxQty = Number.isFinite(availability) ? Math.max(0, availability) : undefined;
                            const minPackQty = maxQty === 0 ? 0 : 1;
                            const defaultPackQty = maxQty ?? 1;
                            const onRowClick = () => {
                                if (packMode) {
                                    toggleItem(itemId, defaultPackQty);
                                } else {
                                    navigate(`/items/${itemId}`);
                                }
                            };

                            return (
                                <TableRow
                                    key={item.id}
                                    onClick={onRowClick}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={packMode ? isSelected : undefined}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onRowClick();
                                        }
                                    }}
                                    $mobileBgColor={damageLevel.colorBg}
                                    $mobileColor={damageLevel.color}
                                    $mobileShadowColor={damageLevel.colorRGB}
                                    className={isSelected ? 'selected' : ''} // ✅
                                >
                                    <TableCell id="inventoryNumber">{item.inventoryNumber ?? '-'}</TableCell>
                                    <TableCell id="name">{item.name ?? '-'}</TableCell>
                                    <TableCell id="isSet">
                                        <IconContainer icon={item.isSet ? Boxes : Box} />
                                    </TableCell>
                                    <CellAmount id="amounts" $hideOnMobile>
                                        <span>
                                            <InfoInline infoComponent={<span>Verfügbare Menge</span>}>
                                                {hasExplicitAvailability ? item.availability : availability}
                                            </InfoInline>
                                        </span>
                                        <span>
                                            <InfoInline infoComponent={<span>Tatsächliche Menge</span>}>
                                                {item.amountActual ?? '-'}
                                            </InfoInline>
                                        </span>
                                        <span>
                                            <InfoInline infoComponent={<span>Zielmenge</span>}>
                                                {item.amountTarget ?? '-'}
                                            </InfoInline>
                                        </span>
                                    </CellAmount>
                                    <TableCell id="damageLevel">
                                        <StatusBadge damageLevelType={item.damageLevel} />
                                    </TableCell>
                                    <TableCell id="location">
                                        <IconContainer icon={MapPin} />
                                        {(() => {
                                            const components = parseLocationStringRaw(item.location);
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
                                                    {Object.entries(components).map(([key, value]) => {
                                                        return (
                                                            <React.Fragment key={`${item.id}-${key}`}>
                                                                {key === 'subcontainerNumber' && '.'}
                                                                {key === 'toolNumber' && '-'}
                                                                <InfoInline
                                                                    infoComponent={
                                                                        <span>
                                                                            {mapLocationKey(key)}
                                                                            {key === 'type' && ': '}{' '}
                                                                            {key === 'type' &&
                                                                                (value === 'R'
                                                                                    ? 'Rollcontainer'
                                                                                    : 'Box (EU-Palette)')}
                                                                        </span>
                                                                    }
                                                                >
                                                                    <span>{value}</span>
                                                                </InfoInline>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()}
                                    </TableCell>
                                    <TableCell id="id" $hideOnMobile>
                                        {item.id ?? '-'}
                                    </TableCell>
                                    <TableCell id="deviceNumber" $hideOnMobile>
                                        {packMode ? (
                                            <PackModeCell>
                                                <CheckboxInput
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleItem(itemId, defaultPackQty)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <QuantitySpinner
                                                    value={qtyByItemId[itemId] ?? defaultPackQty}
                                                    min={minPackQty}
                                                    max={maxQty}
                                                    disabled={!isSelected}
                                                    onChange={(v) => setQuantity(itemId, v)}
                                                    ariaLabel="Required quantity"
                                                />
                                            </PackModeCell>
                                        ) : (
                                            (item.deviceNumber ?? '-')
                                        )}
                                    </TableCell>
                                    {packMode && (
                                        <PackControlsCell id="packControls">
                                            <PackControlsLabel>
                                                <span>Pack</span>
                                                <span style={{ opacity: 0.75 }}>
                                                    Tap card to {isSelected ? 'unselect' : 'select'}
                                                </span>
                                            </PackControlsLabel>
                                            <PackControlsRight>
                                                {isSelected && <SelectedBadge>Selected</SelectedBadge>}
                                                <QuantitySpinner
                                                    value={qtyByItemId[itemId] ?? defaultPackQty}
                                                    min={minPackQty}
                                                    max={maxQty}
                                                    disabled={!isSelected}
                                                    onChange={(v) => setQuantity(itemId, v)}
                                                    ariaLabel="Required quantity"
                                                />
                                            </PackControlsRight>
                                        </PackControlsCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </Table>

                    <PaginationContainer>
                        <PaginationInfo>
                            Zeige {items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
                            {Math.min(currentPage * pageSize, totalItems)} von {totalItems} Gegenständen
                        </PaginationInfo>
                        <PaginationControls>
                            <PaginationButton
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isLoading}
                                variant="outline-primary"
                            >
                                <IconContainer icon={ChevronLeft} />
                            </PaginationButton>

                            <PageNumbers>
                                {currentPage > 3 && (
                                    <>
                                        <PageNumber
                                            variant="outline-primary"
                                            onClick={() => handlePageChange(1)}
                                            $active={false}
                                        >
                                            1
                                        </PageNumber>
                                        {currentPage > 4 && <PageEllipsis>...</PageEllipsis>}
                                    </>
                                )}

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((page) => page >= currentPage - 2 && page <= currentPage + 2)
                                    .map((page) => (
                                        <PageNumber
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            $active={page === currentPage}
                                            variant={`${page === currentPage ? 'primary' : 'outline-primary'}`}
                                        >
                                            {page}
                                        </PageNumber>
                                    ))}

                                {currentPage < totalPages - 2 && (
                                    <>
                                        {currentPage < totalPages - 3 && <PageEllipsis>...</PageEllipsis>}
                                        <PageNumber
                                            variant="outline-primary"
                                            onClick={() => handlePageChange(totalPages)}
                                            $active={false}
                                        >
                                            {totalPages}
                                        </PageNumber>
                                    </>
                                )}
                            </PageNumbers>

                            <PaginationButton
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || isLoading}
                                variant="outline-primary"
                            >
                                <IconContainer icon={ChevronRight} />
                            </PaginationButton>
                        </PaginationControls>
                    </PaginationContainer>
                </>
            )}
        </div>
    );
};

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    gap: 12px;
    color: var(--color-font-secondary);
`;

const PaginationContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 20px;
    border-top: 1px solid var(--color-bg-accent);

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        flex-direction: column;
        gap: 16px;
    }
`;

const PaginationInfo = styled.div`
    font-size: 14px;
`;

const PaginationControls = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
`;

const PaginationButton = styled(Button)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const PageNumbers = styled.div`
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
`;

const PageNumber = styled(Button)<{ $active: boolean }>`
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: ${(props) => (props.$active ? '600' : '400')};
`;

const PageEllipsis = styled.span`
    padding: 0 4px;
    color: var(--color-font-secondary);
`;

const TableCell = styled.div<{ $hideOnMobile?: boolean }>`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 4px;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: ${(p) => (p.$hideOnMobile ? 'none' : 'flex')};
    }
`;

const InfoInline = (props: { children: ReactNode | ReactNode[]; infoComponent: ReactNode | ReactNode[] }) => {
    const { children, infoComponent } = props;

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="info-tooltip" style={{ fontSize: '14px' }}>
                    {infoComponent}
                </Tooltip>
            }
            delay={{ show: 150, hide: 300 }}
            trigger={['hover', 'focus', 'click']}
        >
            <span
                style={{
                    position: 'relative',
                    display: 'inline-block',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <span>{children}</span>
                <span
                    style={{
                        width: '100%',
                        height: '0px',
                        display: 'block',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        content: '',
                        borderBottom: '2px dotted rgba(var(--color-primary-rgb), .2)',
                    }}
                />
            </span>
        </OverlayTrigger>
    );
};

const InfoIndicator = (props: { children: ReactNode | ReactNode[] }) => {
    const { children } = props;

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="info-tooltip" style={{ fontSize: '14px' }}>
                    {children}
                </Tooltip>
            }
            delay={{ show: 150, hide: 300 }}
        >
            <span
                className="info-icon"
                style={{
                    width: '1em',
                    height: '1em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Info />
            </span>
        </OverlayTrigger>
    );
};

const SortIndicator = (props: { active: boolean; sortDirection?: SortDirection }) => {
    const { active, sortDirection } = props;

    return (
        <SortIndicatorWrapper $isActive={active}>
            <IconContainer
                icon={!active || !sortDirection ? ArrowDownAZ : sortDirection == 'asc' ? ArrowDownAZ : ArrowDownZA}
            />
        </SortIndicatorWrapper>
    );
};

const CellAmount = styled.div<{ $hideOnMobile?: boolean }>`
    --flex-gap: 6px;
    display: flex;
    flex-direction: row;
    gap: var(--flex-gap);

    & > span:not(:last-child)::after {
        position: relative;
        display: block;
        content: '/';
        float: right;
        margin-left: var(--flex-gap);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: ${(p) => (p.$hideOnMobile ? 'none' : 'flex')};
    }
`;

const Table = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    border-radius: 8px;
    overflow-x: auto;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: flex;
        flex-direction: column;
        max-width: 100%;
        gap: 16px;
        border-radius: 0;
    }
`;

const TableRowBase = styled.div`
    --border-color: var(--color-bg-accent);

    display: contents;

    & > * {
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color);
    }

    & > *:first-child {
        border-left: 1px solid var(--border-color);
    }

    & > *:last-child {
        border-right: 1px solid var(--border-color);
    }

    max-width: 100%;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        & > * {
            border: none !important;
        }
    }
`;

const TableHeader = styled(TableRowBase)`
    & > * {
        background-color: var(--border-color);
        color: var(--color-font-secondary);
        font-weight: 600;
        border-bottom: 2px solid var(--border-color);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: none;
    }
`;

const TableRow = styled(TableRowBase)<{ $mobileBgColor: string; $mobileColor: string; $mobileShadowColor: string }>`
    & > * {
        background-color: white;
    }

    &:hover > * {
        background-color: var(--color-bg-hover, #f8f9fa);
        cursor: pointer;
    }

    & span.info-icon {
        opacity: 0;
    }

    &:hover span.info-icon {
        opacity: 1;
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: grid !important;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'inventoryNumber damageLevel'
            'name name'
            'location isSet'
            'packControls packControls';
        gap: 12px;
        padding: 16px;

        border: 1px solid ${(p) => p.$mobileBgColor} !important;
        border-left: 4px solid ${(p) => p.$mobileBgColor} !important;
        border-radius: 8px;

        box-shadow: 0 2px 6px rgba(${(p) => p.$mobileShadowColor}, 0.05);

        &.selected {
            border: 2px solid var(--color-primary) !important;
            border-left: 4px solid var(--color-primary) !important;
            background-color: rgba(var(--color-primary-rgb), 0.06);
        }

        & > #location svg {
            display: none;
        }

        & > * {
            background-color: transparent !important;
            padding: 0 !important; /* Remove default padding */
        }

        & > #inventoryNumber {
            grid-area: inventoryNumber;
        }
        & > #name {
            grid-area: name;
            font-weight: 600;
            font-size: 16px;
        }
        & > #damageLevel {
            grid-area: damageLevel;
            justify-self: end;
        }

        & > #location {
            grid-area: location;

            & svg {
                display: block;
            }
        }

        & > #location,
        & > #inventoryNumber,
        & > #isSet {
            font-size: 14px;
            color: var(--color-font-secondary);
        }

        & > #isSet {
            justify-self: end;
            grid-area: isSet;
        }

        & > #packControls {
            grid-area: packControls;
        }
    }
`;

const HeaderCell = styled.div`
    cursor: pointer;
`;

const HeaderContent = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
`;

const SortIndicatorWrapper = styled.span<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    transition: opacity 0.1s;

    opacity: ${(props) => (props.$isActive ? '1' : '0')};

    ${HeaderCell}:hover & {
        opacity: ${(props) => (props.$isActive ? '1' : '0.5')} !important;
    }
`;

const PackModeCell = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const PackControlsCell = styled(TableCell)`
    /* Only show mobile pack controls on phones */
    display: none;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 8px !important;
    border-top: 1px dashed var(--color-bg-accent);

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: flex;
    }
`;

const PackControlsLabel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 13px;
    color: var(--color-font-secondary);
`;

const PackControlsRight = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const SelectedBadge = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.12);
`;

const CheckboxInput = styled.input`
    cursor: pointer;
    width: 18px;
    height: 18px;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

export default ItemOverview;
