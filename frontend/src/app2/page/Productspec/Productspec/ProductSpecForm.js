import React, { useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { navigateWithHighlight } from "../../../utility/navigationHighlight";
const { Title } = Typography;

const ProductspecForm = ({
  mode = "",
  headerColumn = [],
  detailColumn = [],
  initialHeader = {},
  initialDetails = [],
  optionsMap = {},
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const initialValues = useMemo(() => {
    return {
      ...initialHeader,
      detail:
        initialDetails.length > 0
          ? initialDetails
          : [
              detailColumn.reduce((acc, col) => {
                acc[col.field] = "";
                return acc;
              }, {}),
            ],
    };
  }, [initialHeader, initialDetails, detailColumn]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const renderField = (col, namePath, detailIndex = null) => {
    const rules = col.hidden
      ? []
      : [
          {
            required: false,
          },
        ];

    if (col.hidden) {
      return (
        <Form.Item key={col.field} name={namePath} hidden>
          <Input />
        </Form.Item>
      );
    }

    if (col.option) {
      return (
        <Form.Item
          key={col.field}
          label={col.headerName}
          name={namePath}
          rules={rules}
        >
          <Select
            showScrollBar
            showSearch
            allowClear
            options={optionsMap[col.field] || []}
            placeholder={`Select ${col.headerName}`}
          />
        </Form.Item>
      );
    }

    if (col.field === "quantity") {
      return (
        <Form.Item
          key={col.field}
          label={col.headerName}
          name={namePath}
          rules={rules}
        >
          <InputNumber style={{ width: "100%" }} placeholder={`Enter ${col.headerName}`} />
        </Form.Item>
      );
    }

    return (
      <Form.Item
        key={col.field}
        label={col.headerName}
        name={namePath}
        rules={rules}
      >
        <Input placeholder={`Enter ${col.headerName}`} />
      </Form.Item>
    );
  };

  const handleFinish = (values) => {
    const payload = {
      header: {},
      detail: values.detail || [],
    };

    headerColumn.forEach((col) => {
      payload.header[col.field] = values[col.field];
    });

    payload.detail = (values.detail || []).map((row) => {
      const newRow = {};
      detailColumn.forEach((col) => {
        newRow[col.field] = row?.[col.field];
      });

      if (!newRow.productspec_header_id && values.productspec_header_id) {
        newRow.productspec_header_id = values.productspec_header_id;
      }

      return newRow;
    });

    onSubmit?.(payload);
  };

  return (
    <Card>
      <Title level={3}>
        {mode === "edit" ? "Update Product Spec" : "Create Product Spec"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <Card size="small" title="Header" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {headerColumn.map((col) => (
              <Col xs={24} md={12} lg={8} key={col.field}>
                {renderField(col, col.field)}
              </Col>
            ))}
          </Row>
        </Card>

        <Card
          size="small"
          title="Detail"
          extra={null}
        >
          <Form.List name="detail">
            {(fields, { add, remove }) => (
              <>
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add(
                        detailColumn.reduce((acc, col) => {
                          acc[col.field] =
                            col.field === "productspec_header_id"
                              ? form.getFieldValue("productspec_header_id") || ""
                              : "";
                          return acc;
                        }, {})
                      )
                    }
                    icon={<PlusOutlined />}
                  >
                    Add Detail
                  </Button>
                </Space>

                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    type="inner"
                    title={`Detail Row ${index + 1}`}
                    style={{ marginBottom: 16 }}
                    extra={
                      fields.length > 1 ? (
                        <Button
                          danger
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          Remove
                        </Button>
                      ) : null
                    }
                  >
                    <Row gutter={16}>
                      {detailColumn.map((col) => (
                        <Col xs={24} md={12} lg={8} key={`${field.key}-${col.field}`}>
                          {renderField(col, [field.name, col.field], index)}
                        </Col>
                      ))}
                    </Row>
                  </Card>
                ))}
              </>
            )}
          </Form.List>
        </Card>

        <Space style={{ marginTop: 24 }}>
            <Button
              onClick={()=>{
                // navigate(`/app2/product-spec/product-spec`);
                navigateWithHighlight({
                  navigate,
                  path: "/app2/product-spec/product-spec",
                  ids: [initialHeader.productspec_header_id],
                  idField: "productspec_header_id",
                });
              }}
            >
              Back
            </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default ProductspecForm;