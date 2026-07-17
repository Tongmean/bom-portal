import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useFetchMultiple from "../../hook/useFetchmultiple";
import useMutation from "../../hook/useMutation";
import { baseURL } from "../../../utility/apiClient";
import { createColumnDefs } from "../../utility/ObjectArrayUltility";
import EngineeringForm from "./EngineeringForm";
import Form from "../../component/Form";

const PostSingleengineeringpart = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();

  const endpoints = useMemo(
    () => ({
      header: `${baseURL}/app2/engineering/1`,
      detail: `${baseURL}/app2/engineering/detail/1`,
      m_mat: `${baseURL}/app2/m_mat`,
      statusCheckOption: `${baseURL}/app2/option/m_statusCheck`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
      documentStatusOption: `${baseURL}/app2/option/m_documentStatus`,
    }),
    []
  );

  const { data, loading, error } = useFetchMultiple(endpoints);

  const headerColumn = useMemo(() => {
    const source = data?.header?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], required: true };
    if (cols[5]) cols[5] = { ...cols[5], option: true, required: true };
    if (cols[6]) cols[6] = { ...cols[6], option: true, required: true };

    return cols;
  }, [data?.header?.data]);

  const detailColumn = useMemo(() => {
    const source = data?.detail?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], hidden: true };
    if (cols[2]) cols[2] = { ...cols[2], option: true, required: true };
    if (cols[3]) cols[3] = { ...cols[3], option: true };
    if (cols[5]) cols[5] = { ...cols[5], required: true };

    return cols;
  }, [data?.detail?.data]);
  console.log("data", data);
  const optionsMap = useMemo(
    () => ({
      document_status:
        data?.documentStatusOption?.data?.map((item) => ({
          value: item.document_status_option_id,
          label: item.label,
        })) || [],
      check_status:
        data?.statusCheckOption?.data?.map((item) => ({
          value: item.status_check_id,
          label: item.label,
        })) || [],
      component_header:
        data?.componentHeaderOption?.data
        ?.filter((item) =>
        ["BL", "LS", "Revit"].includes(
          item.compoent
        )
        ).sort((b, a) =>
          b.compoent_header_option_label.localeCompare(
            a.compoent_header_option_label
          )
        )
        .map((item) => ({
          value: item.compoent_header_option_id,
          label: item.compoent_header_option_label,
        })) || [],
      mat_id:
        data?.m_mat?.data?.map((item) => ({
          value: item.mat_id,
          label: `${item.erp} - ${item.name}`,
        })) || [],
    }),
    [data]
  );

  const handleCreate = async (payload) => {
    console.log("payload", payload);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/engineering/postSingle`,
        method: "POST",
        data: payload,
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Create success");
        navigate("/app2/engineering");
      } else {
        message.error(mutationError);
      }
    } catch {
      message.error(mutationError);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading form data</div>;

  return (
    <Form
      mode="create"
      tableName = "Engineering (Drawing)"
      headerColumn={headerColumn}
      detailColumn={detailColumn}
      initialHeader={{"check_status": 1}}
      initialDetails={[]}
      optionsMap={optionsMap}
      loading={mutationLoading}
      onSubmit={handleCreate}
      onCancel={() => navigate(-1)}
      // onBack={() => navigate("/app2/engineering/drawing")}
    />
  );
};

export default PostSingleengineeringpart;