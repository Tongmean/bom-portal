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
import DeleteModal from './DeleteModal';
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import { canAction } from '../../../utility/permissionButton'
import LoadingSpin from '../../../component/LoadingSpin';
import useFakeLoading from '../../../utility/useFakeLoading';

import { useLocation } from "react-router-dom";
import useGridHighlight from "../../../hook/useGridHighlight";

const FILTER_FIELDS = [
    {
        name: "customer_id",
        label: "No"
    },
    {
        name: "nick_name",
        label: "nick_name"
    },
    {
        name: "zone",
        label: "zone"
    },
    {
        name: "country",
        label: "country"
    },
 
];


const Customer = () => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [sellectrow, setSelectedRow] = useState([]);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    useGridHighlight(gridApi);

    const { data, loading, error, refetch } = useFetch(
        `${baseURL}/app2/customer`
    );
    const percent = useFakeLoading(loading);
    const columnDefs = useMemo(() => {
        return createColumnDefs(data?.data || []);
    });
    // Current route
    // const { pathname } = useLocation();
    // console.log("canAction", canAction())

    const finalColumnDefs = useMemo(() => {
        const cols = [...columnDefs]; // copy ก่อน ไม่แก้ของเดิม
        cols[0] = { ...cols[0], checkboxSelection: true, headerName: "No" };
        // cols[1] = { ...cols[1], headerName: "รูปแบบบรรจุ" };
        // cols.push({
        //     headerName: 'Actions',
        //     field: 'actions',
        //     pinned: 'right',
        //     cellRenderer: () => (
        //         <Space>
        //             <Button size="small" type="primary">D : -</Button>
        //             <Button
        //                 size="small"
        //                 type="primary"
        //                 style={{ backgroundColor: '#fcb830', borderColor: '#efbb54' }}
        //             >
        //                 Edit
        //             </Button>
        //             {/* <Button type="primary" danger size="small">Delete</Button> */}
        //         </Space>
        //     ),
        // });
        return cols;
    }, [columnDefs]); // [] = คำนวณครั้งเดียวตอน mount

    const onGridReady = (params) => {
        setGridApi(params.api);
    };
    const options = useMemo(() => {
        return generateFilterOptions(
            data?.data || [],
            FILTER_FIELDS.map(
                item => item.name
            )
        );
    }, [data?.data || []]);

    const filteredData = useMemo(() => {

        return filterData(
            data?.data || [],
            filters
        );

    }, [data?.data || [], filters]);

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
        setSelectedRow(selectedRows);
    };
    const handleUpdate = () => {
        const ids = sellectrow.map(row => row.customer_id);
        navigate(
            `/app2/product-spec/Customer/updateArray?ids=${ids.join(",")}`
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
                    onClick= {()=> navigate("/app2/product-spec/Customer/postArray")}
                    disabled = {!canAction()}
                >
                    เพิ่มรายการ Array
                </Button>
                <Button
                    type="primary"
                    size="small"

                    onClick={handleUpdate}
                    disabled={!sellectrow.length}
                    disabled = {!canAction()}
                >
                    Update
                </Button>
                <Button
                    type="primary"
                    danger
                    size="small"
                    disabled={sellectrow.length === 0}
                    onClick={() => setDeleteOpen(true)}
                    disabled = {!canAction()}
                    >
                    Delete
                </Button>
            </Space>
            <ExcelExportButton gridApi={gridApi} columnDefs={finalColumnDefs} selectedCount = {sellectrow.length} Tablename = "Product-Register"/>
            <Tablecomponent
                columnDefs={finalColumnDefs}
                // rowData={data?.data}
                rowData={filteredData}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
            />
            <DeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                selectedRows={sellectrow}
                onPostSuccess={() => {
                    refetch();          // 🔥 reload data parent
                    setSelectedRow([]); // clear selection
                    gridApi?.deselectAll?.(); // clear grid checkbox
                }}
            />

        </div>
    );
};

export default Customer;