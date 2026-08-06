import React, { useState, useEffect, useMemo } from 'react';
import Tablecomponent from '../../../component/Talecomponent';
import ExcelExportButton from '../../../component/ExcelExportButton';
import { Button, Space, message } from "antd";
import {
  createColumnDefs
} 
from "../../../utility/SdpackagingUltility";
import useFetch from "../../../hook/useFetch";
import { baseURL } from "../../../../utility/apiClient";
import FilterForm from '../../../component/FilterForm';
import {
    filterData,
    generateFilterOptions
} from '../../../utility/filterUtility'
// import DeleteModal from './DeleteModal';
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import { canAction } from '../../../utility/permissionButton'
import LoadingSpin from '../../../component/LoadingSpin';
import useFakeLoading from '../../../utility/useFakeLoading';

import { useLocation } from "react-router-dom";
import useGridHighlight from "../../../hook/useGridHighlight";

const FILTER_FIELDS = [
    {
        name: "parent",
        label: "parent"
    },
   
 
];


const SemiFgRegister = () => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [sellectrow, setSelectedRow] = useState([]);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    useGridHighlight(gridApi);

    const { data: data1, loading, error, refetch } = useFetch(
        `${baseURL}/app2/semi-register`
    );
    // console.log("data1", data1);

    const percent = useFakeLoading(loading);
    // const columnDefs = useMemo(() => {
    //     return createColumnDefs(data?.data || []);
    // });
    // Current route
    // const { pathname } = useLocation();
    // console.log("canAction", canAction())
    const {columnDefs, data} = data1 || {};
    // console.log("data", data);
    // console.log("columnDefs", columnDefs);

    const finalColumnDefs = useMemo(() => {
        const cols = [...(columnDefs || [])];
        cols[0] = { ...cols[0], checkboxSelection: true, headerName: "No" };
        return cols;
    }, [columnDefs || []]); // [] = คำนวณครั้งเดียวตอน mount

    const onGridReady = (params) => {
        setGridApi(params.api);
    };
    const options = useMemo(() => {
        return generateFilterOptions(
            data || [],
            FILTER_FIELDS.map(
                item => item.name
            )
        );
    }, [data || []]);

    const filteredData = useMemo(() => {

        return filterData(
            data|| [],
            filters
        );

    }, [data || [], filters]);

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
        setSelectedRow(selectedRows);
    };
    const handleUpdate = () => {
        const ids = sellectrow.map(row => row.bom_detail_id);
        navigate(
            `/app2/product-register/semifg-Register/updateArray?ids=${ids.join(",")}`
        );
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
              <Space>
                <Button
                    size="small"
                    type="primary"
                    style={{ backgroundColor: '#fcb830', borderColor: '#efbb54' }}
                    onClick= {()=> navigate("/app2/product-register/semifg-Register/postArray")}
                    disabled = {!canAction()}
                >
                    เพิ่มรายการ Array
                </Button>
                <Button
                    type="primary"
                    size="small"

                    onClick={handleUpdate}
                    disabled={!sellectrow.length || !canAction()}
                >
                    Update
                </Button>
                {/* <Button
                    type="primary"
                    danger
                    size="small"
                    disabled={sellectrow.length === 0}
                    onClick={() => setDeleteOpen(true)}
                    disabled = {!canAction()}
                    >
                    Delete
                </Button> */}
            </Space>
            <ExcelExportButton gridApi={gridApi} columnDefs={finalColumnDefs} selectedCount = {sellectrow.length} Tablename = "Product-Register"/>
            <Tablecomponent
                columnDefs={finalColumnDefs}
                // rowData={data?.data}
                rowData={filteredData}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
            />
            {/* <DeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                selectedRows={sellectrow}
                onPostSuccess={() => {
                    refetch();          // 🔥 reload data parent
                    setSelectedRow([]); // clear selection
                    gridApi?.deselectAll?.(); // clear grid checkbox
                }}
            /> */}

        </div>
    );
};

export default SemiFgRegister;