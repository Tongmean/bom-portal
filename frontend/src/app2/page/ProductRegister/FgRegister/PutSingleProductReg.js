
import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
// Assuming your custom hooks exist
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import DynamicForm from "./DynamicForm";
import {
    navigateWithHighlight,
  } from "../../../utility/navigationHighlight";

const PutSingleProductReg = () => {
  const { mutate, loading: mutationLoading,error: mutationError } = useMutation();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = useMemo(
    () => ({
      initialData: `${baseURL}/app2/product-register/${id}`,
      productRegister: `${baseURL}/app2/product-register/1`,
      productRegisterOption: `${baseURL}/app2/option/productRegoption`,
      m_mat: `${baseURL}/app2/m_mat`,
      statusCheckOption: `${baseURL}/app2/option/m_statusCheck`,
      documentStatusOption: `${baseURL}/app2/option/m_documentStatus`,
    }),
    []
  );

  const { data: fetchResult, loading: fetchLoading, error } = useFetchMultiple(endpoints);
  console.log("fetchResult", fetchResult);

  // // Initial values for POST. Note: detail_ColumnDefs is initialized with one empty object row.
  // const postInitialValues = {
  //   mat_ColumnDefs: { status_check_id: 1 , revision: "REV. 00"},
  //   header_ColumnDefs: { status_id: 1, pcs_per_set: 4 },
  //   detail_ColumnDefs: [{}], // Starts the Form.List with 1 empty row
  // };

  // Safely extract schema
  const columnDefsObj = fetchResult?.productRegister?.columnDefs || {};
  const m_mat_data = fetchResult?.m_mat?.data || [];
  const m_status_data = fetchResult?.documentStatusOption?.data || [];
  const status_check_id_data = fetchResult?.statusCheckOption?.data || [];
  const initialData = fetchResult?.initialData?.data || {};
  const {
    resultCertificate,
    resultDrawing,
    resultProductRegItemOption,
    resultSdpackage,
    resultSpec,
    resultfoam,
  } = fetchResult?.productRegisterOption?.data || {};

  const optionsMap = useMemo(() => {
    const matOptions = (m_mat_data || [])
      .filter((item) => item.component && /SEMI/i.test(item.component))
      .map((item) => ({
        value: item.mat_id,
        label: `${item.erp} - ${item.component}`,
      }));

    const productTypeOptions = (resultProductRegItemOption || [])
      .filter((item) => item.component && /productOption/i.test(item.component))
      .map((item) => ({
        value: item.option_header,
        label: `${item.option_header} - ${item.component}`,
      }));

    const drawingOptions = (resultDrawing || [])
      .filter((item) => item.check_status === 3)
      .map((item) => ({
        value: item.drawing_header_id,
        label: `${item.compact_no}`,
      }));

    const specOptions = (resultSpec || [])
      .filter((item) => item.status_check_id === 3)
      .map((item) => ({
        value: item.spec_header_id,
        label: `${item.spec_code}`,
      }));

    const sdPackagingOptions = (resultSdpackage || [])
      .filter((item) => item.check_status === 3)
      .map((item) => ({
        value: item.sdpackaging_header_id,
        label: `${item.sdpackaing_code}`, // NOTE: kept typo from your code in case API matches this
      }));

    const status_check_Options = (status_check_id_data || []).map((item) => ({
      value: item.status_check_id,
      label: `${item.label} - ${item.status_check_id}`,
    }));

    const status_Options = (m_status_data || []).map((item) => ({
      value: item.document_status_option_id,
      label: `${item.label} - ${item.document_status_option_id}`,
    }));

    // Safely mapping the Set to remove duplicates
    const optional_Options = [
      ...new Map(
        (resultProductRegItemOption || []).map((item) => [item.component, item])
      ).values(),
    ]
      .filter((item) => item.component && !/productOption/i.test(item.component))
      .map((item) => ({
        value: item.component,
        label: `${item.component} - ${item.component_label}`,
      }));

    // Fixed duplicated declaration and ensured safe mapping
    const detail_Options = (resultProductRegItemOption || [])
      .filter((item) => item?.component && !/productOption/i.test(item.component))
      .map((item) => ({
        value: item?.option_header,
        label: `${item?.option_header} - ${item?.component_label}`,
      }));

    return {
      semi_mat_id: matOptions,
      status_check_id: status_check_Options,
      status_id: status_Options,
      drawing_id: drawingOptions,
      spec_id: specOptions,
      certificate_id: (resultCertificate || []).map((item) => ({
        value: item.certificate_id,
        label: `${item.compact_no}- ${item.formulation} - ${item.aproval_code}`, // NOTE: kept typo from your code in case API matches this
      })),
      sdpackaging_id: sdPackagingOptions,
      additional_form_id: (resultfoam || []).map((item) => ({
        value: item.foam_header_id,
        label: `${item.part_no}`,
      })),
      production_type: productTypeOptions,
      option_header: optional_Options,
      detail: detail_Options,
    };
  }, [fetchResult]); // <-- CHANGED: Depending on fetchResult ensures options populate when data finishes fetching

  const handleCreate = async (payload) => {
    console.log("Submitting payload:", payload);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/product-register/putSingle`, // NOTE: Ensure this matches the intended product-register endpoint
        method: "POST",
        data: [payload],
      });

      if (result?.success) {
         message.success(result?.data?.msg || "Create success");
         setTimeout(() => {
            navigateWithHighlight({
              navigate,
              path: "/app2/product-register/FG-Register",
              ids: [id],
              idField: "product_reg_id",
            })
        }, 2000); // 2 seconds
      } else {
        message.error(mutationError || "Create failed");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  if (fetchLoading) return <div>Loading System Configuration...</div>;
  if (error) return <div>Error loading configuration.</div>;

  const hasFields = Object.keys(columnDefsObj).length > 0;

  return (
    <div style={{ margin: "0 auto", padding: "20px" }}>
      <h2>Update Product Registration</h2>
      {hasFields ? (
        <DynamicForm
          groupedFields={columnDefsObj}
          initialValues={initialData}
          optionMap={optionsMap}
          onSubmit={handleCreate}
          submitText="Submit Registration"
          loading={mutationLoading}
          onCancel={() =>
            navigateWithHighlight({
                navigate,
                path: "/app2/product-register/FG-Register",
                ids: [id],
                idField: "product_reg_id",
              })
            }
        />
      ) : (
        <div>Loading form schema...</div>
      )}
    </div>
  );
};

export default PutSingleProductReg;