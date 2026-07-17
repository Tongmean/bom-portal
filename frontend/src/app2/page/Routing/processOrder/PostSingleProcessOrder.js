import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import Form from "../../../component/Form";

const PostSingleProcessOrder = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();

  const endpoints = useMemo(
    () => ({
     
      proccess: `${baseURL}/app2/process/1`,
      m_mat: `${baseURL}/app2/m_mat`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
    }),
    []
  );

  const { data, loading, error } = useFetchMultiple(endpoints);
  
    const {process_routing_ColumnDefs: header, process_routing_order_ColumnDefs: detail} = data?.proccess?.columnDefs || {}
  console.log("data", data);
  console.log("header", header);
  console.log("detail", detail);
  const optionsMap = useMemo(
    () => ({
      process:
        data?.componentHeaderOption?.data
        ?.filter((item) =>
        ["hotPress", "sharpenDrilling", "packaging"].includes(
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
          label: `${item.erp} - ${item.component}`,
        })) || [],
    }),
    [data]
  );

  const handleCreate = async (payload) => {
    console.log("payload", payload);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/process/postSingle`,
        method: "POST",
        data: payload,
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Create success");
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
      tableName = "Routing"
      headerColumn={header}
      detailColumn={detail}
      initialHeader={{}}
      initialDetails={[]}
      optionsMap={optionsMap}
      loading={mutationLoading}
      onSubmit={handleCreate}
      onCancel={() => navigate(-1)}
      // onBack={() => navigate("/app2/engineering/drawing")}
    />
  );
};

export default PostSingleProcessOrder;