import { Route, Routes } from 'react-router-dom';

import App from './App';
import Dashboard from './features/dashboard/Dashboard';
import MaintenanceOverview from './features/maintenance/maintenanceOverview';
import ItemDetails from './features/item/itemDetails';

import ItemOverview from './features/item/itemOverview';

import Guide from './features/guide/guide';
import More from './features/more/More';

import ImportExportScreen from './features/importExport/ImportScreen';
import AddItem from './features/item/AddItem';
import ModifyItem from './features/item/ModifyItem';
import Home from './features/home/home';
import PackingPlanOverview from './features/packingPlan/PackingPlanOverview';
import CreatePackingPlan from './features/packingPlan/CreatePackingPlan';
import PackingPlanDetails from './features/packingPlan/PackingPlanDetails';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="maintenance" element={<MaintenanceOverview />} />
                <Route path="guide/*" element={<Guide />} />
                <Route path="more" element={<More />} />

                <Route path="items" element={<ItemOverview />} />
                <Route path="items/add" element={<AddItem />} />
                <Route path="items/:id/modify" element={<ModifyItem />} />
                <Route path="items/:id" element={<ItemDetails />} />

                <Route path="packing-plans" element={<PackingPlanOverview />} />
                <Route path="packing-plans/create" element={<CreatePackingPlan />} />
                <Route path="packing-plans/:planId" element={<PackingPlanDetails />} />

                <Route path="import" element={<ImportExportScreen />} />
            </Route>
        </Routes>
    );
};
export default AppRoutes;
