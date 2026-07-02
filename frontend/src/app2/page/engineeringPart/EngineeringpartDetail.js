import React, { useState, useEffect, useMemo } from 'react';
import Tablecomponent from '../../component/Talecomponent';
import ExcelExportButton from '../../component/ExcelExportButton';
import { Button, Space, message } from "antd";
import FilterForm from '../../component/FilterForm';
import {
    filterData,
    generateFilterOptions
} from '../../utility/filterUtility'

const FILTER_FIELDS = [
    {
        name: "drawing_header_id",
        label: "No"
    },
    {
        name: "compact_no",
        label: "Compact No"
    },
    {
        name: "part_no",
        label: "Part No"
    },
    {
        name: "drawing_no",
        label: "Drawing No"
    },
    {
        name: "status",
        label: "Status"
    },
    {
        name: "revision",
        label: "Revision"
    }
];

const EngineeringpartDetail = (props) => {
    const [gridApi, setGridApi] = useState(null);
    const [sellectrow, setSelectedRow] = useState([]);
    const { data, columnDefs } = props;
    const [filters, setFilters] = useState({});

    const finalColumnDefs = useMemo(() => {
        const cols = [...columnDefs]; // copy ก่อน ไม่แก้ของเดิม
        cols[0] = { ...cols[0], checkboxSelection: true, headerName: "No" };
        // cols[1] = { ...cols[1], headerName: "Com" };
        cols.push({
            headerName: 'Actions',
            field: 'actions',
            pinned: 'right',
            cellRenderer: () => (
                <Space>
                    <Button size="small" type="primary">D : -</Button>
                    <Button
                        size="small"
                        type="primary"
                        style={{ backgroundColor: '#fcb830', borderColor: '#efbb54' }}
                    >
                        Edit
                    </Button>
                    {/* <Button type="primary" danger size="small">Delete</Button> */}
                </Space>
            ),
        });
        return cols;
    }, []); // [] = คำนวณครั้งเดียวตอน mount


    const options = useMemo(() => {
        return generateFilterOptions(
            data,
            FILTER_FIELDS.map(
                item => item.name
            )
        );
    }, [data]);

    const filteredData = useMemo(() => {

        return filterData(
            data,
            filters
        );

    }, [data, filters]);

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
        setSelectedRow(selectedRows);
    };

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
                >
                    เพิ่มรายการ
                </Button>
                <Button type="primary" danger size="small">Delete</Button>
            </Space>
            <ExcelExportButton gridApi={gridApi} columnDefs={finalColumnDefs} selectedCount = {sellectrow.length} Tablename = "Product-Register"/>
            <Tablecomponent
                columnDefs={finalColumnDefs}
                // rowData={data}
                rowData={filteredData}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
            />
        </div>
    );
};

export default EngineeringpartDetail;