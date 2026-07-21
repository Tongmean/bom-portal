import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import Form from "../../../component/Form";
import { navigateWithHighlight } from "../../../utility/navigationHighlight";

const PutSingleProcessOrder = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();
  const { id } = useParams();

  const endpoints = useMemo(
    () => ({
      proccess: `${baseURL}/app2/process/1`,
      initial: `${baseURL}/app2/process/${id}`,
      m_mat: `${baseURL}/app2/m_mat`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
    }),
    []
  );

  const { data, loading, error } = useFetchMultiple(endpoints);
    const {process_routing_ColumnDefs: header, process_routing_order_ColumnDefs: detail} = data?.proccess?.columnDefs || {}
//   console.log("data", data);
//   console.log("header", header);
//   console.log("detail", detail);
//   console.log("initial", data?.initial || {});

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

  const handleUpdate = async (payload) => {
    console.log("payload", payload);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/process/putSingle`,
        method: "POST",
        data: payload,
      });

      if (result?.success) {
        message.success(result?.data?.msg);
        // navigate(-1);
        setTimeout(() => {
          navigateWithHighlight({
            navigate,
            path: "/app2/process/routing-order",
            ids: [Number(id)],
            idField: "process_routing_id",
          })
        }, 2000); // 2 seconds
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
      initialHeader={data?.initial?.data?.process_routing[0] || {}}
      initialDetails={data?.initial?.data?.process_routing_order || []}
      optionsMap={optionsMap}
      loading={mutationLoading}
      onSubmit={handleUpdate}
    //   onCancel={() => navigate(-1)}
      // onBack={() => navigate("/app2/engineering/drawing")}
      onCancel={() =>
        navigateWithHighlight({
          navigate,
          path: "/app2/sdPackaging/packaging",
          ids: [id],
          idField: "sdpackaging_header_id",
        })
      }
    />
  );
};

export default PutSingleProcessOrder;