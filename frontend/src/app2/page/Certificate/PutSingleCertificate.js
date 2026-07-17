import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import useFetchMultiple from "../../hook/useFetchmultiple";
import useMutation from "../../hook/useMutation";
import { baseURL } from "../../../utility/apiClient";
import ReusableForm from "./ReusableForm";

const PutSingleCertificate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL (e.g., /app2/certificate/edit/3)
  
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();

  // 1. Fetch Form Configurations, Dropdowns, and Existing Data
  const endpoints = useMemo(
    () => ({
      header: `${baseURL}/app2/certificate/1`, 
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`, 
      initialData: `${baseURL}/app2/certificate/${id}`, // Fetch the existing record
    }),
    [id]
  );

  const { data: data1, loading, error } = useFetchMultiple(endpoints);
  const { columnDefs } = data1?.header || {};

  // 2. Map Dropdown Options
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

  // 3. Map Backend JSON to Form Layout Keys
  const initialValues = useMemo(() => {
    if (!data1?.initialData?.data) return {};

    const rawData = data1.initialData.data;

    // Optional Safety Fix: If your DB saves labels instead of value codes (like "Lining Brake" instead of "LB")
    // Map them back to the ID code so the Ant Design dropdown selects the correct option.
    if (rawData.certificate && rawData.certificate.length > 0) {
      if (rawData.certificate[0].type_brake === "Lining Brake") {
        rawData.certificate[0].type_brake = "LB";
      } else if (rawData.certificate[0].type_brake === "Disc Brake") {
        rawData.certificate[0].type_brake = "DB";
      } else if (rawData.certificate[0].type_brake === "Shoe Brake") {
        rawData.certificate[0].type_brake = "SB";
      }
    }

    // Map the backend keys exactly to what the reusable form expects
    return {
      certificateColumnDefs: rawData.certificate || [],
      certificateCatColumnDefs: rawData.certificateCat || [],
      certificateTypeColumnDefs: rawData.certificateType || [],
      certificateFileColumnDefs: rawData.certificate_file || [],
    };
  }, [data1]);

  // 4. Handle Form Update (PUT Request)
  const handleUpdate = async (values) => {
    console.log("=== RAW UPDATE VALUES ===", values);

    const formData = new FormData();

    // Safely stringify arrays
    if (values.certificateColumnDefs) {
      formData.append("certificateColumnDefs", JSON.stringify(values.certificateColumnDefs));
    }
    if (values.certificateCatColumnDefs) {
      formData.append("certificateCatColumnDefs", JSON.stringify(values.certificateCatColumnDefs));
    }
    if (values.certificateTypeColumnDefs) {
      formData.append("certificateTypeColumnDefs", JSON.stringify(values.certificateTypeColumnDefs));
    }

    // Handle File Upload
    const fileField = values.certificateFileColumnDefs?.[0]?.file;
    if (fileField && fileField.length > 0) {
      // ONLY append to FormData if it is a NEW file (has originFileObj)
      // If it's the existing file from the backend, we don't need to re-upload it.
      if (fileField[0].originFileObj) {
        const uploadedFile = fileField[0].originFileObj;
        formData.append("file", uploadedFile);
      }
    }

    try {
      const result = await mutate({
        url: `${baseURL}/app2/certificate/putSingle`,
        method: "post",
        data: formData, // Send FormData!
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Update success");
        // navigate("/app2/engineering"); // Uncomment when ready to redirect
      } else {
        message.error(result?.msg || mutationError || "Failed to update certificate");
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
      <h2>Edit Certificate</h2>
      <ReusableForm
        mode="edit"
        columnsMap={columnDefs || {}}
        optionsMap={optionsMap}
        initialValues={initialValues} // Feed mapped data into form
        loading={mutationLoading}
        onSubmit={handleUpdate}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default PutSingleCertificate;