// import React, { useState, useEffect, useMemo } from 'react';
// import Tablecomponent from '../../../component/Talecomponent';
// import ExcelExportButton from '../../../component/ExcelExportButton';
// import { Button, Space, message } from "antd";
// import {
//   createColumnDefs
// } 
// from "../../../utility/SdpackagingUltility";
// import useFetch from "../../../hook/useFetch";
// import { baseURL } from "../../../../utility/apiClient";
// import FilterForm from '../../../component/FilterForm';
// import {
//     filterData,
//     generateFilterOptions
// } from '../../../utility/filterUtility'
// // import DeleteModal from './DeleteModal';
// import { useNavigate } from "react-router-dom";
// // import { useLocation } from "react-router-dom";
// import { canAction } from '../../../utility/permissionButton'
// import LoadingSpin from '../../../component/LoadingSpin';
// import useFakeLoading from '../../../utility/useFakeLoading';

// import { useLocation } from "react-router-dom";
// import useGridHighlight from "../../../hook/useGridHighlight";

// const FILTER_FIELDS = [
//     {
//         name: "production_code",
//         label: "production_code"
//     },
   
 
// ];


// const FlatBomDisplay = () => {
//     const [deleteOpen, setDeleteOpen] = useState(false);
//     const [gridApi, setGridApi] = useState(null);
//     const [sellectrow, setSelectedRow] = useState([]);
//     const [filters, setFilters] = useState({});
//     const navigate = useNavigate();
//     const location = useLocation();
//     useGridHighlight(gridApi);

//     const { data: data1, loading, error, refetch } = useFetch(
//         // `${baseURL}/app2/option/displayoption`
//         `${baseURL}/app2/display/flatbom`
//     );
//     console.log("data1", data1);

//     const percent = useFakeLoading(loading);
//     // const columnDefs = useMemo(() => {
//     //     return createColumnDefs(data?.data || []);
//     // });
//     // Current route
//     // const { pathname } = useLocation();
//     // console.log("canAction", canAction())
//     const {columnDefs, data} = data1 || {};
//     // console.log("data", data);
//     // console.log("columnDefs", columnDefs);

//     const finalColumnDefs = useMemo(() => {
//         const cols = [...(columnDefs || [])];
//         cols[0] = { ...cols[0], checkboxSelection: true, headerCheckboxSelection: true,headerName: "production_code" };
//         return cols;
//     }, [columnDefs || []]); // [] = คำนวณครั้งเดียวตอน mount

//     const onGridReady = (params) => {
//         setGridApi(params.api);
//     };
//     const options = useMemo(() => {
//         return generateFilterOptions(
//             data || [],
//             FILTER_FIELDS.map(
//                 item => item.name
//             )
//         );
//     }, [data || []]);

//     const filteredData = useMemo(() => {

//         return filterData(
//             data|| [],
//             filters
//         );

//     }, [data || [], filters]);

//     const onSelectionChanged = () => {
//         const selectedRows = gridApi.getSelectedRows();
//         console.log('Selected rows:', selectedRows);
//         setSelectedRow(selectedRows);
//     };


//     if (loading) {
//         return (
//             <div>
//                 <LoadingSpin
//                     loading={loading}
//                     percent={percent}
//                 />
//             </div>
//         );
//     }

//     if (error) {
//         return <p>Error: {error}</p>;
//     }

//     return (
//         <div>
//             <FilterForm
//                 fields={FILTER_FIELDS}
//                 options={options}
//                 onChange={setFilters}
//             />

//             <ExcelExportButton gridApi={gridApi} columnDefs={finalColumnDefs} selectedCount = {sellectrow.length} Tablename = "Product-Register"/>
//             <Tablecomponent
//                 columnDefs={finalColumnDefs}
//                 // rowData={data?.data}
//                 rowData={filteredData}
//                 onGridReady={onGridReady}
//                 onSelectionChanged={onSelectionChanged}
//             />
          

//         </div>
//     );
// };

// export default FlatBomDisplay;



import React, { useState, useMemo } from 'react';
import Tablecomponent from '../../../component/Talecomponent';
import ExcelExportButton from '../../../component/ExcelExportButton';
import { Button, Space, message, Card } from "antd";
import { createColumnDefs } from "../../../utility/SdpackagingUltility";
import useFetch from "../../../hook/useFetch";
import useMutation from "../../../hook/useMutation"; 
import { baseURL } from "../../../../utility/apiClient";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpin from '../../../component/LoadingSpin';
import useFakeLoading from '../../../utility/useFakeLoading';
import useGridHighlight from "../../../hook/useGridHighlight";

import GenericFilterDropdowns from '../GenericFilterDropdowns';

