import { useState } from 'react';

// usePackMode.ts
export const usePackMode = () => {
    const [packMode, setPackMode] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set()); // use string
    const [qtyByItemId, setQtyByItemId] = useState<Record<string, number>>({});
    const [planName, setPlanName] = useState('');

    const togglePackMode = () => {
        setPackMode((prev) => {
            if (prev) {
                // Exiting pack mode - reset state
                setSelectedItemIds(new Set());
                setQtyByItemId({});
                setPlanName('');
            } else {
                // Entering pack mode - set default plan name
                setPlanName(`Packing plan - ${new Date().toLocaleDateString()}`);
            }
            return !prev;
        });
    };

    const toggleItem = (id: string, defaultQuantity: number = 1) => {
        setSelectedItemIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                // Remove quantity when unchecking
                setQtyByItemId((prevQty) => {
                    const nextQty = { ...prevQty };
                    delete nextQty[id];
                    return nextQty;
                });
            } else {
                next.add(id);
                // Set default quantity when checking (only if not set already)
                setQtyByItemId((prevQty) => ({
                    ...prevQty,
                    [id]: prevQty[id] ?? defaultQuantity,
                }));
            }
            return next;
        });
    };

    const setQuantity = (id: string, quantity: number) => {
        setQtyByItemId((prev) => ({
            ...prev,
            [id]: quantity,
        }));
    };

    return {
        packMode,
        selectedItemIds,
        qtyByItemId,
        planName,
        setPlanName,
        togglePackMode,
        toggleItem,
        setQuantity,
        clear: () => {
            setSelectedItemIds(new Set());
            setQtyByItemId({});
            setPlanName(`Packing plan - ${new Date().toLocaleDateString()}`);
        },
    };
};
