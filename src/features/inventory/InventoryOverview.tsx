import { NavLink } from 'react-router';
import { inventoryApi } from '../../app/legacy.api';
import { useHasScope } from '../auth/utils';
import { WindowTitle } from '../../utils/title/WindowTitle';
import { DataTable, Column } from '../../utils/table/Table';
import { useHistoryTableState } from '../../utils/table/utils';

const InventoryOverview = () => {
    const data = inventoryApi.useInventoryItems();
    const isEditor = useHasScope('editor');

    const [tableState, setTableState] = useHistoryTableState();

    return (
        <>
            <WindowTitle>Fahrzeuge</WindowTitle>
            {isEditor && (
                <NavLink className="btn btn-primary" to="/halls/new">
                    Neues Fahrzeug anlegen
                </NavLink>
            )}

            <DataTable data={data} tableState={tableState} setTableState={setTableState}>
                <Column title="Id" id="id" sort />
                <Column title="Sachnummer" id="externalname" />
                <Column title="Ebene" id="floor" />
                <Column title="Zielmenge" id="amountTarget" />
                <Column title="Istmenge" id="amountActual" />
                <Column title="Verfügbar" id="isAvailable" />
                <Column title="Ort" id="position" />
                <Column title="Inventar Id" id="inventoryId" />
                <Column title="Geräte Id" id="deviceId" />
                <Column title="Zusammensetzungsart" id="compoundType" />
                <Column title="Organisationseinheit Id" id="organisationalUnitId" />
                <Column title="Gegenstandsdefinition Id" id="itemDefinitionId" />
            </DataTable>
        </>
    );
};
export default InventoryOverview;
