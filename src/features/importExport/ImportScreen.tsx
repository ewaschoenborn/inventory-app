import React, { useState } from 'react';
import { exportExcel, importExcel } from '../../db/utils/excel';
import { inventoryApi } from '../../app/api';
import styled from 'styled-components';

const Container = styled.div`
    max-width: 600px;
    margin: 30px auto;
    padding: 20px;
`;

const Card = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 20px;
`;

const FileInput = styled.input`
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'success' }>`
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: none;
    color: white;
    background-color: ${({ variant }) => (variant === 'success' ? '#28a745' : '#007bff')};
    cursor: pointer;
    transition: background-color 0.2s;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: ${({ variant }) => (variant === 'success' ? '#218838' : '#0056b3')};
    }
`;

const ImportExportScreen = () => {
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const inventoryItems = inventoryApi.useItems(); // fetch current items

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
        <Container>
            <Card>
                <Title>Import / Export Inventory</Title>
                <FileInput type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                <ButtonGroup>
                    <Button onClick={handleImportClick} disabled={importing}>
                        {importing ? 'Importing…' : 'Import'}
                    </Button>
                    <Button variant="success" onClick={handleExportClick} disabled={exporting}>
                        {exporting ? 'Exporting…' : 'Export'}
                    </Button>
                </ButtonGroup>
            </Card>
        </Container>
    );
};

export default ImportExportScreen;
