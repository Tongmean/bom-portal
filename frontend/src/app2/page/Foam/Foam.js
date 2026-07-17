import React, { useState, useEffect, useMemo } from 'react';
import Tablecomponent from '../../component/Talecomponent';
import ExcelExportButton from '../../component/ExcelExportButton';
import { Button, Space, message } from "antd";
import useFetch from "../../hook/useFetch";
import { baseURL } from "../../../utility/apiClient";
import FilterForm from '../../component/FilterForm';
import {
    filterData,
    generateFilterOptions
} from '../../utility/filterUtility'
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import { canAction } from '../../utility/permissionButton'
import LoadingSpin from '../../component/LoadingSpin';
import useFakeLoading from '../../utility/useFakeLoading';

import { useLocation } from "react-router-dom";
import useGridHighlight from "../../hook/useGridHighlight";
import {
    pivoProductspecData,
    createColumnDefs,
  } from "../../utility/productspecPivet";
const FILTER_FIELDS = [
    {
        name: "part_no",
        label: "No"
    },
    
 
];


const Foam = () => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [sellectrow, setSelectedRow] = useState([]);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    useGridHighlight(gridApi);

    const { data, loading, error, refetch } = useFetch(
        `${baseURL}/app2/Foam`
    );
    const percent = useFakeLoading(loading);
        
    const pivotResult = useMemo(() => {
        return pivoProductspecData(data?.data || [],  [
          "foam_header_id",
          "part_no",
          "remark"
        
        ]
      );
      }, [data]);
      // console.log("pivotResult", pivotResult)
      /**
       * Dynamic Columns
       */
      const columnDefs = useMemo(() => {
        return createColumnDefs(pivotResult);
      }, [pivotResult]);
    // Current route
    // const { pathname } = useLocation();
    // console.log("canAction", canAction())

    const finalColumnDefs = useMemo(() => {
        const cols = [...columnDefs]; // copy ก่อน ไม่แก้ของเดิม
        cols[0] = { ...cols[0], checkboxSelection: true, headerName: "No" };
        // cols[1] = { ...cols[1], headerName: "รูปแบบบรรจุ" };
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
                        onClick={()=>{
                            navigate(`/app2/additionalFoam/putSingle/${params.data.foam_header_id}`);
                        }}
                    >
                        Edit
                    </Button>
                    {/* <Button type="primary" danger size="small">Delete</Button> */}
                </Space>
            ),
        });
        return cols;
    }, [columnDefs]); // [] = คำนวณครั้งเดียวตอน mount
    console.log("finalColumnDefs", finalColumnDefs)
    console.log("pivotResult", pivotResult)
    const onGridReady = (params) => {
        setGridApi(params.api);
    };
    const options = useMemo(() => {
        return generateFilterOptions(
            pivotResult || [],
            FILTER_FIELDS.map(
                item => item.name
            )
        );
    }, [data?.data || []]);

    const filteredData = useMemo(() => {

        return filterData(
            pivotResult || [],
            filters
        );

    }, [data?.data || [], filters]);

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
        setSelectedRow(selectedRows);
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
                    onClick= {()=> navigate("/app2/additionalFaom/postSingle")}
                    disabled = {!canAction()}
                >
                    เพิ่มรายการ
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
           

        </div>
    );
};

export default Foam;