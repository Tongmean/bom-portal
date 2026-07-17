import React, { useState, useMemo } from 'react';
import Tablecomponent from '../../../component/Talecomponent'; // Note: check if Talecomponent is a typo in your file system
import ExcelExportButton from '../../../component/ExcelExportButton';
import { Button, Space } from "antd";
import useFetch from "../../../hook/useFetch";
import { baseURL } from "../../../../utility/apiClient";
import FilterForm from '../../../component/FilterForm';
import { filterData, generateFilterOptions } from '../../../utility/filterUtility';
import { useNavigate, useLocation } from "react-router-dom";
import { canAction } from '../../../utility/permissionButton';
import LoadingSpin from '../../../component/LoadingSpin';
import useFakeLoading from '../../../utility/useFakeLoading';
import useGridHighlight from "../../../hook/useGridHighlight";

// MATCHED WITH JSON: Changed 'part_no' to 'compact_no'
const FILTER_FIELDS = [
    {
        name: "erp", 
        label: "erp"
    },
    {
        name: "component", 
        label: "component"
    },
   
];

const ProcessOrder = () => {
    const [gridApi, setGridApi] = useState(null);
    const [sellectrow, setSelectedRow] = useState([]);
    const [filters, setFilters] = useState({});
    
    const navigate = useNavigate();
    const location = useLocation();
    useGridHighlight(gridApi);

    const { data, loading, error } = useFetch(
        // `${baseURL}/app2/certificate`
        `${baseURL}/app2/process`,
        
    );
    console.log("data", data)
    const percent = useFakeLoading(loading);

    const finalColumnDefs = useMemo(() => {
        if (!data?.columnDefs) return [];

        const cols = [...data.columnDefs]; 
        
        // Add checkbox to the first column
        cols[0] = { ...cols[0], checkboxSelection: true,  headerCheckboxSelection: true, headerName: "No" };
        
        cols.push({
            headerName: 'Actions',
            field: 'actions',
            pinned: 'right',
            cellRenderer: (params) => (
                <Space>
                    <Button size="small" type="primary">D : -</Button>
                    <Button
                        size="small"
                        type="primary"
                        style={{ backgroundColor: '#fcb830', borderColor: '#efbb54' }}
                        onClick={() => {
                            // MATCHED WITH JSON: Changed foam_header_id to certificate_id
                            navigate(`/app2/certificate/putSingle/${params.data.certificate_id}`);
                        }}
                    >
                        Edit
                    </Button>
                </Space>
            ),
        });
        return cols;
    }, [data, navigate]); 

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const options = useMemo(() => {
        return generateFilterOptions(
            data?.data || [],
            FILTER_FIELDS.map(item => item.name)
        );
    }, [data]);

    const filteredData = useMemo(() => {
        return filterData(
            data?.data || [],
            filters
        );
    }, [data, filters]);

    const onSelectionChanged = () => {
        if (gridApi) {
            const selectedRows = gridApi.getSelectedRows();
            setSelectedRow(selectedRows);
        }
    };

    if (loading) {
        return (
            <div>
                <LoadingSpin
                    loading={loading}
                    percent={percent}
                />
            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <FilterForm
                fields={FILTER_FIELDS}
                options={options}
                onChange={setFilters}
            />
            <Space style={{ marginBottom: 16, marginTop: 16 }}>
                <Button
                    size="small"
                    type="primary"
                    style={{ backgroundColor: '#fcb830', borderColor: '#efbb54' }}
                    // FIXED TYPO: updated routing path 
                    onClick={() => navigate("/app2/process/routing-order/postSingle")}
                    disabled={!canAction()}
                >
                    เพิ่มรายการ
                </Button>
            </Space>
            
            <ExcelExportButton 
                gridApi={gridApi} 
                columnDefs={finalColumnDefs} 
                selectedCount={sellectrow.length} 
                Tablename="ProcessOrder-Register" 
            />

            <Tablecomponent
                columnDefs={finalColumnDefs}
                rowData={filteredData}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
            />
        </div>
    );
};

export default ProcessOrder;