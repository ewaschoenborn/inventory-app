import React from 'react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type ColumnProps<T> = {
    title: ReactNode;
    id: string;
    sort?: boolean;
    filter?:
        | true
        | {
              placeholder?: string;
              disabled?: boolean;
          };
    width?: string;
} & ({ id: keyof T } | { getValue: (row: T) => string | number | boolean | null | undefined });

export interface TableState {
    page: number;
    rowsPerPage: number;
    sorting: { column: string; direction: 'asc' | 'desc' } | null;
    filters: Record<string, string>;
    switchValues: Record<string, boolean>;
}

export const DEFAULT_TABLE_STATE: TableState = {
    page: 1,
    rowsPerPage: 50,
    filters: {},
    sorting: null,
    switchValues: {},
};

export function DataTable<T>(props: {
    data?: T[];
    children?: React.ReactNode;
    tableState: TableState;
    setTableState: (newState: TableState) => void;
}) {
    const { data, children, tableState, setTableState } = props;
    const [columns, setColumns] = useState<ColumnProps<unknown>[]>([]);

    return (
        <>
            <ColumnCollector setColumns={setColumns}>{children}</ColumnCollector>

            <table>
                <colgroup>
                    {columns.map((col) => (
                        <col
                            key={col.id}
                            span={1}
                            style={{
                                width: col.width ?? '12em',
                            }}
                        />
                    ))}
                </colgroup>
                <thead style={{ fontWeight: 'bold' }}>
                    <tr>
                        {columns.map((col, i) => (
                            <td
                                key={i}
                                style={!col.sort ? undefined : { cursor: 'pointer', userSelect: 'none' }}
                                onClick={
                                    !col.sort
                                        ? undefined
                                        : () => {
                                              if (!tableState.sorting || tableState.sorting.column !== col.id) {
                                                  setTableState({
                                                      ...tableState,
                                                      sorting: { column: col.id, direction: 'asc' },
                                                  });
                                              } else if (tableState.sorting.direction === 'asc') {
                                                  setTableState({
                                                      ...tableState,
                                                      sorting: { column: col.id, direction: 'desc' },
                                                  });
                                              } else {
                                                  setTableState({ ...tableState, sorting: null });
                                              }
                                          }
                                }
                            >
                                {col.title}
                                {col.sort && <SortArrow state={tableState} col={col} />}
                            </td>
                        ))}
                    </tr>
                    {columns.some((c) => c.filter) && (
                        <tr>
                            {columns.map((col, i) => (
                                <td key={i}>
                                    {col.filter && <FilterBox state={tableState} setState={setTableState} col={col} />}
                                </td>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {data?.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                            {columns.map((col, colIdx) => {
                                return <td key={rowIdx + '-' + colIdx}>{String(row[col.id as keyof T]) ?? '-'}</td>;
                            })}
                        </tr>
                    ))}

                    {!data?.length && (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                                {(data === null || data === undefined) && <div>Lade Daten...</div>}
                                {data?.length === 0 && 'Keine Daten gefunden.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

const columnSymbol = Symbol('columnSymbol');
export function Column<T>(props: ColumnProps<T>) {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!ref.current) return;

        const oldProps = (ref.current as any)[columnSymbol];
        const keys = [...new Set([...Object.keys(oldProps ?? {}), ...Object.keys(props)])];
        if (keys.every((k) => oldProps[k] === (props as any)[k])) return;

        (ref.current as any)[columnSymbol] = props;
        const oldVersion = parseInt(ref.current.getAttribute('data-version') ?? '0');
        ref.current.setAttribute('data-version', (oldVersion + 1).toString());
    }, [props]);

    return (
        <div
            ref={(el) => {
                if (!el) return;
                if (ref.current === el) return;
                el.classList.add('data-table-dummy-column');
                (el as any)[columnSymbol] = props;
                ref.current = el;
            }}
        ></div>
    );
}

const ColumnCollector = React.memo(ColumnCollector_);
ColumnCollector.displayName = 'ColumnCollector';
function ColumnCollector_(props: {
    children: ReactNode;
    setColumns: React.Dispatch<React.SetStateAction<ColumnProps<unknown>[]>>;
}) {
    return (
        <div
            style={{ display: 'none' }}
            ref={(el) => {
                if (!el) return;
                const mutOb = new MutationObserver(() => collectColumns(el, props.setColumns));
                mutOb.observe(el, { childList: true, subtree: true, attributeFilter: ['data-version'] });
                collectColumns(el, props.setColumns);
                return () => mutOb.disconnect();
            }}
        >
            {props.children}
        </div>
    );
}

function collectColumns(el: HTMLElement, setColumns: React.Dispatch<React.SetStateAction<ColumnProps<unknown>[]>>) {
    const colElements = [...el.querySelectorAll('.data-table-dummy-column')];
    const columns = colElements.map((x) => (x as any)[columnSymbol]);
    setColumns((oldColumns) => {
        if (oldColumns.length === columns.length && columns.every((x, i) => x === oldColumns.at(i))) return oldColumns;

        return columns;
    });
}

function SortArrow(props: { state: TableState; col: ColumnProps<any> }) {
    const sort = props.state.sorting;
    return (
        <span style={{ paddingLeft: '8px' }}>
            {sort?.column !== props.col.id ? (
                <span>Up/ Down</span>
            ) : sort.direction === 'asc' ? (
                <span>Up</span>
            ) : (
                <span>Down</span>
            )}
        </span>
    );
}

function FilterBox(props: { state: TableState; col: ColumnProps<any>; setState: (newState: TableState) => void }) {
    const _filter = props.col.filter === true ? null : props.col.filter;
    const placeholder = _filter?.placeholder;
    const disabled = _filter?.disabled;

    const columnFilter = props.state.filters[props.col.id];
    const propsRef = useRef(props);
    propsRef.current = props;

    const [filterValue, setFilterValue] = useState<string>(columnFilter ?? '');

    useEffect(() => {
        const handler = setTimeout(() => {
            propsRef.current.setState({
                ...propsRef.current.state,
                filters: {
                    ...propsRef.current.state.filters,
                    [propsRef.current.col.id]: filterValue,
                },
            });
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [filterValue]);

    useEffect(() => {
        setFilterValue(columnFilter ?? '');
    }, [columnFilter]);

    if (!props.col.filter) return null;

    return (
        <input
            type="text"
            placeholder={placeholder}
            style={{ display: 'block', width: props.col.width ?? '10em' }}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            disabled={disabled}
        />
    );
}
