import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import { message, Card, Typography, Spin } from "antd";
import DynamicForm from "./DynamicForm";

const { Title, Text } = Typography;

const PostSinglespec = () => {
  const navigate = useNavigate();
  const {
    mutate,
    loading: mutationLoading,
    error: mutationError
  } = useMutation();

  const endpoints = useMemo(
    () => ({
      prospec: `${baseURL}/app2/spec/1`,
      m_customer: `${baseURL}/app2/customer`,
      m_mat: `${baseURL}/app2/m_mat`,
      channelOption: `${baseURL}/app2/option/m_channel`,
      statusOption: `${baseURL}/app2/option/m_status`,
      statusCheckOption: `${baseURL}/app2/option/m_statusCheck`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
      documentStatusOption: `${baseURL}/app2/option/m_documentStatus`,
      headerSpeccomponentOption: `${baseURL}/app2/option/m_headerSpeccomponentOption`,
      headerSpeccomponent: `${baseURL}/app2/option/m_headerSpeccomponent`,
    }),
    []
  );

  const { data, loading, error } = useFetchMultiple(endpoints);
  
  const headerColumn = data?.prospec?.columnDefs?.spec_header_ColumnDefs || [];
  const detailColumn = data?.prospec?.columnDefs?.spec_detail_ColumnDefs || [];
  const itemColumn = data?.prospec?.columnDefs?.spec_item_ColumnDefs || [];
  const headerSpeccomponentOption = data?.headerSpeccomponentOption?.data || [];
  const headerSpeccomponent = data?.headerSpeccomponent?.data || [];
    console.log("Fetched data:", data);
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
        data?.componentHeaderOption?.data
          ?.filter((item) =>
            ["attachPaper", "Sticker"].includes(item.compoent)
          )
          .sort((b, a) =>
            b.compoent_header_option_label.localeCompare(
              a.compoent_header_option_label
            )
          )
          .map((item) => ({
            value: item.compoent_header_option_id,
            label: item.compoent_header_option_label,
          })) || [],
      mat_id:
        data?.m_mat?.data?.filter((item) =>
        ["ใบแนบ", "Sticker"].includes(item.component)
      ).map((item) => ({
          value: item.mat_id,
          label: `${item.erp} - ${item.name}`,
        })) || [],
    }),
    [data]
  );

  const handleCreate = async (payload) => {
    console.log("Payload to be sent for creation:", payload);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/spec/postSingle`,
        method: "POST",
        data: payload,
      });
      if (result.success) {
        message.success(result.data?.msg || "Specification created successfully");
        navigate(-1); // Redirect back on success
      } else {
        message.error(mutationError || "An error occurred while saving.");
      }
    } catch (err) {
      console.error(mutationError);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" tip="Loading Form Data..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Typography.Text type="danger" strong>Error loading form data.</Typography.Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* Cleaned up header section since Back button moved to footer */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>
          Create New Specification
        </Title>
        <Text type="secondary">
          Fill in the details below to generate a new product specification document.
        </Text>
      </div>

      <Card 
        bordered={false} 
        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        <DynamicForm 
          mutationLoading= {mutationLoading}
          headerColumn={headerColumn}
          detailColumn={detailColumn}
          itemColumn={itemColumn}
          headerSpecComponent={headerSpeccomponent}
          headerSpecComponentOption={headerSpeccomponentOption}
          optionsMap={optionsMap}
        //   initialValues={header:{status_check_id: 1, revision: "Rev. 00"}} 
            initialValues={{
                header: {
                    status_check_id: 1,
                    revision: "Rev. 00"
                }
            }}
          onSubmit={handleCreate}
          onBack={() => navigate(-1)} // <--- Passes the Back function to the form
          mode="POST"
        />
      </Card>
      
    </div>
  );
};

export default PostSinglespec;