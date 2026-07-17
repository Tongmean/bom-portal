import React, { useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Form as AntForm,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { baseURL } from "../../../../utility/apiClient";

const { Dragger } = Upload;

const NUMBER_FIELDS = [
  "weight",
  "costperunit",
  "height",
  "width",
  "thick",
  "curve",
  "area",
  "min_thick",
  "max_thick",
  "cavity",
];

const shouldKeepHiddenValue = (fieldName = "") => {
  return fieldName.endsWith("_id") || fieldName === "mat_id";
};

const shouldRenderVisibleField = (fieldConfig = {}) => {
  if (fieldConfig.field === "file") return true;
  return !fieldConfig.hidden;
};

const buildRules = (field) => {
  const rules = [];
  if (field.required) {
    rules.push({
      required: true,
      message: `${field.headerName || field.field} is required`,
    });
  }
  return rules;
};

const normalizeUploadValue = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList || [];
};

const beforePdfUpload = (file) => {
  const isPdf =
    file.type === "application/pdf" ||
    file.name?.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    message.error("Only PDF files are allowed");
    return Upload.LIST_IGNORE;
  }

  return false;
};

const getFieldComponent = (fieldConfig, options = []) => {
  if (fieldConfig.field === "file") {
    return (
      <Dragger
        accept=".pdf,application/pdf"
        beforeUpload={beforePdfUpload}
        multiple={false}
        maxCount={1}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag PDF file here</p>
        <p className="ant-upload-hint">Only PDF files are allowed</p>
      </Dragger>
    );
  }

  if (fieldConfig.option) {
    return (
      <Select
        allowClear
        showSearch
        optionFilterProp="label"
        options={options}
        placeholder={`Select ${fieldConfig.headerName || fieldConfig.field}`}
      />
    );
  }

  if (NUMBER_FIELDS.includes(fieldConfig.field)) {
    return <InputNumber style={{ width: "100%" }} />;
  }

  return (
    <Input placeholder={`Enter ${fieldConfig.headerName || fieldConfig.field}`} />
  );
};

const RenderField = ({ fieldConfig, namePath, options = [] }) => {
  if (!fieldConfig) return null;

  if (fieldConfig.field === "file") {
    return (
      <AntForm.Item
        label={fieldConfig.headerName || "File"}
        name={namePath}
        valuePropName="fileList"
        getValueFromEvent={normalizeUploadValue}
        rules={buildRules(fieldConfig)}
      >
        {getFieldComponent(fieldConfig, options)}
      </AntForm.Item>
    );
  }

  return (
    <AntForm.Item
      label={fieldConfig.headerName}
      name={namePath}
      rules={buildRules(fieldConfig)}
    >
      {getFieldComponent(fieldConfig, options)}
    </AntForm.Item>
  );
};

const HiddenField = ({ namePath }) => {
  return (
    <AntForm.Item name={namePath} hidden>
      <Input />
    </AntForm.Item>
  );
};

const getFlexValue = (count, fieldName) => {
  if (fieldName === "file") return "1 1 100%";
  if (!count || count <= 0) return "1 1 100%";
  return `0 0 ${100 / count}%`;
};

