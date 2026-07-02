import React, {
  useState,
  useMemo
} from "react";

import { useNavigate } from "react-router-dom";

import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";

import {
  createColumnDefs
} from "../../../utility/SdpackagingUltility";

import {
  deleteIndices,
  addElementAtIndex
} from "../../../utility/ObjectArrayUltility";

import CustomerFormTable from "./CustomerFormTable";

import {
  Button,
  Space,
  message
} from "antd";

const PostArrayCustomer = () => {

  const navigate = useNavigate();
  const {
    mutate,
    loading: mutationLoading,
    error: mutationError
    } = useMutation();
  const [formRows, setFormRows] = useState([]);

  const endpoints = useMemo(
    () => ({
      m_entity: `${baseURL}/app2/m_entity`,
      m_customer: `${baseURL}/app2/customer`,
    }),
    []
  );

  const {
    data,
    loading,
    error
  } = useFetchMultiple(endpoints);

  const finalcolumnDefs = useMemo(() => {
    const cols = createColumnDefs(
      data?.m_customer?.data || []
    );

    const updatedCols = deleteIndices(
      cols,
      [0, 1, 2]
    );

    return addElementAtIndex(
      updatedCols,
      0,
      {
        headerName: "รหัส Entity",
        field: "entity_id"
      }
    );
  }, [data?.m_customer?.data]);

  const entityOptions =
    data?.m_entity?.data?.map(item => ({
      label: `${item.erp} - ${item.name}`,
      value: item.entity_id
    })) || [];

  const handleSubmit = async () => {
    // console.log("Payload", formRows);
    const result = await mutate({
      method: "post",
      url: `${baseURL}/app2/customer/postArray`,
      data: formRows
      
    })
    // Clear Form
    // setFormRows([]);
    // message.success(result.msg || "Ready To Post");
    if (result.success) {
      setFormRows([]);

      message.success(
        result.data?.msg || "Post Success"
      );
    } else {
      message.error(
        result?.msg || "Post Failed"
      );
    }
  };

  const handleClear = () => {
    setFormRows([]);
    message.success("Clear data success");
  };

  const handleBack = () => {
    navigate(-1); // กลับหน้าก่อนหน้า
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        padding: 24,
        background: "#f5f5f5",
        minHeight: "100vh"
      }}
    >
      <Space
        direction="vertical"
        style={{
          width: "100%"
        }}
        size="large"
      >
        <CustomerFormTable
          columns={finalcolumnDefs}
          dataSource={formRows}
          setDataSource={setFormRows}
          entityOptions={entityOptions}
        />

        <div
          // style={{
          //   display: "flex",
          //   justifyContent: "space-between"
          // }}
        >


          <Space>
            <Button
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              danger
              onClick={handleClear}
            >
              Clear
            </Button>

            <Button
              type="primary"
              // size="small"
              loading={mutationLoading}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Space>
        </div>

      </Space>
    </div>
  );
};

export default PostArrayCustomer;