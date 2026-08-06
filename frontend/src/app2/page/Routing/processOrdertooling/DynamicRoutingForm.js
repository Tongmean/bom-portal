import React, { useEffect } from "react";
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  Card, 
  Row, 
  Col, 
  Tooltip, 
  Empty, 
  Typography 
} from "antd";
import { 
  PlusOutlined, 
  DeleteOutlined, 
  SaveOutlined, 
  CloseOutlined 
} from "@ant-design/icons";

const { Text } = Typography;

const DynamicRoutingForm = ({
  mode,
  headerColumn = [],
  detailBomColumn = [],
  detailMachineColumn = [],
  initialData,
  optionsMap,
  loading,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm();

  // Populate form and ensure data matches the { header, detail_bom, detail_machine } structure
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // If your backend returns flat data, we wrap the header fields into a 'header' object
      // If it already returns { header: {...} }, we just use it directly.
      const formattedData = initialData.header ? initialData : {
        header: {
          process_routing_tooling_id: initialData.process_routing_tooling_id,
          process_routing_order_id: initialData.process_routing_order_id,
          tooling_id: initialData.tooling_id,
          value: initialData.value
        },
        detail_bom: initialData.detail_bom || [],
        detail_machine: initialData.detail_machine || []
      };
      
      form.setFieldsValue(formattedData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const renderField = (fieldConfig, fieldProps = {}) => {
    const { headerName, field, hidden, required, option, text } = fieldConfig;

    // 1. Hidden Fields
    if (hidden) {
      return (
        <Form.Item key={field} name={fieldProps.name || field} hidden {...fieldProps}>
          <Input />
        </Form.Item>
      );
    }

    // 2. Visible Fields Input Types
    let InputElement = <Input placeholder={`Enter ${headerName}`} style={{ width: '100%' }} />;
    
    if (option) {
      const options = optionsMap?.[field] || [];
      InputElement = (
        <Select 
          placeholder={`Select ${headerName}`} 
          options={options}
          showSearch
          optionFilterProp="label"
          style={{ width: '100%' }}
        />
      );
    } else if (text === "number") {
      InputElement = (
        <InputNumber 
          style={{ width: "100%" }} 
          placeholder={`Enter ${headerName}`} 
        />
      );
    }

    // 3. Visible Form.Item
    return (
      <Form.Item
        key={field}
        name={fieldProps.name || field} 
        {...fieldProps}
        label={!fieldProps.noStyle ? <Text strong>{headerName}</Text> : ""}
        rules={[{ required: required, message: `${headerName} is required!` }]}
        style={{ marginBottom: fieldProps.noStyle ? 0 : 24 }}
      >
        {InputElement}
      </Form.Item>
    );
  };

  const RenderDynamicList = ({ name, columns, title }) => {
    const visibleColumns = columns.filter(col => !col.hidden);
    const colSpan = Math.floor(22 / (visibleColumns.length || 1)); 

    return (
      <Card 
        title={title} 
        size="small" 
        style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        headStyle={{ backgroundColor: '#fafafa' }}
      >
        <Form.List name={name}>
          {(fields, { add, remove }) => (
            <>
              {fields.length > 0 && (
                <Row gutter={16} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                  {visibleColumns.map((col) => (
                    <Col span={colSpan} key={col.field}>
                      <Text type="secondary" strong>{col.headerName}</Text>
                      {col.required && <Text type="danger"> *</Text>}
                    </Col>
                  ))}
                  <Col span={2} style={{ textAlign: 'center' }}>
                    <Text type="secondary" strong>Action</Text>
                  </Col>
                </Row>
              )}

              {fields.length === 0 && (
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description={`No ${title} added yet.`} 
                />
              )}

              {fields.map(({ key, name: fieldName, ...restField }) => (
                <Row gutter={16} key={key} style={{ marginBottom: 12 }} align="middle">
                  {columns.map((schemaField) => {
                    if (schemaField.hidden) {
                      return renderField(schemaField, { ...restField, name: [fieldName, schemaField.field] });
                    }
                    
                    return (
                      <Col span={colSpan} key={schemaField.field}>
                        {renderField(schemaField, {
                          ...restField,
                          name: [fieldName, schemaField.field],
                          noStyle: true
                        })}
                      </Col>
                    );
                  })}
                  
                  <Col span={2} style={{ textAlign: 'center' }}>
                    <Tooltip title="Remove row">
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(fieldName)}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              ))}

              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
                style={{ marginTop: 16 }}
              >
                Add {title} Row
              </Button>
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
      initialValues={{ header: {}, detail_bom: [], detail_machine: [] }} // Set initial nested structure
      style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      <Card 
        title={`${mode === 'create' ? 'Create' : 'Edit'} Routing Tooling`} 
        style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        headStyle={{ backgroundColor: '#fafafa', borderBottom: '2px solid #1890ff' }}
      >
        <Row gutter={16}>
          {headerColumn.map((field) => (
            field.hidden ? (
              // Passing ['header', field.field] nests this value into the header object
              renderField(field, { name: ['header', field.field] }) 
            ) : (
              <Col xs={24} sm={12} md={8} key={field.field}>
                {renderField(field, { name: ['header', field.field] })}
              </Col>
            )
          ))}
        </Row>
      </Card>

      <RenderDynamicList 
        name="detail_bom" 
        columns={detailBomColumn} 
        title="BOM Details" 
      />

      <RenderDynamicList 
        name="detail_machine" 
        columns={detailMachineColumn} 
        title="Machine Details" 
      />

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        gap: '12px',
        padding: '16px 24px', 
        background: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        <Button 
          onClick={onCancel} 
          disabled={loading}
          icon={<CloseOutlined />}
          size="large"
        >
          Cancel
        </Button>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          icon={<SaveOutlined />}
          size="large"
        >
          {mode === "create" ? "Save Record" : "Update Record"}
        </Button>
      </div>
    </Form>
  );
};

export default DynamicRoutingForm;