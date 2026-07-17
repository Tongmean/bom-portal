// import React, { useEffect } from "react";
// import { Form, Input, Select, Button, Card, Space, Row, Col, Upload } from "antd";
// import { UploadOutlined } from "@ant-design/icons"; // Add this import

// const { Option } = Select;

// // Ant Design helper to extract the file object from the Upload component
// const normFile = (e) => {
//   if (Array.isArray(e)) {
//     return e;
//   }
//   return e?.fileList;
// };

// const ReusableForm = ({
//   mode = "create",
//   columnsMap = {},
//   optionsMap = {},
//   initialValues = {},
//   onSubmit,
//   onCancel,
//   loading = false,
// }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (Object.keys(initialValues).length > 0) {
//       form.setFieldsValue(initialValues);
//     } else {
//       form.resetFields();
//     }
//   }, [initialValues, form]);

//   const onFinish = (values) => {
//     onSubmit(values);
//   };

//   const renderField = (col, tableName) => {
//     const fieldPath = [tableName, 0, col.field];

//     if (col.hidden) {
//       return (
//         <Form.Item key={col.field} name={fieldPath} hidden>
//           <Input />
//         </Form.Item>
//       );
//     }

//     // 1. File Upload Field (Updated for Ant Design)
//     if (col.field === "file") {
//       return (
//         <Col xs={24} sm={12} md={8} key={col.field}>
//           <Form.Item
//             label={col.headerName || "Upload File"}
//             name={fieldPath}
//             valuePropName="fileList"
//             getValueFromEvent={normFile}
//             rules={[{ required: col.required, message: "Please upload a file!" }]}
//           >
//             {/* beforeUpload={() => false} stops AntD from auto-uploading to a URL immediately */}
//             <Upload beforeUpload={() => false} maxCount={1}>
//               <Button icon={<UploadOutlined />}>Select File</Button>
//             </Upload>
//           </Form.Item>
//         </Col>
//       );
//     }

//     // 2. Dropdown / Select Fields
//     let inputNode = <Input placeholder={`Enter ${col.headerName}`} />;
//     if (col.option || optionsMap[col.field]) {
//       const options = optionsMap[col.field] || [];
//       inputNode = (
//         <Select placeholder={`Select ${col.headerName}`} allowClear>
//           {options.map((opt) => (
//             <Option key={opt.value} value={opt.value}>
//               {opt.label}
//             </Option>
//           ))}
//         </Select>
//       );
//     }

//     // 3. Standard Text Input
//     return (
//       <Col xs={24} sm={12} md={8} key={col.field}>
//         <Form.Item
//           label={col.headerName}
//           name={fieldPath}
//           rules={[{ required: col.required, message: `Please input ${col.headerName}!` }]}
//         >
//           {inputNode}
//         </Form.Item>
//       </Col>
//     );
//   };

//   return (
//     <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
//       {Object.entries(columnsMap).map(([tableName, columns]) => (
//         <Card title={tableName.replace("ColumnDefs", "")} key={tableName} style={{ marginBottom: 16 }}>
//           <Row gutter={16}>
//             {columns.map((col) => renderField(col, tableName))}
//           </Row>
//         </Card>
//       ))}

//       <Space style={{ marginTop: 16 }}>
//         <Button type="primary" htmlType="submit" loading={loading}>
//           {mode === "create" ? "Submit Data" : "Update Data"}
//         </Button>
//         <Button onClick={onCancel} disabled={loading}>
//           Cancel
//         </Button>
//       </Space>
//     </Form>
//   );
// };


// export default ReusableForm;




import React, { useEffect, useMemo } from "react";
import { Form, Input, Select, Button, Card, Space, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ReusableForm = ({
  mode = "create",
  columnsMap = {},
  optionsMap = {},
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  // 1. Format the values IMMEDIATELY before they touch the form
  const formattedInitialValues = useMemo(() => {
    if (Object.keys(initialValues).length === 0) return {};
    
    // Deep clone to safely mutate
    const cloned = JSON.parse(JSON.stringify(initialValues));

    // Scan columns to find the "file" field and format it for Ant Design
    Object.entries(columnsMap).forEach(([tableName, columns]) => {
      columns.forEach((col) => {
        if (col.field === "file") {
          const existingFile = cloned[tableName]?.[0]?.[col.field];
          
          // If backend returned a string, turn it into an AntD Array immediately
          if (existingFile && typeof existingFile === "string") {
            const fileName = existingFile.split("\\").pop().split("/").pop(); 
            
            cloned[tableName][0][col.field] = [
              {
                uid: "-1", 
                name: fileName || "Existing File",
                status: "done",
                url: existingFile, 
              },
            ];
          }
        }
      });
    });

    return cloned;
  }, [initialValues, columnsMap]);

  // 2. Set the fields using the safely formatted values
  useEffect(() => {
    if (Object.keys(formattedInitialValues).length > 0) {
      form.setFieldsValue(formattedInitialValues);
    } else {
      form.resetFields();
    }
  }, [formattedInitialValues, form]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const renderField = (col, tableName) => {
    const fieldPath = [tableName, 0, col.field];

    if (col.hidden) {
      return (
        <Form.Item key={col.field} name={fieldPath} hidden>
          <Input />
        </Form.Item>
      );
    }

    if (col.field === "file") {
      return (
        <Col xs={24} sm={12} md={8} key={col.field}>
          <Form.Item
            label={col.headerName || "Upload File"}
            name={fieldPath}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: col.required, message: "Please upload a file!" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>
                {mode === "edit" ? "Change File" : "Select File"}
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      );
    }

    let inputNode = <Input placeholder={`Enter ${col.headerName}`} />;
    if (col.option || optionsMap[col.field]) {
      const options = optionsMap[col.field] || [];
      inputNode = (
        <Select placeholder={`Select ${col.headerName}`} allowClear>
          {options.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      );
    }

    return (
      <Col xs={24} sm={12} md={8} key={col.field}>
        <Form.Item
          label={col.headerName}
          name={fieldPath}
          rules={[{ required: col.required, message: `Please input ${col.headerName}!` }]}
        >
          {inputNode}
        </Form.Item>
      </Col>
    );
  };

  return (
    // 3. Pass the formatted values to the initialValues prop so the first render doesn't crash
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={formattedInitialValues}>
      {Object.entries(columnsMap).map(([tableName, columns]) => (
        <Card title={tableName.replace("ColumnDefs", "")} key={tableName} style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {columns.map((col) => renderField(col, tableName))}
          </Row>
        </Card>
      ))}

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {mode === "create" ? "Submit Data" : "Update Data"}
        </Button>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </Space>
    </Form>
  );
};

export default ReusableForm;