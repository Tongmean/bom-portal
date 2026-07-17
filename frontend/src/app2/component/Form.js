// Form.jsx
import React, { useEffect } from "react";
import {
  Form as AntForm,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Space,
  Table,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const Form = ({
  mode = "create",
  tableName = "",
  headerColumn = [],
  detailColumn = [],
  initialHeader = {},
  initialDetails = [],
  optionsMap = {},
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [form] = AntForm.useForm();
    console.log("headerColumn", headerColumn)
  useEffect(() => {
    form.setFieldsValue({
      ...initialHeader,
      details: initialDetails || [],
    });
  }, [form, initialHeader, initialDetails]);

  const getRules = (col) => {
    const label = col.headerName || col.field;
    return col.required
      ? [{ required: true, message: `${label} is required` }]
      : [];
  };
  

  const renderInput = (col) => {
    if (col.option) {
      return (
        <Select
          showSearch
          allowClear
          placeholder={`Select ${col.headerName || col.field}`}
          options={optionsMap?.[col.field] || []}
          optionFilterProp="label"
        />
      );
    }

    if (col.type === "number") {
      return <InputNumber style={{ width: "100%" }} />;
    }

    return <Input />;
  };

  const renderHeaderField = (col) => {
    if (col.hidden) {
      return (
        <AntForm.Item key={col.field} name={col.field} hidden>
          <Input type="hidden" />
        </AntForm.Item>
      );
    }
    // console.log("renderHeaderField col", col)
    return (
      <Col xs={24} md={12} lg={8} key={col.field}>
        <AntForm.Item
          label={col.headerName}
          name={col.field}
          rules={getRules(col)}
        >
          {renderInput(col)}
        </AntForm.Item>
      </Col>
    );
  };

  const buildDetailColumns = (remove) => {
    const visibleColumns = detailColumn.filter((col) => !col.hidden);

    return [
      ...visibleColumns.map((col) => ({
        title: col.headerName,
        dataIndex: col.field,
        key: col.field,
        render: (_, __, index) => (
          <AntForm.Item
            name={[index, col.field]}
            rules={getRules(col)}
            style={{ marginBottom: 0 }}
          >
            {renderInput(col)}
          </AntForm.Item>
        ),
      })),
      {
        title: "Action",
        key: "action",
        width: 100,
        render: (_, __, index) => (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(index)}
          />
        ),
      },
    ];
  };

  const handleFinish = async (values) => {
    const { details = [], ...header } = values;

    const payload = {
      header,
      detail: details,
    };

    await onSubmit?.(payload);
  };

  return (
    <AntForm form={form} layout="vertical" onFinish={handleFinish}>
      <Card title={mode === "edit" ? `Edit ${tableName}` : `Create ${tableName}`}>
        <Row gutter={16}>
          {headerColumn.map((col) => renderHeaderField(col))}
        </Row>
      </Card>

      <Card title="Detail" style={{ marginTop: 16 }}>
        <AntForm.List name="details">
          {(fields, { add, remove }) => {
            const dataSource = fields.map((field) => ({
              key: field.key,
            }));

            return (
              <>
                {fields.map((field) =>
                  detailColumn
                    .filter((col) => col.hidden)
                    .map((col) => (
                      <AntForm.Item
                        key={`${field.key}-${col.field}`}
                        name={[field.name, col.field]}
                        hidden
                      >
                        <Input type="hidden" />
                      </AntForm.Item>
                    ))
                )}

                <Table
                  rowKey="key"
                  pagination={false}
                  dataSource={dataSource}
                  columns={buildDetailColumns(remove)}
                  scroll={{ x: true }}
                />

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => add({})}
                  block
                  style={{ marginTop: 16 }}
                >
                  Add Detail
                </Button>
              </>
            );
          }}
        </AntForm.List>
      </Card>

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {mode === "edit" ? "Update" : "Create"}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Space>
    </AntForm>
  );
};

export default Form;