import React from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Card,
} from "antd";

import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const CustomerUpdateForm = ({
  dataSource,
  setDataSource,
  entityOptions,
}) => {
  const handleChange = (index, field, value) => {
    const newData = [...dataSource];

    newData[index] = {
      ...newData[index],
      [field]: value,
    };

    setDataSource(newData);
  };

  const handleAdd = () => {
    setDataSource([
      ...dataSource,
      {
        customer_id: null,
        entity_id: null,
        nick_name: "",
        zone: "",
        country: "",
        continent: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    const newData = [...dataSource];
    newData.splice(index, 1);
    setDataSource(newData);
  };

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "customer_id",
      width: 120,
      render: (value) => (
        <Input
          value={value}
          disabled
        />
      ),
    },
    {
      title: "Entity",
      dataIndex: "entity_id",
      width: 250,
      render: (value, record, index) => (
        <Select
          style={{ width: "100%" }}
          value={value}
          onChange={(v) =>
            handleChange(index, "entity_id", v)
          }
          options={entityOptions.map((item) => ({
            value: item.entity_id,
            label: `${item.entity_id} - ${item.name}`,
          }))}
        />
      ),
    },
    {
      title: "Nick Name",
      dataIndex: "nick_name",
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) =>
            handleChange(
              index,
              "nick_name",
              e.target.value
            )
          }
        />
      ),
    },
    {
      title: "Zone",
      dataIndex: "zone",
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) =>
            handleChange(
              index,
              "zone",
              e.target.value
            )
          }
        />
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) =>
            handleChange(
              index,
              "country",
              e.target.value
            )
          }
        />
      ),
    },
    {
      title: "Continent",
      dataIndex: "continent",
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) =>
            handleChange(
              index,
              "continent",
              e.target.value
            )
          }
        />
      ),
    },
    {
      title: "Action",
      width: 100,
      render: (_, record, index) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(index)}
        />
      ),
    },
  ];

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Row
        </Button> */}
         <h1>Update Customer</h1>
      </Space>

      <Table
        rowKey={(record, index) =>
          record.customer_id || `new-${index}`
        }
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default CustomerUpdateForm;