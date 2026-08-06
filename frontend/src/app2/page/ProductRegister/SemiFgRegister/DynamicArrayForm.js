import React, { useEffect } from "react";
import { 
  Form, 
  InputNumber, 
  Input, 
  Select, 
  Button, 
  Space, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Divider 
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DynamicArrayForm = ({
  mode,
  columnDefs,
  initialData,
  optionsMap,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  // Pre-fill form when data arrives (useful for PUT)
  useEffect(() => {
    form.setFieldsValue({
      items: initialData?.length ? initialData : [{}], // Default to 1 empty row
    });
  }, [initialData, form]);

  const handleFinish = (values) => {
    onSubmit(values.items);
  };

  // Helper to render the correct input based on column definition
  const renderInput = (col) => {
    if (col.option) {
      return (
        <Select
          options={optionsMap[col.field] || []}
          placeholder={`Select ${col.headerName}`}
          allowClear
          showSearch
          optionFilterProp="label"
          style={{ width: "100%" }} // Ensure full width within grid column
        />
      );
    }
    if (col.type === "number") {
      return (
        <InputNumber 
          placeholder={`Enter ${col.headerName}`} 
          style={{ width: "100%" }} 
        />
      );
    }
    return <Input placeholder={`Enter ${col.headerName}`} />;
  };

  return (
    <Card 
      title={mode === "create" ? "Create BOM Details (Semi-FG)" : "Update BOM Details (Semi-FG)"}
      className="shadow-sm" // Add your CSS framework's shadow class if you use Tailwind/Bootstrap
      bordered={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card 
                  key={key} 
                  size="small" 
                  style={{ 
                    background: "#fafafa", 
                    borderColor: "#e5e7eb" 
                  }}
                  title={<Text type="secondary">Item #{index + 1}</Text>}
                  extra={
                    fields.length > 1 ? (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      >
                        Remove
                      </Button>
                    ) : null // Prevent removing the very last row if desired
                  }
                >
                  {/* Responsive Grid: 1 col on mobile, 2 on tablets, 4 on desktop */}
                  <Row gutter={[16, 0]}>
                    {columnDefs.map((col) => {
                      if (col.hidden) {
                        return (
                          <Form.Item
                            key={col.field}
                            {...restField}
                            name={[name, col.field]}
                            hidden
                          >
                            <Input />
                          </Form.Item>
                        );
                      }

                      return (
                        <Col xs={24} sm={12} md={8} lg={6} key={col.field}>
                          <Form.Item
                            {...restField}
                            name={[name, col.field]}
                            label={col.headerName.replace(/_/g, ' ').toUpperCase()} // Nicer label formatting
                            rules={[
                              {
                                required: col.required,
                                message: `${col.headerName} is required`,
                              },
                            ]}
                          >
                            {renderInput(col)}
                          </Form.Item>
                        </Col>
                      );
                    })}
                  </Row>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                style={{ padding: "20px 0", borderColor: "#1677ff", color: "#1677ff" }}
              >
                Add Another Item
              </Button>
            </div>
          )}
        </Form.List>

        <Divider />

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space size="middle">
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              {mode === "create" ? "Submit Data" : "Save Changes"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DynamicArrayForm;