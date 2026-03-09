import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FilterParams, SortDirection, SortField } from '../../app/api';

interface SearchParams {
    query?: string | null;
    sort?: string | null;
    filter?: string | null;
    sortField?: SortField | null;
    sortDirection?: SortDirection;
    filters?: FilterParams;
}

const initialState: SearchParams = {
    query: null,
    sortField: null,
    sortDirection: 'asc',
    filters: {
        damageLevel: null,
        type: null,
        location: '',
    },
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<SearchParams>) {
            const payload = action.payload;
            state.query = payload.query;
            state.filter = payload.filter;
            state.sort = payload.sort;
        },

        setSearchTerm(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },

        setSortField(state, action: PayloadAction<SortField | null>) {
            state.sortField = action.payload;
        },

        setSortDirection(state, action: PayloadAction<SortDirection>) {
            state.sortDirection = action.payload;
        },

        setFilters(state, action: PayloadAction<FilterParams>) {
            state.filters = action.payload;
        },

        updateFilter(state, action: PayloadAction<Partial<FilterParams>>) {
            state.filters = { ...state.filters, ...action.payload };
        },

        clearSearch(state) {
            state.query = null;
            state.sortField = null;
            state.sortDirection = 'asc';
            state.filters = {
                damageLevel: null,
                type: null,
                location: '',
            };
        },

        clearFilters(state) {
            state.filters = {
                damageLevel: null,
                type: null,
                location: '',
            };
        },
    },
});

export const {
    setSearch,
    setSearchTerm,
    setSortField,
    setSortDirection,
    setFilters,
    updateFilter,
    clearSearch,
    clearFilters,
} = searchSlice.actions;
