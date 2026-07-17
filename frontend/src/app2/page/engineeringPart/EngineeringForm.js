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

const { Title } = Typography;

const EngineeringForm = ({
  mode = "create",
  headerColumn = [],
  detailColumn = [],
  initialHeader = {},
  initialDetails = [],
  optionsMap = {},
  loading = false,
  onSubmit,
  onCancel,
  onBack,
}) => {
  const [form] = Form.useForm();

  const numberFields = useMemo(
    () =>
      new Set([
        "quantity",
        "height",
        "width",
        "thick_upper",
        "thick_lower",
        "curve",
      ]),
    []
  );

  const initialValues = useMemo(() => {
    return {
      header: { ...initialHeader },
      detail:
        initialDetails.length > 0
          ? initialDetails
          : [
              detailColumn.reduce((acc, col) => {
                acc[col.field] =
                  col.field === "drawing_header_id"
                    ? initialHeader?.drawing_header_id || null
                    : null;
                return acc;
              }, {}),
            ],
    };
  }, [initialHeader, initialDetails, detailColumn]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const buildRules = (col) => {
    if (col.hidden) return [];

    const rules = [];

    if (col.required) {
      rules.push({
        required: true,
        message: `${col.headerName} is required`,
      });
    }

    if (numberFields.has(col.field)) {
      rules.push({
        validator: (_, value) => {
          if (value === undefined || value === null || value === "") {
            return Promise.resolve();
          }
          if (Number.isNaN(Number(value))) {
            return Promise.reject(new Error(`${col.headerName} must be a number`));
          }
          return Promise.resolve();
        },
      });
    }

    return rules;
  };

  const renderField = (col, namePath) => {
    const rules = buildRules(col);

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
          key={Array.isArray(namePath) ? namePath.join("-") : col.field}
          label={col.headerName}
          name={namePath}
          rules={rules}
        >
          <Select
            showSearch
            allowClear
            optionFilterProp="label"
            options={optionsMap[col.field] || []}
            placeholder={`Select ${col.headerName}`}
          />
        </Form.Item>
      );
    }

    if (numberFields.has(col.field)) {
      return (
        <Form.Item
          key={Array.isArray(namePath) ? namePath.join("-") : col.field}
          label={col.headerName}
          name={namePath}
          rules={rules}
        >
          <InputNumber
            // size="small"
            controls={false}
            style={{ width: "100%" }}
            placeholder={`Enter ${col.headerName}`}
          />
        </Form.Item>
      );
    }

    return (
      <Form.Item
        key={Array.isArray(namePath) ? namePath.join("-") : col.field}
        label={col.headerName}
        name={namePath}
        rules={rules}
      >
        <Input placeholder={`Enter ${col.headerName}`} />
      </Form.Item>
    );
  };

  const createEmptyDetailRow = () => {
    return detailColumn.reduce((acc, col) => {
      acc[col.field] =
        col.field === "drawing_header_id"
          ? form.getFieldValue(["header", "drawing_header_id"]) || null
          : null;
      return acc;
    }, {});
  };

  const handleFinish = (values) => {
    const payload = {
      header: { ...(values.header || {}) },
      detail: (values.detail || []).map((row) => {
        const newRow = {};

        detailColumn.forEach((col) => {
          newRow[col.field] = row?.[col.field] ?? null;
        });

        if (!newRow.drawing_header_id && values?.header?.drawing_header_id) {
          newRow.drawing_header_id = values.header.drawing_header_id;
        }

        return newRow;
      }),
    };

    onSubmit?.(payload);
  };

  return (
    <Card>
      <Title level={3}>
        {mode === "edit"
          ? "Update Engineering (Drawing)"
          : "Create Engineering (Drawing)"}
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
              <Col xs={24} md={16} lg={8} key={col.field}>
                {renderField(col, ["header", col.field])}
              </Col>
            ))}
          </Row>
        </Card>

        <Card size="small" title="Detail">
          <Form.List name="detail">
            {(fields, { add, remove }) => (
              <>
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    type="dashed"
                    onClick={() => add(createEmptyDetailRow())}
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
                        <Col
                          xs={24}
                          md={12}
                          lg={8}
                          key={`${field.key}-${col.field}`}
                        >
                          {renderField(col, [field.name, col.field])}
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
          {onBack && <Button onClick={onBack}>Back</Button>}
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default EngineeringForm;