
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { message, Button } from 'antd';

const ExcelExportButton = ({ gridApi, columnDefs = [], tableName, selectedCount = 0 }) => {
  const exportToCSV = () => {
    try {
      if (!gridApi) throw new Error('Grid API is not available.');

      const selectedRows = gridApi.getSelectedRows();

      if (selectedRows.length === 0) {
        message.warning('แจ้งเตือน: ยังไม่มีการเลือกแถว เพื่อนำออกครับ');
        return;
      }

      const excludeFields = ['actions'];

      const headers = columnDefs
        .filter(col => col.field && !excludeFields.includes(col.field))
        .map(col => ({
          field: col.field,
          headerName: col.headerName ?? col.field,
        }));

      const mappedData = selectedRows.map(row =>
        headers.reduce((acc, { field, headerName }) => {
          acc[headerName] = row[field] ?? '';
          return acc;
        }, {})
      );

      const headerNames = headers.map(h => h.headerName);

      const worksheet = XLSX.utils.json_to_sheet(mappedData, {
        header: headerNames,
      });

      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `${currentDate}_Selected_${tableName}.csv`;

      const utf8Bom = '\uFEFF';
      const blob = new Blob([utf8Bom + csvOutput], {
        type: 'text/csv;charset=utf-8;',
      });

      saveAs(blob, fileName);
      message.success('Export CSV สำเร็จ!');
    } catch (error) {
      console.error('Export Error:', error);
      message.error('เกิดข้อผิดพลาดในการส่งออก CSV');
    }
  };

  return (
    <Button
      type="primary"
      size="small"
      onClick={exportToCSV}
      style={{ marginLeft: 10, marginBottom: 10 }}
    >
      {`CSV (${selectedCount})`}
    </Button>
  );
};

export default ExcelExportButton;