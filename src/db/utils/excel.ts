import ExcelJS from 'exceljs';
import { type IItem } from '../items';
import { inventoryApi } from '../../app/api';

export async function exportExcel(items: IItem[]): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inventory');

    const headers = [
        'OE',
        'Art',
        'Menge Soll',
        'Menge Ist',
        'Verfügbarkeit',
        'Ort',
        'Ebene',
        'Ausstattung | Hersteller | Typ',
        'Sachnummer',
        'Inventar Nr',
        'Gerätenr.',
        'Schadenszustand',
        'Letzte Prüfung',
        'Prüfintervall (Monate)',
        'Bemerkung',
    ];
    sheet.addRow(headers);

    items.forEach((item) => {
        sheet.addRow([
            'AC1N',
            item.isSet ? 'Satz' : 'Teil',
            item.amountTarget,
            item.amountActual,
            item.availability,
            item.location,
            item.level,
            item.name, // Placeholder for "Ausstattung | Hersteller | Typ"
            item.id,
            item.inventoryNumber ?? '',
            item.deviceNumber ?? '',
            item.damageLevel,
            item.lastInspection ?? '',
            item.inspectionIntervalMonths ?? '',
            item.remark ?? '',
        ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function importExcel(file: File): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];

    // compare headers and throw error if not matching expected headers
    const expectedHeaders = [
        'Ebene',
        'OE',
        'Art',
        'FB',
        'Menge',
        'Menge Ist',
        'Ort',
        'Verfügbar',
        'Ausstattung | Hersteller | Typ',
        'Sachnummer',
        'Inventar Nr',
        'Gerätenr.',
        'Status',
        'Bemerkung',
    ];

    const actualHeaders: string[] = [];
    sheet.getRow(1).eachCell((cell) => {
        actualHeaders.push((cell.value ?? '').toString().trim());
    });

    for (let i = 0; i < expectedHeaders.length; i++) {
        if (expectedHeaders[i] !== actualHeaders[i]) {
            throw new Error(
                `Header mismatch at column ${i + 1}: expected "${expectedHeaders[i]}", got "${actualHeaders[i]}"`
            );
        }
    }

    sheet.eachRow(async (row, rowNumber) => {
        if (rowNumber === 1) return; // skip header row

        const rowData: Partial<IItem> = {};

        // store row information in Item object
        row.eachCell((cell, colNumber) => {
            const cellValue = (cell.value ?? '').toString().trim();
            switch (colNumber) {
                case 1:
                    rowData.level = parseInt(cellValue);
                    break;
                case 2:
                    break; // ignore organisational unit for now
                case 3:
                    if (cellValue === 'Satz') {
                        rowData.isSet = true;
                    } else if (cellValue === 'Teil') {
                        rowData.isSet = false;
                    } else {
                        throw new Error(`Invalid value in 'Art' column at row ${rowNumber}: "${cellValue}"`);
                    }
                    break;
                case 4:
                    break; // ignore FB for now
                case 5:
                    if (cell.type == 2) {
                        rowData.amountTarget = parseInt(cellValue);
                    } else {
                        rowData.amountTarget = 0;
                        throw new Error(`Invalid number in 'Menge' column at row ${rowNumber}: "${cellValue}"`);
                    }
                    break;
                case 6:
                    if (cell.type == 2) {
                        rowData.amountActual = parseInt(cellValue);
                    } else {
                        rowData.amountActual = 0;
                        throw new Error(`Invalid number in 'Menge Ist' column at row ${rowNumber}: "${cellValue}"`);
                    }
                    break;
                case 7:
                    rowData.location = cellValue;
                    break;
                case 8:
                    if (parseInt(cellValue) === 1) {
                        rowData.availability = (rowData.amountActual ?? 0) >= 1 ? rowData.amountActual : 0;
                    } else if (parseInt(cellValue) === 0) {
                        rowData.availability = 0;
                    } else {
                        throw new Error(`Invalid value in 'Verfügbar' column at row ${rowNumber}: "${cellValue}"`);
                    }
                    break;
                case 9:
                    rowData.name = cellValue;
                    break;
                case 10:
                    rowData.id = cellValue;
                    break;
                case 11:
                    if (cellValue !== '') {
                        rowData.inventoryNumber = cellValue;
                    }
                    break;
                case 12:
                    if (cellValue !== '') {
                        rowData.deviceNumber = cellValue;
                    }
                    break;
                case 13:
                    rowData.remark = rowData.remark !== '' ? rowData.remark + '; ' + cellValue : cellValue; // add status to remark
                    break;
                case 14:
                    rowData.remark = rowData.remark !== '' ? rowData.remark + '; ' + cellValue : cellValue;
                    break;
                default:
                    break;
            }
        });

        // set damage level to NONE as default
        rowData.damageLevel = 'none';

        try {
            await inventoryApi.addItem(rowData as IItem);
        } catch (err) {
            console.error(`Failed to add row ${rowNumber}`, err);
        }
    });
}
