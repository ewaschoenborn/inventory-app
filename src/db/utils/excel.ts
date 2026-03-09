import ExcelJS from 'exceljs';
import { type IItem, DamageLevelType } from '../items';
import { inventoryApi } from '../../app/api';
import DamageLevelTranslation from '../../utils/damageLevels';
interface ColumnDefinition {
    header: string;
    key: keyof IItem | 'oe';
    defaultValue?: any;
    required: boolean;
    // Function to convert IItem value to Excel Cell value
    exportTransform?: (value: any, item: IItem) => ExcelJS.CellValue;
    // Function to convert Excel Cell value to IItem value
    importTransform?: (value: ExcelJS.CellValue) => any;
}

const getDamageKeyFromTranslation = (val: string): DamageLevelType => {
    const entry = Object.entries(DamageLevelTranslation).find(([, v]) => v === val);
    return (entry ? entry[0] : 'none') as DamageLevelType;
};

const EXCEL_COLUMNS: ColumnDefinition[] = [
    {
        header: 'Ebene',
        key: 'level',
        required: false,
        importTransform: (v) => (v ? parseInt(v.toString()) : undefined),
    },
    {
        header: 'OE',
        key: 'oe',
        required: false,
        exportTransform: () => 'AC1N',
        importTransform: () => undefined,
        defaultValue: 'AC1N',
    },
    {
        header: 'Art',
        key: 'art',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Menge',
        key: 'amountTarget',
        required: false,
        exportTransform: (v) => v ?? 0,
        importTransform: (v) => {
            if (v == null) {
                return 0;
            }
            const parsed = parseInt(v.toString(), 10);
            return isNaN(parsed) ? 0 : parsed;
        },
        defaultValue: 0,
    },
    {
        header: 'Menge Ist',
        key: 'amountActual',
        required: false,
        exportTransform: (v) => v ?? 0,
        importTransform: (v) => {
            if (v == null) {
                return 0;
            }
            const parsed = parseInt(v.toString(), 10);
            return isNaN(parsed) ? 0 : parsed;
        },
        defaultValue: 0,
    },
    {
        header: 'Ort',
        key: 'location',
        required: false,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Verfügbar',
        key: 'availability',
        required: false,
        exportTransform: (v) => v ?? 0,
        importTransform: (v) => {
            if (v == null) {
                return 0;
            }
            const parsed = parseInt(v.toString(), 10);
            return isNaN(parsed) ? 0 : parsed;
        },
        defaultValue: 0,
    },
    {
        header: 'Ausstattung | Hersteller | Typ',
        key: 'name',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Sachnummer',
        key: 'itemId',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Inventar Nr',
        key: 'inventoryNumber',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Gerätenr.',
        key: 'deviceNumber',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Schadenszustand',
        key: 'damageLevel',
        required: false,
        exportTransform: (v) => DamageLevelTranslation[v as DamageLevelType] ?? v ?? '',
        importTransform: (v) => (v ? getDamageKeyFromTranslation(v.toString().trim()) : 'none'),
        defaultValue: 'none',
    },
    {
        header: 'Letzte Inspektion',
        key: 'lastInspection',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Inspektionsintervall (Monate)',
        key: 'inspectionIntervalMonths',
        required: false,
        importTransform: (v) => (v ? parseInt(v.toString().trim()) : undefined),
    },
    {
        header: 'Bemerkung',
        key: 'remark',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
];

export async function exportExcel(items: IItem[]): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inventory');

    const headerRow = EXCEL_COLUMNS.map((col) => col.header);
    sheet.addRow(headerRow);

    items.forEach((item) => {
        const rowValues = EXCEL_COLUMNS.map((col) => {
            if (col.key == 'oe') {
                return col.exportTransform ? col.exportTransform('', item) : '';
            }
            const rawValue = item[col.key];
            return col.exportTransform ? col.exportTransform(rawValue, item) : rawValue;
        });
        sheet.addRow(rowValues);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function importExcel(file: File, onProgress?: (percentage: number) => void): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];

    const headerRow = sheet.getRow(1);
    const headerMap = new Map<string, number>();

    headerRow.eachCell((cell, colNumber) => {
        const headerText = (cell.value ?? '').toString().trim();
        if (headerText) {
            headerMap.set(headerText, colNumber);
        }
    });

    const missingRequiredHeaders = EXCEL_COLUMNS.filter((col) => col.required && !headerMap.has(col.header)).map(
        (col) => col.header
    );

    if (missingRequiredHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingRequiredHeaders.join(', ')}`);
    }

    const totalRows = sheet.rowCount;

    const itemsToAdd: IItem[] = [];

    for (let rowIdx = 2; rowIdx <= totalRows; rowIdx++) {
        const row = sheet.getRow(rowIdx);

        if (onProgress) {
            onProgress(Math.floor((rowIdx / totalRows) * 100));
        }

        if (!row.hasValues) continue;

        const rowData: Partial<IItem> = {};

        for (const colDef of EXCEL_COLUMNS) {
            const colIndex = headerMap.get(colDef.header);

            if (colIndex !== undefined) {
                const cell = row.getCell(colIndex);
                const cellValue = cell.value;

                try {
                    let parsedValue = cellValue;

                    if (colDef.key === 'oe') {
                        continue;
                    }

                    if (colDef.importTransform) {
                        parsedValue = colDef.importTransform(cellValue);
                    } else if (cellValue !== null && cellValue !== undefined) {
                        parsedValue = cellValue.toString().trim();
                    }

                    if (parsedValue?.toString().match(/^( |-|–|—)+$/)) {
                        parsedValue = null;
                    }

                    if (colDef.key === 'art') {
                        if (parsedValue === 'Satz') {
                            rowData['isSet'] = true;
                        } else if (parsedValue === 'Teil') {
                            rowData['isSet'] = false;
                        } else {
                            rowData['isSet'] = undefined;
                        }
                    }

                    rowData[colDef.key] = parsedValue as any;
                } catch (error) {
                    console.warn(`Error parsing column '${colDef.header}' at row ${rowIdx}`, error);
                }
            }
        }

        for (const colDef of EXCEL_COLUMNS) {
            if (colDef.key === 'oe') {
                continue;
            }

            if (rowData[colDef.key] === undefined && colDef.defaultValue !== undefined) {
                rowData[colDef.key] = colDef.defaultValue;
            }
        }

        if (!rowData.itemId || !rowData.name) {
            console.warn(`Skipping row ${rowIdx}: Missing ID or Name`);
            continue;
        }

        itemsToAdd.push(rowData as IItem);
    }

    await inventoryApi.addItemsBulk(itemsToAdd);
}
