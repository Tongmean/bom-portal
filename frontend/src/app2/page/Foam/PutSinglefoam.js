import React, { useMemo } from "react";
import { message } from "antd";
import useFetchMultiple from "../../hook/useFetchmultiple";
import useMutation from "../../hook/useMutation";
import { baseURL } from "../../../utility/apiClient";
import { createColumnDefs } from "../../utility/ObjectArrayUltility";
import Form from "../../component/Form";
import { useNavigate, useParams } from "react-router-dom";
import {
  navigateWithHighlight,
} from "../../utility/navigationHighlight";

const PutSinglefoam = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();
  const { id } = useParams();

  const endpoints = useMemo(
    () => ({
      header: `${baseURL}/app2/foam/1`,
      detail: `${baseURL}/app2/foam/detail/1`,
      m_mat: `${baseURL}/app2/m_mat`,
      currentHeader: `${baseURL}/app2/foam/${id}`,
      currentDetail: `${baseURL}/app2/foam/detail/${id}`,
    //   statusCheckOption: `${baseURL}/app2/option/m_statusCheck`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
    //   documentStatusOption: `${baseURL}/app2/option/m_documentStatus`,
    }),
    []
  );

  const { data, loading, error } = useFetchMultiple(endpoints);
  const headerColumn = useMemo(() => {
    const source = data?.header?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], required: true };
    // if (cols[5]) cols[5] = { ...cols[5], option: true, required: true };
    // if (cols[6]) cols[6] = { ...cols[6], option: true, required: true };

    return cols;
  }, [data?.header?.data]);

  const detailColumn = useMemo(() => {
    const source = data?.detail?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], hidden: true };
    if (cols[2]) cols[2] = { ...cols[2], option: true, required: true };
    if (cols[3]) cols[3] = { ...cols[3], option: true };

    return cols;
  }, [data?.detail?.data]);
  // console.log("data", data);
  // console.log("detailColumn", detailColumn);
  console.log("id", id);
  const optionsMap = useMemo(
    () => ({
     
      component_header:
        data?.componentHeaderOption?.data
        ?.filter((item) =>
        ["revitBag", "foam", "shrinkFilm"].includes(
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
  const initialHeader = useMemo(
    () => data?.currentHeader?.data?.[0] || {},
    [data]
  );

  const initialDetails = useMemo(
    () => data?.currentDetail?.data || [],
    [data]
  );
  const handleUpdate = async (payload) => {
    console.log("payload", payload);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/foam/putSingle`,
        method: "POST",
        data: payload,
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Create success");
        setTimeout(() => {
          navigateWithHighlight({
            navigate,
            path: "/app2/additionalFaom",
            ids: [Number(id)],
            idField: "foam_header_id",
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
      mode="edit"
      tableName = "โฟมและอื่น ๆๆ (อุปกรณ์เสริม)"
      headerColumn={headerColumn}
      detailColumn={detailColumn}
      initialHeader={initialHeader}
      initialDetails={initialDetails}
      optionsMap={optionsMap}
      loading={mutationLoading}
      onSubmit={handleUpdate}
      onCancel={() => 
        navigateWithHighlight({
          navigate,
          path: "/app2/additionalFaom",
          ids: [Number(id)],
          idField: "foam_header_id",
        })
      }
      // onBack={() => navigate("/app2/engineering/drawing")}
    />
  );
};

export default PutSinglefoam;