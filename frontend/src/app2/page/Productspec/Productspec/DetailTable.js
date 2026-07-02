import React from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
} from "antd";

const DetailTable = ({
  columns,
  rows,
  setRows,
  dropdownConfig,
}) => {
  const hiddenFields = [
    "productspec_detail_id",
    "productspec_header_id",
  ];

  const handleChange = (
    rowIndex,
    field,
    value
  ) => {
    const copy = [...rows];

    copy[rowIndex][field] = value;

    setRows(copy);
  };

  const addRow = () => {
    const row = {};

    columns.forEach((col) => {
      row[col.field] = null;
    });

    setRows((prev) => [
      ...prev,
      row,
    ]);
  };

  const deleteRow = (index) => {
    setRows((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const tableColumns = columns
    .filter(
      (c) =>
        !hiddenFields.includes(c.field)
    )
    .map((col) => ({
      title: col.headerName,

      dataIndex: col.field,

      render: (_, record, index) => {
        const dropdown =
          dropdownConfig[col.field];

        if (dropdown) {
          return (
            <Select
              style={{
                width: "100%",
              }}
              value={
                record[col.field]
              }
              onChange={(value) =>
                handleChange(
                  index,
                  col.field,
                  value
                )
              }
            >
              {dropdown.options.map(
                (option) => (
                  <Select.Option
                    key={
                      option[
                        dropdown.value
                      ]
                    }
                    value={
                      option[
                        dropdown.value
                      ]
                    }
                  >
                    {
                      option[
                        dropdown.label
                      ]
                    }
                  </Select.Option>
                )
              )}
            </Select>
          );
        }

        return (
          <Input
            value={
              record[col.field]
            }
            onChange={(e) =>
              handleChange(
                index,
                col.field,
                e.target.value
              )
            }
          />
        );
      },
    }));

  tableColumns.push({
    title: "Action",

    render: (_, record, index) => (
      <Button
        danger
        onClick={() =>
          deleteRow(index)
        }
      >
        Delete
      </Button>
    ),
  });

  return (
    <>
      <Space
        style={{
          marginBottom: 10,
        }}
      >
        <Button
          type="primary"
          onClick={addRow}
        >
          Add Row
        </Button>
      </Space>

      <Table
        rowKey={(_, index) => index}
        columns={tableColumns}
        dataSource={rows}
        pagination={false}
      />
    </>
  );
};

export default DetailTable;