// 1. Added sale_code to the filter fields so it appears as a dropdown
const FILTER_FIELDS = [
    { name: "production_type", label: "production_type" },
    { name: "customer_name", label: "customer_name" },
    { name: "status", label: "status" },
    { name: "part_no", label: "part_no" },
    { name: "formulation", label: "formulation" },
    { name: "status_check", label: "status_check" },
    { name: "sale_code", label: "Sale Code" },
    { name: "fg_erp", label: "FG ERP" },
    // { name: "production_code", label: "Production Code" }
];

const FlatBomDisplay = () => {
    const [gridApi, setGridApi] = useState(null);
    const [sellectrow, setSelectedRow] = useState([]);
    
    // Fetch Option Filters from API on mount
    const { data: optionData, loading: optionsLoading, error: optionsError } = useFetch(
        `${baseURL}/app2/option/displayoption`
    );

    const { mutate, loading: isTableFetching } = useMutation();

    const [filters, setFilters] = useState({});
    const [tableData, setTableData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    
    const percent = useFakeLoading(optionsLoading || isTableFetching);
    useGridHighlight(gridApi);

    const rawOptionsData = optionData?.data || optionData || [];

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        setSelectedRow(selectedRows);
    };

    const handleFilterChange = (fieldName, values) => {
        setFilters((prev) => ({
            ...prev,
            [fieldName]: values
        }));
    };

    // 2. Handle Payload Creation dynamically based on ANY selected filter
    const handleApplyFilter = async () => {
        // A. Filter the raw data using all currently selected dropdowns (e.g., sale_code = 'N')
        const matchedRecords = rawOptionsData.filter((row) => {
            return FILTER_FIELDS.every((field) => {
                const selectedValues = filters[field.name];
                // If the dropdown is empty/cleared, don't filter by this field
                if (!selectedValues || selectedValues.length === 0) return true; 
                return selectedValues.includes(row[field.name]);
            });
        });

        // B. Loop through the matched records to extract unique ERPs and Production Codes
        const uniqueErps = [...new Set(matchedRecords.map(row => row.fg_erp))].filter(Boolean);
        const uniqueProds = [...new Set(matchedRecords.map(row => row.production_code))].filter(Boolean);

        // Prevent fetching if absolutely no data matches the selected filters
        if (uniqueErps.length === 0 && uniqueProds.length === 0) {
            return message.warning("No matching ERP or Production codes found for this filter selection.");
        }

        // C. Build exact payload mapping
        const payload = {
            erp: uniqueErps.map(val => ({ fg_erp: val })),
            production: uniqueProds.map(val => ({ production_code: val }))
        };

        console.log("Sending Payload to API:", payload);

        // D. Trigger mutation
        const result = await mutate({
            method: 'post',
            url: `${baseURL}/app2/display/flatbom`,
            data: payload
        });

        // E. Handle Response
        if (result.success) {
            const fetchedCols = result.data?.columnDefs || [];
            const fetchedRows = result.data?.data || [];

            if (fetchedCols.length > 0) {
                fetchedCols[0] = { 
                    ...fetchedCols[0], 
                    checkboxSelection: true, 
                    headerCheckboxSelection: true,
                    headerName: fetchedCols[0].headerName || "production_code" 
                };
            }

            setColumnDefs(fetchedCols);
            setTableData(fetchedRows);

            if (fetchedRows.length > 0) {
                message.success(`Found ${fetchedRows.length} records`);
            } else {
                message.warning('No data found for these filters');
            }
        } else {
            message.error(`Failed to fetch table data: ${result.error}`);
        }
    };

    if (optionsLoading) {
        return <LoadingSpin loading={optionsLoading} percent={percent} />;
    }

    if (optionsError) {
        return <p>Error loading filters: {optionsError}</p>;
    }

    return (
        <div>
            <Card style={{ marginBottom: 16 }}>
                <GenericFilterDropdowns
                    data={rawOptionsData}
                    fields={FILTER_FIELDS}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <Space style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
                    <Button 
                        onClick={() => setFilters({})} 
                        disabled={isTableFetching}
                    >
                        Clear
                    </Button>
                    <Button 
                        type="primary" 
                        onClick={handleApplyFilter} 
                        loading={isTableFetching}
                    >
                        Search
                    </Button>
                </Space>
            </Card>

            <ExcelExportButton 
                gridApi={gridApi} 
                columnDefs={columnDefs} 
                selectedCount={sellectrow.length} 
                Tablename="Product-Register"
            />
            
            <Tablecomponent
                columnDefs={columnDefs}
                rowData={tableData}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
            />
        </div>
    );
};

export default FlatBomDisplay;