import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../db/db';
import { type IItem } from '../../db/items';

const PackingPlan = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState<IItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            const dbItems = await db.items.toArray();
            setItems(dbItems);
        };
        fetchItems();
    }, []);

    const toggleSelect = (itemId: string) => {
        setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
    };

    const filteredItems = items.filter((item) => {
        const term = searchTerm.toLowerCase();
        return [item.name, item.location, item.id, item.inventoryNumber || '', item.deviceNumber || ''].some((field) =>
            field.toLowerCase().includes(term)
        );
    });

    const savePackingPlan = async () => {
        if (selectedItems.length === 0) return;

        const name = prompt('Enter a name for this packing plan:');
        if (!name) return;

        await db.packingPlans.add({
            id: crypto.randomUUID(),
            name,
            items: selectedItems,
            createdAt: new Date().toISOString(),
        });

        alert('Packing plan saved!');
        navigate('/packingplanOverview');
    };

    return (
        <div className="container py-4">
            <div
                className="d-flex flex-column flex-md-row align-items-start justify-content-between mb-3 p-3 bg-light shadow-sm rounded"
                style={{ position: 'sticky', top: 0, zIndex: 1000 }}
            >
                {/* Left side: search input + back button */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 flex-grow-1">
                    <input
                        className="form-control me-md-2"
                        type="text"
                        placeholder="Search items to pack..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ minWidth: '200px' }}
                    />
                    <button className="btn btn-primary" onClick={() => navigate('/Overview')}>
                        Back
                    </button>
                </div>

                {/* Packing Summary */}
                <div
                    className="mt-2 mt-md-0 p-3 bg-light rounded shadow-sm"
                    style={{ minWidth: '220px', height: 'fit-content' }}
                >
                    <h5 className="mb-2">Packing Summary</h5>
                    <p className="mb-1">
                        <strong>Total selected:</strong> {selectedItems.length}
                    </p>
                    <button
                        className="btn btn-primary w-100 mt-2"
                        disabled={selectedItems.length === 0}
                        onClick={savePackingPlan}
                    >
                        Confirm Packing
                    </button>
                </div>
            </div>

            <div className="d-flex flex-column align-items-center">
                {filteredItems.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            className={`card mb-3 w-100 shadow-sm border ${isSelected ? 'border-primary' : 'border-secondary'}`}
                            style={{ maxWidth: '400px', cursor: 'pointer', transition: '0.2s' }}
                            onClick={() => toggleSelect(item.id)}
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 className="card-title mb-1">{item.name}</h5>
                                        <small className="text-muted">ID: {item.id}</small>
                                    </div>
                                    <div>
                                        {isSelected ? (
                                            <span className="badge bg-primary">Packed</span>
                                        ) : (
                                            <span className="badge bg-secondary">Tap to Pack</span>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between flex-wrap">
                                    <div>
                                        <strong>Location:</strong> {item.location}
                                    </div>
                                    <div>
                                        <strong>Amount:</strong> {item.amountActual} / {item.amountTarget}
                                    </div>
                                    <div>
                                        <strong>Damage:</strong>{' '}
                                        <span
                                            className={`badge ${
                                                item.damageLevel === 'none'
                                                    ? 'bg-success'
                                                    : item.damageLevel === 'minor'
                                                      ? 'bg-warning text-dark'
                                                      : 'bg-danger'
                                            }`}
                                        >
                                            {item.damageLevel.charAt(0).toUpperCase() + item.damageLevel.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {item.remark && (
                                    <p className="mt-2 mb-0">
                                        <em>{item.remark}</em>
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredItems.length === 0 && <p className="text-muted mt-3">No matching items.</p>}
            </div>
        </div>
    );
};

export default PackingPlan;
