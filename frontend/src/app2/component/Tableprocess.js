import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Tablecomponentprocess = ({
    columnDefs,
    rowData,
    rowSelection = 'multiple',
    defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        editable: true,
        flex: 1,
        // minWidth: 100,
        // filter: 'agSetColumnFilter',
    },
    onGridReady,
    onSelectionChanged,
    getRowHeight,
    getRowClass,
    getRowId,
    ...restProps
}) => {
    return (
        <div
            className="ag-theme-alpine"
            style={{ height: 'calc(40vh - 100px)', width: '100%' }}
        >
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                rowSelection={rowSelection}
                defaultColDef={defaultColDef}
                onSelectionChanged={onSelectionChanged}
                onGridReady={onGridReady}
                getRowHeight={getRowHeight}
                getRowClass={getRowClass}
                getRowId={getRowId}
                {...restProps}
            />
        </div>
    );
};

export default Tablecomponentprocess;