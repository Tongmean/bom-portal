import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useFetchMultiple from "../../hook/useFetchmultiple";
import useMutation from "../../hook/useMutation";
import { baseURL } from "../../../utility/apiClient";
import ReusableForm from "./ReusableForm";

const PostSingleCertificate = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();

  const endpoints = useMemo(
    () => ({
      header: `${baseURL}/app2/certificate/1`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
    }),
    []
  );

  const { data: data1, loading, error } = useFetchMultiple(endpoints);
  const { columnDefs, data } = data1?.header || {};

  const optionsMap = useMemo(() => {
    const rawOptions = data1?.componentHeaderOption?.data || [];

    const filterAndFormat = (type) =>
      rawOptions
        .filter((item) => item.compoent === type)
        .sort((b, a) =>
          b.compoent_header_option_label.localeCompare(a.compoent_header_option_label)
        )
        .map((item) => ({
          value: item.compoent_header_option_id,
          label: item.compoent_header_option_label,
        }));

    return {
      type_brake: filterAndFormat("product_type"),
      certificate_cat: filterAndFormat("certificate_cat"),
      certificate_type: filterAndFormat("certificate_type"),
    };
  }, [data1]);

  const handleCreate = async (values) => {
    console.log("=== RAW FORM VALUES ===", values);

    // 1. Initialize FormData to handle both text arrays and the binary file
    const formData = new FormData();

    // 2. Stringify the arrays so the backend doesn't receive "[object Object]"
    if (values.certificateColumnDefs) {
      formData.append("certificateColumnDefs", JSON.stringify(values.certificateColumnDefs));
    }
    if (values.certificateCatColumnDefs) {
      formData.append("certificateCatColumnDefs", JSON.stringify(values.certificateCatColumnDefs));
    }
    if (values.certificateTypeColumnDefs) {
      formData.append("certificateTypeColumnDefs", JSON.stringify(values.certificateTypeColumnDefs));
    }

    // 3. Extract and append the physical file from Ant Design
    const fileField = values.certificateFileColumnDefs?.[0]?.file;
    if (fileField && fileField.length > 0) {
      const uploadedFile = fileField[0].originFileObj;
      if (uploadedFile) {
        // This MUST match the name in your backend upload.single("certificate_file")
        formData.append("file", uploadedFile);
      } else {
        console.error("File selected, but originFileObj is missing.");
      }
    }

    try {
      const result = await mutate({
        url: `${baseURL}/app2/certificate/postSingle`,
        method: "POST",
        data: formData, // Send FormData, NOT the raw values!
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Create success");
        // navigate("/app2/engineering"); // Uncomment when ready to redirect
      } else {
        message.error(result?.msg || mutationError || "Failed to create certificate");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      message.error(mutationError || "An error occurred during submission");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading form data...</div>;
  if (error) return <div style={{ padding: 24 }}>Error loading form data</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>Create Certificate</h2>
      <ReusableForm
        mode="create"
        columnsMap={columnDefs || {}}
        optionsMap={optionsMap}
        loading={mutationLoading}
        onSubmit={handleCreate}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default PostSingleCertificate;