import ExcelJS from 'exceljs';
import { type IItem, DamageLevelType } from '../items';
import { inventoryApi, labelsApi } from '../../app/api';
import DamageLevelTranslation from '../../utils/damageLevels';
import type { ILabel } from '../labels';
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
    {
        header: 'Labels',
        key: 'labels',
        required: false,
        exportTransform: (v: ILabel[]) => (v && v.length > 0 ? v.map((l) => l.name).join(', ') : ''),
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
];

interface LabelColumnDefinition {
    header: string;
    key: keyof ILabel;
    required: boolean;
    exportTransform?: (value: any, label: ILabel) => ExcelJS.CellValue;
    importTransform?: (value: ExcelJS.CellValue) => any;
}

const LABEL_EXCEL_COLUMNS: LabelColumnDefinition[] = [
    {
        header: 'ID',
        key: 'id',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Name',
        key: 'name',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Farbe',
        key: 'color',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
];

export async function exportExcel(items: IItem[], labels: ILabel[] = []): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inventory');

    const headerRow = EXCEL_COLUMNS.map((col) => col.header);
    sheet.addRow(headerRow);

    items.forEach((item) => {
        const rowValues = EXCEL_COLUMNS.map((col) => {
            if (col.key == 'oe') {
                return col.exportTransform ? col.exportTransform('', item) : '';
            }
            const rawValue = item[col.key as keyof IItem];
            return col.exportTransform ? col.exportTransform(rawValue, item) : rawValue;
        });
        sheet.addRow(rowValues);
    });

    const labelsSheet = workbook.addWorksheet('Labels');
    const labelHeaderRow = LABEL_EXCEL_COLUMNS.map((col) => col.header);
    labelsSheet.addRow(labelHeaderRow);

    labels.forEach((label) => {
        const rowValues = LABEL_EXCEL_COLUMNS.map((col) => {
            const rawValue = label[col.key];
            return col.exportTransform ? col.exportTransform(rawValue, label) : rawValue;
        });
        labelsSheet.addRow(rowValues);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function importExcel(file: File, onProgress?: (percentage: number) => void): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    // 1. Process Labels sheet if it exists
    const labelsSheet = workbook.getWorksheet('Labels');
    const existingLabelsMap = new Map<string, ILabel>();
    const labelsByNameMap = new Map<string, ILabel>();

    if (labelsSheet) {
        const labelHeaderRow = labelsSheet.getRow(1);
        const labelHeaderMap = new Map<string, number>();

        labelHeaderRow.eachCell((cell, colNumber) => {
            const headerText = (cell.value ?? '').toString().trim();
            if (headerText) {
                labelHeaderMap.set(headerText, colNumber);
            }
        });

        const idCol = labelHeaderMap.get('ID');
        const nameCol = labelHeaderMap.get('Name');
        const colorCol = labelHeaderMap.get('Farbe');

        if (idCol && nameCol && colorCol) {
            const labelsToAdd: ILabel[] = [];
            const totalLabelRows = labelsSheet.rowCount;

            for (let rowIdx = 2; rowIdx <= totalLabelRows; rowIdx++) {
                const row = labelsSheet.getRow(rowIdx);
                if (!row.hasValues) continue;

                const id = row.getCell(idCol).value?.toString().trim();
                const name = row.getCell(nameCol).value?.toString().trim();
                const color = row.getCell(colorCol).value?.toString().trim();

                if (id && name && color) {
                    const newLabel: ILabel = { id, name, color };
                    labelsToAdd.push(newLabel);
                    existingLabelsMap.set(id, newLabel);
                    labelsByNameMap.set(name, newLabel);
                }
            }

            // Upsert all labels found in the Excel to the DB
            for (const label of labelsToAdd) {
                try {
                    // Try to get first, if it doesn't exist add it. If it exists, we could update it. 
                    // But for simplicity, we just rely on addLabel which might overwrite or we just catch duplicate ID errors.
                    await labelsApi.addLabel(label);
                } catch (e) {
                   // Ignore duplicate errors if they exist
                   console.log("Label may already exist", label.id);
                }
            }
        }
    } else {
        // If there's no Labels sheet, let's load what we have from the DB to map any old items
        const dbLabels = await labelsApi.getAllLabels();
        dbLabels.forEach(l => {
            existingLabelsMap.set(l.id, l);
            labelsByNameMap.set(l.name, l);
        });
    }


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
                    } else if (colDef.key === 'labels') {
                        const rawLabels = parsedValue?.toString() || '';
                        const labelIdentifiers = rawLabels.split(',').map(s => s.trim()).filter(Boolean);
                        const assignedLabels: ILabel[] = [];

                        for (const lIdOrName of labelIdentifiers) {
                            const foundLabel = existingLabelsMap.get(lIdOrName) || labelsByNameMap.get(lIdOrName);
                            if (foundLabel) {
                                assignedLabels.push(foundLabel);
                            }
                        }
                        rowData['labels'] = assignedLabels;
                        continue;
                    }

                    rowData[colDef.key as keyof IItem] = parsedValue as any;
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
