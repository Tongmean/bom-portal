import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Card, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const DynamicForm = ({
  groupedFields,
  initialValues = {},
  optionMap = {},
  onSubmit,
  submitText = "Submit",
  loading = false,
  onCancel
}) => {
  const [form] = Form.useForm();

  // Rehydrate form when initialValues change (essential for PUT/Edit)
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  // Helper to render the correct input control based on the schema
  const renderControl = (colDef) => {
    // Shared width style to guarantee inputs fill their column space
    const fullWidth = { width: "100%" };

    if (colDef.option) {
      const options = optionMap[colDef.field] || [];
      return (
        <Select
          placeholder={`Select ${colDef.headerName}`}
          options={options}
          allowClear
          showSearch
          style={fullWidth}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      );
    }
    if (colDef.type === "number") {
      return <InputNumber placeholder={`Enter ${colDef.headerName}`} style={fullWidth} />;
    }
    return <Input placeholder={`Enter ${colDef.headerName}`} style={fullWidth} />;
  };

  // Standard nested form groups (mat_ColumnDefs, header_ColumnDefs)
  const renderStandardGroup = (groupKey, fieldsSchema) => {
    // Separate hidden fields to prevent empty gaps in the Ant Design Grid
    const visibleFields = fieldsSchema.filter((f) => !f.hidden);
    const hiddenFields = fieldsSchema.filter((f) => f.hidden);

    return (
      <Card title={groupKey.replace("_ColumnDefs", "").toUpperCase()} className="mb-4" key={groupKey}>
        {/* Mount hidden fields strictly for Form state retention */}
        {hiddenFields.map((field) => (
          <Form.Item key={field.field} name={[groupKey, field.field]} hidden>
            <Input />
          </Form.Item>
        ))}

        <Row gutter={16}>
          {visibleFields.map((field) => (
            <Col xs={24} sm={12} md={8} key={field.field}>
              <Form.Item
                name={[groupKey, field.field]}
                label={field.headerName}
                rules={[{ required: field.required, message: `${field.headerName} is required` }]}
              >
                {renderControl(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  // Dynamic form lists (detail_ColumnDefs)
  const renderDynamicListGroup = (groupKey, fieldsSchema) => {
    const visibleFields = fieldsSchema.filter((f) => !f.hidden);
    const hiddenFields = fieldsSchema.filter((f) => f.hidden);

    return (
      <Card title="DETAILS (Dynamic)" className="mb-4" key={groupKey}>
        <Form.List name={groupKey}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key}>
                  {/* Hidden fields for dynamic rows */}
                  {hiddenFields.map((schemaField) => (
                    <Form.Item
                      key={schemaField.field}
                      {...restField}
                      name={[name, schemaField.field]}
                      hidden
                    >
                      <Input />
                    </Form.Item>
                  ))}

                  <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
                    {visibleFields.map((schemaField) => (
                      <Col xs={24} sm={10} key={schemaField.field}>
                        <Form.Item
                          {...restField}
                          name={[name, schemaField.field]}
                          label={key === 0 ? schemaField.headerName : ""} // Only label first row
                          rules={[{ required: schemaField.required, message: "Required" }]}
                          style={{ marginBottom: 0 }}
                        >
                          {renderControl(schemaField)}
                        </Form.Item>
                      </Col>
                    ))}
                    <Col>
                      <MinusCircleOutlined
                        style={{
                          color: "red",
                          fontSize: "20px",
                          marginTop: key === 0 ? "30px" : "0", // Align with input when labels are present
                        }}
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Row
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={initialValues}
      autoComplete="off"
    >
      {Object.entries(groupedFields).map(([groupKey, fieldsSchema]) => {
        if (groupKey === "detail_ColumnDefs") {
          return renderDynamicListGroup(groupKey, fieldsSchema);
        }
        return renderStandardGroup(groupKey, fieldsSchema);
      })}

      <Form.Item>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {submitText}
        </Button>
        
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;