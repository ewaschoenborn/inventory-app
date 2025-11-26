import { useLocation, useNavigate } from 'react-router';
import { type TableState, DEFAULT_TABLE_STATE } from './Table';

const parseTableStateFromSearchString = (
    search: string,
    defaultState: TableState = DEFAULT_TABLE_STATE
): TableState => {
    const params = new URLSearchParams(search);

    const filters: Record<string, string> = { ...defaultState.filters };
    const switchValues: Record<string, boolean> = { ...defaultState.switchValues };
    for (const [key, value] of params.entries()) {
        if (key.startsWith('filter.')) {
            filters[key.substring(7)] = value;
        } else if (key.startsWith('switch.')) {
            switchValues[key.substring(7)] = value === 'true';
        }
    }

    let sorting: { column: string; direction: 'asc' | 'desc' } | null = defaultState.sorting;
    const sortColumn = params.get('sorting');
    if (sortColumn) {
        sorting = {
            column: sortColumn,
            direction: params.has('descending') ? 'desc' : 'asc',
        };
    }

    function parseIntFromParams(key: string) {
        const value = params.get(key);
        if (!value) return undefined;
        const num = parseInt(value);
        return isNaN(num) ? undefined : num;
    }

    return {
        page: parseIntFromParams('page') ?? defaultState.page,
        rowsPerPage: parseIntFromParams('rowsPerPage') ?? defaultState.rowsPerPage,
        filters,
        sorting,
        switchValues,
    };
};

const stringifyTableStateToSearchString = (
    tableState: TableState,
    defaultState: TableState = DEFAULT_TABLE_STATE
): string => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(tableState.filters)) {
        const defaultValue = defaultState.filters[key];
        if (!value && !defaultValue) continue;
        if (value !== defaultValue) {
            params.append(`filter.${key}`, value);
        }
    }

    for (const [key, value] of Object.entries(tableState.switchValues)) {
        params.append(`switch.${key}`, value ? 'true' : 'false');
    }

    if (tableState.sorting) {
        params.set('sorting', tableState.sorting.column);
        if (tableState.sorting.direction === 'desc') {
            params.set('descending', '');
        }
    }

    if (tableState.page !== defaultState.page) {
        params.set('page', tableState.page.toString());
    }

    if (tableState.rowsPerPage !== defaultState.rowsPerPage) {
        params.set('rowsPerPage', tableState.rowsPerPage.toString());
    }

    return params.toString();
};

export const useHistoryTableState = (
    defaultOverrides?: Partial<TableState>
): [tableState: TableState, setTableState: (ts: TableState) => void] => {
    const location = useLocation();
    const navigate = useNavigate();

    const defaults = { ...DEFAULT_TABLE_STATE, ...defaultOverrides };
    const tableState = parseTableStateFromSearchString(location.search, defaults);

    const setTableState = (ts: TableState) => {
        const search = stringifyTableStateToSearchString(ts, defaults);
        navigate({ search }, { replace: true });
    };
    return [tableState, setTableState] as const;
};
