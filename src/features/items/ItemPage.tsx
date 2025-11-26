import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../db/db';
import type { IItem, DamageLevelType } from '../../db/items';

const ItemPage = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [item, setItem] = useState<IItem | null>(null);
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Fetch the item from Dexie by ID
    useEffect(() => {
        const fetchItem = async () => {
            if (!itemId) return;
            const dbItem = await db.items.get(itemId);
            if (dbItem) {
                setItem(dbItem);
                setText(dbItem.remark || '-No additional information.');
            }
        };
        fetchItem();
    }, [itemId]);

    // Auto-grow textarea
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    const handleAdditionalDocs = () => {
        alert('Additional Docs clicked!');
    };

    if (!item) return <p className="text-center mt-4">Loading item...</p>;

    const itemReference = `Item Ref: ${item.inventoryNumber || item.id}`;

    // Helper to capitalize damage level
    const formatDamageLevel = (level: DamageLevelType) => level.charAt(0).toUpperCase() + level.slice(1);

    return (
        <div className="container py-4">
            <h1 className="mb-1">{item.name}</h1>
            <div className="text-muted mb-4">{itemReference}</div>
            {/* Two-column info */}
            <div className="row mb-4 border rounded p-3">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <p>
                        <strong>Maintenance Stat:</strong> {formatDamageLevel(item.damageLevel)}
                    </p>
                    <p>
                        <strong>Device Number:</strong> {item.deviceNumber || '-'}
                    </p>
                    <p>
                        <strong>Is Set:</strong> {item.isSet ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <strong>Amount Target:</strong> {item.amountTarget}
                    </p>
                    <p>
                        <strong>Amount Actual:</strong> {item.amountActual}
                    </p>
                    <p>
                        <strong>Availability:</strong> {item.availability}
                    </p>
                </div>
                <div className="col-12 col-md-6">
                    <p>
                        <strong>Location:</strong> {item.location}
                    </p>
                    <p>
                        <strong>Level:</strong> {item.level}
                    </p>
                    <p>
                        <strong>Last Inspection:</strong> {item.lastInspection || '-'}
                    </p>
                    <p>
                        <strong>Inspection Interval (months):</strong> {item.inspectionIntervalMonths || '-'}
                    </p>
                    <p>
                        <strong>Remark:</strong> {item.remark || '-'}
                    </p>
                </div>
            </div>
            {/* Remark / detail textarea */}
            <textarea
                ref={textareaRef}
                className="form-control mb-3"
                value={text}
                readOnly
                rows={3}
                style={{ overflow: 'hidden', resize: 'none' }}
                onChange={(e) => setText(e.target.value)}
            />
            {/*<button className="btn btn-primary w-100" onClick={handleAdditionalDocs}>
                Additional Docs
            </button>*/}{' '}
            {/*this is for later if we get to add files such as guides and documents from items*/}
        </div>
    );
};

export default ItemPage;
