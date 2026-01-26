import React, { useState } from 'react';
import { type IDbInventoryItem, CompoundType } from '../../db/legacy.items';
import { lookupApi, inventoryApi } from '../../app/legacy.api';
import { exportExcel, importExcel } from '../../db/utils/excel';
import { inventoryApi as newInventoryApi } from '../../app/api';

const SeedDataForm = () => {
    const [name, setName] = useState('');

    const orgUnits = lookupApi.useOrganisationalUnits();
    const itemTypes = lookupApi.useItemTypes();
    const manufacturers = lookupApi.useManufacturers();
    const itemDefinitions = lookupApi.useItemDefinitions();

    const handleAddDefinition = () => {
        const typeId = itemTypes[0]?.id;
        const manufId = manufacturers[0]?.id;
        if (!typeId || !manufId) {
            alert('Please add at least one Item Type and one Manufacturer first.');
            return;
        }
        lookupApi.addItemDefinition({
            name: `${name} (Type: ${typeId}, Manuf: ${manufId})`,
            itemTypeId: typeId,
            manufacturerId: manufId,
        });
    };

    return (
        <div
            style={{
                background: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '20px',
            }}
        >
            <h4>1. Seed Lookup Data (Prerequisites)</h4>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <br />
            <button onClick={() => lookupApi.addLookupItem('organisationalUnits', name)}>Add Org Unit</button>
            <button onClick={() => lookupApi.addLookupItem('manufacturers', name)}>Add Manufacturer</button>
            <button onClick={() => lookupApi.addLookupItem('itemTypes', name)}>Add Item Type</button>
            <button onClick={handleAddDefinition}>Add Item Definition</button>

            <details>
                <summary style={{ cursor: 'pointer', marginTop: '10px' }}>Show Current Lookup Data (IDs)</summary>
                <pre style={{ fontSize: '12px', background: '#fff', padding: '5px' }}>
                    OrgUnits: {JSON.stringify(orgUnits, null, 2)}
                    <br />
                    Manufacturers: {JSON.stringify(manufacturers, null, 2)}
                    <br />
                    ItemTypes: {JSON.stringify(itemTypes, null, 2)}
                    <br />
                    ItemDefinitions: {JSON.stringify(itemDefinitions, null, 2)}
                </pre>
            </details>
        </div>
    );
};

const Dashboard = () => {
    const [externalId, setExternalId] = useState('');
    const [position, setPosition] = useState('');

    const inventoryItems = inventoryApi.useInventoryItems();
    const orgUnits = lookupApi.useOrganisationalUnits();
    const itemDefinitions = lookupApi.useItemDefinitions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const orgUnitId = orgUnits[0]?.id;
        const itemDefId = itemDefinitions[0]?.id;

        if (!orgUnitId || !itemDefId) {
            alert("Please add at least one Org Unit and one Item Definition using the 'Seed Data' form first.");
            return;
        }

        const newItem: Omit<IDbInventoryItem, 'id'> = {
            externalId,
            position,
            floor: 1, // Default value
            amountTarget: 10, // Default value
            amountActual: 5, // Default value
            isAvailable: true, // Default value
            compoundType: CompoundType.PART, // Default value
            organisationalUnitId: orgUnitId,
            itemDefinitionId: itemDefId,
        };

        await inventoryApi.addInventoryItem(newItem);
        setExternalId('');
        setPosition('');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure?')) {
            inventoryApi.deleteInventoryItem(id);
        }
    };

    const handleUpdateAmount = (id: number) => {
        const newAmountStr = prompt("Enter new 'actual amount':");
        if (newAmountStr === null) return; // User cancelled
        const newAmount = parseInt(newAmountStr, 10);
        if (!isNaN(newAmount)) {
            inventoryApi.updateItemAmount(id, newAmount);
        }
    };

    // import + export excel
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const newDBInventoryItems = newInventoryApi.useItems();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null);
    };

    const handleImportClick = async () => {
        if (!file) {
            alert('Select a file');
            return;
        }
        setImporting(true);
        try {
            await importExcel(file);
            alert('Import finished');
        } finally {
            setImporting(false);
        }
    };

    const handleExportClick = async () => {
        setExporting(true);
        try {
            const blob = await exportExcel(newDBInventoryItems);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Generate filename with date and time suffix
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
            a.download = `inventory_${dateStr}.xlsx`;

            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            alert('Export failed: ' + (error as Error).message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                padding: '20px',
                maxWidth: '1000px',
                margin: 'auto',
            }}
        >
            <h1>Inventory App</h1>
            <>
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                <button onClick={handleImportClick} disabled={importing}>
                    {importing ? 'Importing…' : 'Import'}
                </button>
                <button onClick={handleExportClick} disabled={exporting} style={{ marginLeft: 8 }}>
                    {exporting ? 'Exporting…' : 'Export'}
                </button>
            </>

            <SeedDataForm />

            <hr />

            <h4>2. Add New Inventory Item</h4>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={externalId}
                    onChange={(e) => setExternalId(e.target.value)}
                    placeholder="Sachnummer (External ID)"
                    required
                />
                <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Ort (Position)"
                    required
                />
                <button type="submit" disabled={!orgUnits.length || !itemDefinitions.length}>
                    Add Inventory Item
                </button>
                {!orgUnits.length || !itemDefinitions.length ? (
                    <small style={{ marginLeft: '10px' }}> (Disabled until OrgUnit and ItemDef exist)</small>
                ) : (
                    ''
                )}
            </form>

            <hr />

            <h4>3. Current Inventory Legacy DB</h4>
            <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead style={{ background: '#eee' }}>
                    <tr>
                        <th>ID</th>
                        <th>Sachnummer</th>
                        <th>Position (Ort)</th>
                        <th>Amount (Actual/Target)</th>
                        <th>Def. ID (FK)</th>
                        <th>Org. ID (FK)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryItems.length === 0 && (
                        <tr>
                            <td colSpan={7}>No inventory items found.</td>
                        </tr>
                    )}
                    {inventoryItems.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.externalId}</td>
                            <td>{item.position}</td>
                            <td>
                                {item.amountActual} / {item.amountTarget}
                            </td>
                            <td>{item.itemDefinitionId}</td>
                            <td>{item.organisationalUnitId}</td>
                            <td>
                                <button onClick={() => handleDelete(item.id!)} style={{ color: 'red' }}>
                                    Delete
                                </button>
                                <button onClick={() => handleUpdateAmount(item.id!)}>Update Amount</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h4>4. Current Inventory Imported DB</h4>
            {/* <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead style={{ background: '#eee' }}>
                    <tr>
                        <th>ID</th>
                        <th>Sachnummer</th>
                        <th>Position (Ort)</th>
                        <th>Amount (Actual/Target)</th>
                        <th>Def. ID (FK)</th>
                        <th>Org. ID (FK)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryItems.length === 0 && (
                        <tr>
                            <td colSpan={7}>No inventory items found.</td>
                        </tr>
                    )}
                    {inventoryItems.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.externalId}</td>
                            <td>{item.position}</td>
                            <td>
                                {item.amountActual} / {item.amountTarget}
                            </td>
                            <td>{item.itemDefinitionId}</td>
                            <td>{item.organisationalUnitId}</td>
                            <td>
                                <button onClick={() => handleDelete(item.id!)} style={{ color: 'red' }}>
                                    Delete
                                </button>
                                <button onClick={() => handleUpdateAmount(item.id!)}>Update Amount</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    );
};

export default Dashboard;
