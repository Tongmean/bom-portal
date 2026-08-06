import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Space, Row, Col, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function DynamicForm({
  headerColumn = [],
  detailColumn = [],
  itemColumn = [],
  headerSpecComponent = [],
  headerSpecComponentOption = [],
  optionsMap = {},
  initialValues = {},
  onSubmit,
  onBack,
  mode
}) {
  const [form] = Form.useForm();

  // Populate form with initial data (perfect for your PUT requests)
  useEffect(() => {
    form.resetFields();
    if (Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form, mode]);

  const getOptionsForField = (fieldName) => {
    if (!optionsMap) return [];
    switch (fieldName) {
      case 'customer_id': return optionsMap.customer_id;
      case 'chanel_option_id': return optionsMap.channel;
      case 'document_status_option_id': return optionsMap.document_status;
      case 'status_check_id': return optionsMap.check_status;
      case 'header_component': return optionsMap.component_header;
      case 'mat_id': return optionsMap.mat_id;
      default: return [];
    }
  };

  const renderField = (col, isList = false, restField = {}, namePrefix = []) => {
    // If the column is dynamically marked as hidden
    if (col.hidden) {
      return (
        <Form.Item key={col.field} name={[...namePrefix, col.field]} hidden {...restField}>
          <Input />
        </Form.Item>
      );
    }

    const rules = col.required ? [{ required: true, message: `Please input ${col.headerName}` }] : [];
    let InputComponent = <Input placeholder={`Enter ${col.headerName}`} />;

    if (col.type === 'number') {
      InputComponent = <InputNumber style={{ width: '100%' }} placeholder={`Enter ${col.headerName}`} />;
    }
    
    if (col.option) {
      const fieldOptions = getOptionsForField(col.field) || [];
      InputComponent = (
        <Select 
          placeholder={`Select ${col.headerName}`}
          showSearch
          optionFilterProp="children"
        >
          {fieldOptions.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      );
    }

    return (
      <Col span={isList ? 24 : 8} key={col.field}>
        <Form.Item
          {...restField}
          name={[...namePrefix, col.field]}
          label={!isList ? col.headerName : undefined}
          rules={rules}
        >
          {InputComponent}
        </Form.Item>
      </Col>
    );
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      
      {/* 
        HEADER SECTION
        We explicitly register the main spec_header_id as hidden so it is sent in req.body.header
      */}
      <Form.Item name={['header', 'spec_header_id']} hidden>
        <Input />
      </Form.Item>
      
      <Row gutter={16}>
        {headerColumn.map(col => renderField(col, false, {}, ['header']))}
      </Row>

      <Divider orientation="left">Specification Items</Divider>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', padding: 10, border: '1px solid #f0f0f0', borderRadius: 5 }} align="baseline">
                
                {/* 
                  EXPERT FIX 1: Explicitly bind item IDs so they go back to the Express backend.
                  If these are missing, Postgres won't know which row to UPDATE vs INSERT.
                */}
                <Form.Item name={[name, 'spec_item_id']} hidden {...restField}>
                  <Input />
                </Form.Item>
                <Form.Item name={[name, 'spec_header_id']} hidden {...restField}>
                  <Input />
                </Form.Item>

                <div style={{ width: 250 }}>
                  <div style={{ marginBottom: 4 }}>Header Component Item</div>
                  <Form.Item
                    {...restField}
                    name={[name, 'header_component_item']}
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Select 
                      placeholder="Select component" 
                      onChange={() => {
                        const currentItems = form.getFieldValue('items');
                        if (currentItems[name]) {
                          currentItems[name].detail = undefined;
                          form.setFieldsValue({ items: currentItems });
                        }
                      }}
                    >
                      {headerSpecComponent.map(comp => (
                        <Option key={comp.header_spec_component_id} value={comp.header_spec_component_id}>
                          {comp.header_spec_component_label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div style={{ width: 250 }}>
                  <div style={{ marginBottom: 4 }}>Detail</div>
                  
                  <Form.Item
                    noStyle
                    dependencies={[['items', name, 'header_component_item']]}
                  >
                    {({ getFieldValue }) => {
                      const selectedComponentId = getFieldValue(['items', name, 'header_component_item']);
                      const selectedConfig = headerSpecComponent.find(c => c.header_spec_component_id === selectedComponentId);
                      
                      if (selectedConfig && selectedConfig.option) {
                        const dynamicOptions = headerSpecComponentOption.filter(
                          opt => opt.header_spec_component === selectedComponentId
                        );
                        
                        return (
                          <Form.Item
                            {...restField}
                            name={[name, 'detail']}
                            rules={[{ required: true, message: 'Please select detail' }]}
                          >
                            <Select placeholder="Select detail option">
                              {dynamicOptions.map(opt => (
                                <Option key={opt.header_spec_component_option_id} value={opt.header_spec_component_option_id}>
                                  {opt.header_spec_component_label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        );
                      }
                      
                      return (
                        <Form.Item
                          {...restField}
                          name={[name, 'detail']}
                          rules={[{ required: true, message: 'Please enter detail text' }]}
                        >
                          <Input placeholder="Enter detail text" disabled={!selectedComponentId} />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </div>

                <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red', marginTop: 30 }} />
                
                {/* Fallback for any other dynamically hidden columns configured in itemColumn */}
                {itemColumn.filter(c => c.hidden).map(col => (
                  <Form.Item key={col.field} name={[name, col.field]} hidden {...restField}>
                    <Input />
                  </Form.Item>
                ))}
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Item Row
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>

      <Divider orientation="left">Specification Details</Divider>
      
      <Form.List name="details">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                
                {/* 
                  EXPERT FIX 2: Explicitly bind detail IDs. 
                  When the user clicks "Add Detail Row", spec_detail_id will be undefined, 
                  signaling our Express backend to INSERT a new Postgres row.
                  If the row was loaded from initialValues, it will contain the ID,
                  signaling our Express backend to UPDATE the existing row.
                */}
                <Form.Item name={[name, 'spec_detail_id']} hidden {...restField}>
                  <Input />
                </Form.Item>
                <Form.Item name={[name, 'spec_header_id']} hidden {...restField}>
                  <Input />
                </Form.Item>

                {detailColumn.filter(col => !col.hidden).map(col => (
                  <div key={col.field} style={{ width: 250 }}>
                    <div style={{ marginBottom: 4 }}>{col.headerName}</div>
                    {renderField(col, true, restField, [name])}
                  </div>
                ))}
                
                <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red', marginTop: 30 }} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Detail Row
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>

      <Divider />
      
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
          <Button size="large" onClick={onBack} icon={<ArrowLeftOutlined />}>
            Back
          </Button>
          <Button type="primary" htmlType="submit" size="large">
            {mode === 'POST' ? 'Submit (Create New)' : 'Save Changes (Update)'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}