import { useEffect, useState } from 'react';
import { db } from '../../db/db';

interface IPackingPlan {
    id: string;
    name: string;
    items: string[];
    createdAt: string;
}

const PackingPlanOverview = () => {
    const [plans, setPlans] = useState<IPackingPlan[]>([]);

    useEffect(() => {
        const fetchPlans = async () => {
            const allPlans = await db.packingPlans.toArray();
            setPlans(allPlans);
        };
        fetchPlans();
    }, []);

    return (
        <div className="container py-4">
            <h3>Packing Plans</h3>

            {plans.length === 0 && <p>No packing plans yet.</p>}

            <ul className="list-group">
                {plans.map((plan) => (
                    <li key={plan.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{plan.name}</strong> <br />
                            <small>{plan.items.length} items packed</small>
                        </div>
                        <small>{new Date(plan.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PackingPlanOverview;
