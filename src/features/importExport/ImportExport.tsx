import React, { useState } from 'react';
import { exportExcel, importExcel } from '../../db/utils/excel';
import { inventoryApi } from '../../app/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const InventoryExcel = () => {
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const inventoryItems = inventoryApi.useItems(); // or newInventoryApi depending on your setup

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null);
    };

    const handleImportClick = async () => {
        if (!file) {
            alert('Select a file first.');
            return;
        }
        setImporting(true);
        try {
            await importExcel(file);
            alert('Import finished!');
        } catch (err) {
            alert('Import failed: ' + (err as Error).message);
        } finally {
            setImporting(false);
        }
    };

    const handleExportClick = async () => {
        setExporting(true);
        try {
            const blob = await exportExcel(inventoryItems);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'inventory.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Export failed: ' + (err as Error).message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="container my-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Import / Export Excel File</h2>

                    <div className="mb-3">
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                        <button className="btn btn-primary flex-fill" onClick={handleImportClick} disabled={importing}>
                            {importing ? 'Importing…' : 'Import Excel'}
                        </button>
                        <button className="btn btn-success flex-fill" onClick={handleExportClick} disabled={exporting}>
                            {exporting ? 'Exporting…' : 'Export Excel'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryExcel;
