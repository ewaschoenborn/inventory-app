import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../db/db';
import { type IItem, DamageLevelType } from '../../db/items';

const OverviewPage = () => {
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState<'item' | 'damage' | 'location' | 'name'>('item');
    const [items, setItems] = useState<IItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const getCardColor = (damageLevel: DamageLevelType) => {
        switch (damageLevel) {
            case DamageLevelType.NONE:
                return 'success';
            case DamageLevelType.MINOR:
                return 'warning';
            case DamageLevelType.MAJOR:
            case DamageLevelType.TOTAL:
                return 'danger';
            default:
                return 'secondary';
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            const dbItems = await db.items.toArray();
            setItems(dbItems);
        };
        fetchItems();
    }, []);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as 'item' | 'damage' | 'location' | 'name';
        setSortOption(value);

        const sorted = [...items];
        if (value === 'item') sorted.sort((a, b) => a.id.localeCompare(b.id));
        else if (value === 'damage') sorted.sort((a, b) => a.damageLevel.localeCompare(b.damageLevel));
        else if (value === 'location') sorted.sort((a, b) => a.location.localeCompare(b.location));
        else if (value === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));

        setItems(sorted);
    };

    const handleCardClick = (itemId: string) => {
        navigate(`/items/${itemId}`);
    };

    // Flexible search across multiple fields including inventoryNumber and deviceNumber
    const filteredItems = items.filter((item) => {
        const term = searchTerm.toLowerCase();
        return [item.name, item.location, item.id, item.inventoryNumber || '', item.deviceNumber || ''].some((field) =>
            field.toLowerCase().includes(term)
        );
    });

    return (
        <div className="container py-4">
            {/* top controls */}
            <div
                className="d-flex flex-wrap align-items-start mb-3 p-3 bg-light shadow-sm rounded"
                style={{ position: 'sticky', top: 0, zIndex: 1000 }}
            >
                <div className="flex-grow-1 d-flex flex-column gap-2 me-2">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Search by name, location, ID, inventory or device number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="form-select" value={sortOption} onChange={handleSortChange}>
                        <option value="item">Sort by Item #</option>
                        <option value="name">Sort by Name</option>
                        <option value="damage">Sort by Damage Level</option>
                        <option value="location">Sort by Location</option>
                    </select>
                </div>
                <div className="d-flex flex-column gap-2 mt-2 mt-sm-0">
                    <button className="btn btn-primary" onClick={() => navigate('/itemAdding')}>
                        +Item
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/packingPlan')}>
                        +Pack
                    </button>
                </div>
            </div>

            {/*cards */}
            <div className="d-flex flex-column align-items-center">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className={`card text-white bg-${getCardColor(item.damageLevel)} mb-3 w-100`}
                        style={{ maxWidth: '400px', cursor: 'pointer' }}
                        onClick={() => handleCardClick(item.id)}
                    >
                        <div className="card-body">
                            {/* Name and reference */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title mb-0">{item.name}</h5>
                                <div className="text-light" style={{ fontSize: '0.9rem' }}>
                                    {item.id || '-'}
                                </div>
                            </div>

                            {/* Damage Level and Location */}
                            <div className="d-flex justify-content-between flex-wrap">
                                <div>
                                    <strong>Damage Level:</strong> {item.damageLevel}
                                </div>
                                <div>
                                    <strong>Location:</strong> {item.location}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && <p className="text-muted mt-3">No items match your search.</p>}
            </div>
        </div>
    );
};

export default OverviewPage;