const SingleRecordSection = ({ title, listName, columns = [], optionsMap = {} }) => {
  const displayColumns = columns.filter((col) => shouldRenderVisibleField(col));
  const hiddenColumns = columns.filter(
    (col) => col.hidden && shouldKeepHiddenValue(col.field)
  );

  return (
    <Card title={title} size="small" style={{ marginTop: 16 }}>
      {hiddenColumns.map((col) => (
        <HiddenField key={col.field} namePath={[listName, 0, col.field]} />
      ))}

      <Row gutter={16} wrap={false}>
        {displayColumns.map((col) => {
          const options = optionsMap?.[col.field] || optionsMap?.[listName] || [];

          return (
            <Col key={col.field} flex={getFlexValue(displayColumns.length, col.field)}>
              <RenderField
                fieldConfig={col}
                namePath={[listName, 0, col.field]}
                options={options}
              />
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

const DynamicForm = ({
  mode = "create",
  tableName = "Material",
  column = {},
  initialValues = {},
  optionsMap = {},
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [form] = AntForm.useForm();
  const fileList =
  initialValues?.file?.file
    ? [
        {
          uid: "-1",
          name: initialValues.file.file,
          status: "done",
          url: `${baseURL}/Assets/Mat/${encodeURIComponent(
            initialValues.file.file
          )}`,
        },
      ]
    : [];
  const mainDisplayColumns = useMemo(() => {
    return (column?.matColumn || []).filter((col) => shouldRenderVisibleField(col));
  }, [column?.matColumn]);

  const mainHiddenColumns = useMemo(() => {
    return (column?.matColumn || []).filter(
      (col) => col.hidden && shouldKeepHiddenValue(col.field)
    );
  }, [column?.matColumn]);

  useEffect(() => {
    form.setFieldsValue({
      ...(initialValues?.mat || {}),
      mat_cat:
        Array.isArray(initialValues?.mat_cat) && initialValues.mat_cat.length > 0
          ? [initialValues.mat_cat[0]]
          : [{}],
      mat_unit:
        Array.isArray(initialValues?.mat_unit) && initialValues.mat_unit.length > 0
          ? [initialValues.mat_unit[0]]
          : [{}],
      mat_dimension:
        Array.isArray(initialValues?.mat_dimension) &&
        initialValues.mat_dimension.length > 0
          ? [initialValues.mat_dimension[0]]
          : [{}],
      // mat_file:
      //   Array.isArray(initialValues?.mat_file) && initialValues.mat_file.length > 0
      //     ? [initialValues.mat_file[0]]
      //     : [{ file: [] }],
      mat_file: [
        {
          file: fileList,
        },
      ],
    });
  }, [form, initialValues]);

  const normalizeSingleArray = (value, fallback = {}) => {
    if (Array.isArray(value) && value.length > 0) {
      return [value[0] || fallback];
    }
    return [fallback];
  };

  const handleFinish = (values) => {
    const mat = {};
    (column?.matColumn || []).forEach((col) => {
      mat[col.field] = values[col.field] ?? null;
    });

    const fileList = values?.mat_file?.[0]?.file || [];
    const rawFile =
      Array.isArray(fileList) && fileList.length > 0
        ? fileList[0]?.originFileObj || null
        : null;

    const payload = {
      mat,
      mat_cat: normalizeSingleArray(values?.mat_cat, {}),
      mat_unit: normalizeSingleArray(values?.mat_unit, {}),
      mat_dimension: normalizeSingleArray(values?.mat_dimension, {}),
      file: rawFile,
    };

    console.log("payload before submit", payload);
    console.log("is real file:", payload.file instanceof File);

    onSubmit?.(payload);
  };

  return (
    <Card title={`${mode === "edit" ? "Edit" : "Create"} ${tableName}`}>
      <AntForm form={form} layout="vertical" onFinish={handleFinish}>
        <Card title="Main Info" size="small">
          {mainHiddenColumns.map((col) => (
            <HiddenField key={col.field} namePath={col.field} />
          ))}

          <Row gutter={16} wrap={false}>
            {mainDisplayColumns.map((col) => {
              const options = optionsMap?.[col.field] || [];

              return (
                <Col key={col.field} flex={getFlexValue(mainDisplayColumns.length, col.field)}>
                  <RenderField
                    fieldConfig={col}
                    namePath={col.field}
                    options={options}
                  />
                </Col>
              );
            })}
          </Row>
        </Card>

        <SingleRecordSection
          title="Category"
          listName="mat_cat"
          columns={column?.matCatColumn || []}
          optionsMap={optionsMap}
        />

        <SingleRecordSection
          title="Unit"
          listName="mat_unit"
          columns={column?.matUnitColumn || []}
          optionsMap={optionsMap}
        />

        <SingleRecordSection
          title="Dimension"
          listName="mat_dimension"
          columns={column?.matDimensionColumn || []}
          optionsMap={optionsMap}
        />

        <SingleRecordSection
          title="File"
          listName="mat_file"
          columns={column?.matFileColumn || []}
          optionsMap={optionsMap}
        />

        <Space style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </AntForm>
    </Card>
  );
};

export default DynamicForm;