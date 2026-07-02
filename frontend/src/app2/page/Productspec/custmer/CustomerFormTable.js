import React from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Card
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const CustomerFormTable = ({
  dataSource,
  setDataSource,
  entityOptions,
  columns
}) => {

  const handleChange = (index, field, value) => {
    const newData = [...dataSource];

    newData[index] = {
      ...newData[index],
      [field]: value
    };

    setDataSource(newData);
  };

  const handleAddRow = () => {
    const emptyRow = {};

    columns.forEach(col => {
      emptyRow[col.field] = "";
    });

    setDataSource(prev => [...prev, emptyRow]);
  };

  const handleDeleteRow = (index) => {
    const newData = [...dataSource];
    newData.splice(index, 1);
    setDataSource(newData);
  };

  // const tableColumns = columns.map(col => ({
  //   title: col.headerName,
  //   dataIndex: col.field,
  //   key: col.field,
  //    // กำหนด width เฉพาะ entity_id
  //   width: col.field === "entity_id" ? 250 : undefined,
  //   render: (_, record, index) => {

  //     if (col.field === "entity_id") {
  //       return (
  //         <Select
  //           style={{ width: "100%" }}
  //           value={record.entity_id}
  //           placeholder="Select Entity"
  //           onChange={(value) =>
  //             handleChange(index, "entity_id", value)
  //           }
  //           options={entityOptions}
  //         />
  //       );
  //     }

  //     return (
  //       <Input
  //         value={record[col.field]}
  //         onChange={(e) =>
  //           handleChange(
  //             index,
  //             col.field,
  //             e.target.value
  //           )
  //         }
  //       />
  //     );
  //   }
  // }));

  const tableColumns = columns.map(col => ({
  title: col.headerName,
  dataIndex: col.field,
  key: col.field,

  // กำหนด width เฉพาะ entity_id
  width: col.field === "entity_id" ? 250 : undefined,

  render: (_, record, index) => {
    if (col.field === "entity_id") {
      return (
        <Select
          style={{ width: "100%" }}
          value={record.entity_id}
          placeholder="Select Entity"
          onChange={(value) =>
            handleChange(index, "entity_id", value)
          }
          options={entityOptions}
        />
      );
    }

    return (
      <Input
        value={record[col.field]}
        onChange={(e) =>
          handleChange(
            index,
            col.field,
            e.target.value
          )
        }
      />
    );
  }
}));
  tableColumns.push({
    title: "Action",
    width: 100,
    render: (_, record, index) => (
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleDeleteRow(index)}
      />
    )
  });

  return (
    <Card
      title="Customer Entry"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRow}
        >
          Add Row
        </Button>
      }
    >
      <Table
        bordered
        pagination={false}
        rowKey={(_, index) => index}
        columns={tableColumns}
        dataSource={dataSource}
      />
    </Card>
  );
};

export default CustomerFormTable;