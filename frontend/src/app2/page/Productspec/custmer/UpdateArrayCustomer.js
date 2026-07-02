import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Space, message } from "antd";
import useMutation from "../../../hook/useMutation";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import { baseURL } from "../../../../utility/apiClient";
import {
  navigateWithHighlight,
} from "../../../utility/navigationHighlight";
import CustomerUpdateForm from "./CustomerFormTableUpdate";

const UpdateArrayCustomer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { mutate, loading } = useMutation();

  const [dataSource, setDataSource] = useState([]);

  const ids =
    searchParams
      .get("ids")
      ?.split(",")
      .map(Number) || [];

  // const { data: optionData } = useFetchMultiple({
  //   m_entity: `${baseURL}/app2/m_entity`,
  // });
  const endpoints = useMemo(
    () => ({
      m_entity: `${baseURL}/app2/m_entity`,
    }),
    []
  );

  const { data: optionData } = useFetchMultiple(endpoints);

  const entityOptions = optionData?.m_entity?.data || [];

  // const loadData = async () => {
  //   try {
  //     const result = await mutate({
  //       method: "post",
  //       url: `${baseURL}/app2/customer/postbyid`,
  //       data: {
  //         payload: ids,
  //       },
  //     });

  //     setDataSource(result?.data?.data || []);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const loadData = useCallback(async () => {
    try {
      const result = await mutate({
        method: "post",
        url: `${baseURL}/app2/customer/postbyid`,
        data: {
          payload: ids,
        },
      });

      setDataSource(result?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [ids, mutate]);

  useEffect(() => {
    if (ids.length) {
      console.log("LOAD DATA");
      loadData();
    }
  }, []);

  const handleSave = async () => {
    try {
      console.log("dataSource", dataSource)
      const result = await mutate({
        method: "post",
        url: `${baseURL}/app2/customer/updateArraybyid`,
        data: {
          payload: dataSource,
        },
      });
      if (result.success) {
  
        message.success(
          result.data?.msg || "Post Success"
        );
        navigateWithHighlight({
          navigate,
          path: "/app2/product-spec/Customer",
          ids,
          idField: "customer_id",
        });
        }
      
      // message.success("Update Success");
    } catch (err) {
      console.error(err);
      message.error("Update Failed");
    }
  };

  return (
    <div>
     
      <CustomerUpdateForm
        dataSource={dataSource}
        setDataSource={setDataSource}
        entityOptions={entityOptions}
      />
      <Space style={{ marginBottom: 16 }}>
        <Button
            onClick={() =>
              navigateWithHighlight({
                navigate,
                path: "/app2/product-spec/Customer",
                ids,
                idField: "customer_id",
              })
            }
          >
            Back
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          loading={loading}
        >
          Save
        </Button>
      </Space>

     
    </div>
  );
};

export default UpdateArrayCustomer;