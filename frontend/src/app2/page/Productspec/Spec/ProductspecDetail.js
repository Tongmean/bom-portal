import React, { useState, useEffect, useMemo } from 'react';
import Tablecomponent from '../../../component/Talecomponent';
import ExcelExportButton from '../../../component/ExcelExportButton';
import { Button, Space, message } from "antd";
// import Productspec from './Productspec';
import { useNavigate } from "react-router-dom";
import { canAction } from '../../../utility/permissionButton'
import FilterForm from '../../../component/FilterForm';
import { useLocation } from "react-router-dom";
import useGridHighlight from "../../../hook/useGridHighlight";
import {
    filterData,
    generateFilterOptions
} from '../../../utility/filterUtility'
const FILTER_FIELDS = [
    {
        name: "productspec_code",
        label: "รหัส productspec"
    },
    {
        name: "sale_code",
        label: "sale_code"
    },
    {
        name: "customer_name",
        label: "customer_name"
    },
    {
        name: "formulation",
        label: "formulation"
    },
   
];
const ProductspecDetail = (props) => {
    const [gridApi, setGridApi] = useState(null);
    const [sellectrow, setSelectedRow] = useState([]);
    const { data, columnDefs } = props;
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    useGridHighlight(gridApi);
    const finalColumnDefs = useMemo(() => {
        
        const cols = [...columnDefs]; // copy ก่อน ไม่แก้ของเดิม
        cols[0] = { ...cols[0], checkboxSelection: true, headerName: "No" };
        cols[1] = { ...cols[1], headerName: "รหัส productspec" };
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
                        disabled = {!canAction()}
                        onClick={()=>{
                            navigate(`/app2/product-spec/product-spec/updateSingle/${params.data.spec_header_id}`);
                        }}
                    >
                        Edit
                    </Button>
                    {/* <Button type="primary" danger size="small">Delete</Button> */}
                </Space>
            ),
        });
        return cols;
    }, []); // [] = คำนวณครั้งเดียวตอน mount
    // console.log("finalColumnDefs", finalColumnDefs)
    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
        setSelectedRow(selectedRows);
    };
    const options = useMemo(() => {
        return generateFilterOptions(
            data || [],
            FILTER_FIELDS.map(
                item => item.name
            )
        );
    }, [data || []]);
    // console.log("data", data)
    const filteredData = useMemo(() => {

        return filterData(
            data || [],
            filters
        );

    }, [data|| [], filters]);

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
                    onClick= {()=> navigate("/app2/product-spec/product-spec/postSingle")}
                    disabled = {!canAction()}
                >
                    เพิ่มรายการ
                    
                </Button>

                <Button type="primary" danger size="small">Delete</Button>
            </Space>
            <ExcelExportButton gridApi={gridApi} columnDefs={finalColumnDefs} selectedCount = {sellectrow.length} Tablename = "sd-packaging"/>
            <Tablecomponent
                columnDefs={finalColumnDefs}
                rowData={filteredData}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
            />
        </div>
    );
};

export default ProductspecDetail;