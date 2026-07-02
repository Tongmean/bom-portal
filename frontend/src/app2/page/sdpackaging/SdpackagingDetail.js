import React, { useState, useMemo } from 'react';
import Tablecomponent from '../../component/Talecomponent';
import ExcelExportButton from '../../component/ExcelExportButton';
import { Button, Space } from "antd";

const SdpackagingDetail = (props) => {
    const [gridApi, setGridApi] = useState(null);
    const [sellectrow, setSelectedRow] = useState([]);
    const { data, columnDefs } = props;

    const finalColumnDefs = useMemo(() => {
        const cols = [...columnDefs]; // copy ก่อน ไม่แก้ของเดิม
        cols[0] = { ...cols[0], checkboxSelection: true, headerName: "No" };
        cols[1] = { ...cols[1], headerName: "รูปแบบบรรจุ" };
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
            <ExcelExportButton gridApi={gridApi} columnDefs={finalColumnDefs} selectedCount = {sellectrow.length} Tablename = "sd-packaging"/>
            <Tablecomponent
                columnDefs={finalColumnDefs}
                rowData={data}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
            />
        </div>
    );
};

export default SdpackagingDetail;