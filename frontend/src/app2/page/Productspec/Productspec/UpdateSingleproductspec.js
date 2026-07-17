import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import { createColumnDefs } from "../../../utility/ObjectArrayUltility";
import ProductspecForm from "./ProductSpecForm";
import { Button, Space, message } from "antd";
import Form from "../../../component/Form";

const UpdateSingleproductspec = () => {
  const navigate = useNavigate();
  const { id } = useParams();
    const {
    mutate,
    loading: mutationLoading,
    error: mutationError
  } = useMutation();

  const endpoints = useMemo(
    () => ({
      prospec_header: `${baseURL}/app2/productspec/${id}`,
      prospec_detail: `${baseURL}/app2/productspec/detail/${id}`,
      m_customer: `${baseURL}/app2/customer`,
      m_mat: `${baseURL}/app2/m_mat`,
      channelOption: `${baseURL}/app2/option/m_channel`,
      statusOption: `${baseURL}/app2/option/m_status`,
      statusCheckOption: `${baseURL}/app2/option/m_statusCheck`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
      documentStatusOption: `${baseURL}/app2/option/m_documentStatus`,
    }),
    [id]
  );

  const { data, loading, error } = useFetchMultiple(endpoints);

  const headerColumn = useMemo(() => {
    const source = data?.prospec_header?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[7]) cols[7] = { ...cols[7], option: true };
    if (cols[9]) cols[9] = { ...cols[9], option: true };
    if (cols[10]) cols[10] = { ...cols[10], option: true };
    if (cols[11]) cols[11] = { ...cols[11], option: true };
    if (cols[12]) cols[12] = { ...cols[12], option: true };

    return cols;
  }, [data?.prospec_header?.data]);

  const detailColumn = useMemo(() => {
    const source = data?.prospec_detail?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], hidden: true };
    if (cols[2]) cols[2] = { ...cols[2], option: true };
    if (cols[3]) cols[3] = { ...cols[3], option: true };

    return cols;
  }, [data?.prospec_detail?.data]);

  const initialHeader = useMemo(
    () => data?.prospec_header?.data?.[0] || {},
    [data?.prospec_header?.data]
  );

  const initialDetails = useMemo(
    () => data?.prospec_detail?.data || [],
    [data?.prospec_detail?.data]
  );

    const optionsMap = useMemo(
      () => ({
        channel:
          data?.channelOption?.data?.map((item) => ({
            value: item.chanel_option_id,
            label: item.label,
          })) || [],
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
        customer_id:
          data?.m_customer?.data?.map((item) => ({
            value: item.customer_id,
            label: `${item.name} - ${item.erp}`,
          })) || [],
        component_header:
          // data?.componentHeaderOption?.data?.map((item) => ({
          //   value: item.compoent_header_option_id,
          //   label: item.compoent_header_option_label,
          // })) || [],
            data?.componentHeaderOption?.data
            ?.filter((item) =>
              ["attachPaper", "Sticker"].includes(
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
            })) || [] ,
        mat_id:
          data?.m_mat?.data?.map((item) => ({
            value: item.mat_id,
            label: `${item.erp} - ${item.name}`,
          })) || [],
      }),
      [data]
    );

  const handleUpdate = async (payload) => {
    try {
      console.log("payload", payload)
      const result = await mutate({
        url: `${baseURL}/app2/productspec/putSingle`,
        method: "POST",
        data: payload,
      });
      if (result.success) {

        message.success(
          result.data?.msg || "Post Success"
        );
        // navigate(`/app2/product-spec/product-spec`)
        setTimeout(() => {
          navigate("/app2/product-spec/product-spec");
        }, 2000); // 2 seconds
      }else{
        message.error(
          mutationError
        );
      }

    // navigate("/app2/productspec");
    } catch (err) {
    console.error("Update productspec failed:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading productspec</div>;

  return (
    <Form
      mode="edit"
      tableName="product-specification"
      headerColumn={headerColumn}
      detailColumn={detailColumn}
      initialHeader={initialHeader}
      initialDetails={initialDetails}
      optionsMap={optionsMap}
      loading={mutationLoading}
      onSubmit={handleUpdate}
      onCancel={() => navigate(-1)}
    />
  );
};

export default UpdateSingleproductspec;