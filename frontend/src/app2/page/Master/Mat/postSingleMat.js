import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import { createColumnDefs } from "../../../utility/ObjectArrayUltility";
import DynamicForm from "./DynamicForm";

const PostSinglemat = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();

  const endpoints = useMemo(
    () => ({
      mat: `${baseURL}/app2/m_mat/18`,
      mat_cat: `${baseURL}/app2/m_mat/mat/cat/1`,
      mat_file: `${baseURL}/app2/m_mat/mat/file/1`,
      mat_unit: `${baseURL}/app2/m_mat/mat/unit/101`,
      mat_dimension: `${baseURL}/app2/m_mat/mat/dimension/1`,
      mat_cat_option: `${baseURL}/app2/option/m_component`,
      statusCheckOption: `${baseURL}/app2/option/m_statusCheck`,

    }),
    []
  );

  const { data, loading, error } = useFetchMultiple(endpoints);

  const matColumn = useMemo(() => {
    const source = data?.mat?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], required: true, type: "text" };
    if (cols[4]) cols[4] = { ...cols[4],headerName:"status_check", required: true,option: true};
    // if (cols[5]) cols[5] = { ...cols[5], required: false , type: "text" };


    return cols;
  }, [data?.mat?.data]);
  console.log("matColumn", matColumn);
  const matFileColumn = useMemo(() => {
    const source = data?.mat_file?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], hidden: true };

    return cols;
  }, [data?.mat_file?.data]);

  const matCatColumn = useMemo(() => {
    const source = data?.mat_cat?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], hidden: true };
    if (cols[2]) cols[2] = { ...cols[2], option: true, required: true };

    return cols;
  }, [data?.mat_cat?.data]);

  const matUnitColumn = useMemo(() => {
    const source = data?.mat_unit?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], hidden: true };

    return cols;
  }, [data?.mat_unit?.data]);

  const matDimensionColumn = useMemo(() => {
    const source = data?.mat_dimension?.data || [];
    const cols = [...createColumnDefs(source)];

    if (cols[0]) cols[0] = { ...cols[0], hidden: true };
    if (cols[1]) cols[1] = { ...cols[1], hidden: true };

    return cols;
  }, [data?.mat_dimension?.data]);

  const column = {
    matColumn,
    matCatColumn,
    matUnitColumn,
    matDimensionColumn,
    matFileColumn,
  };

  const optionsMap = useMemo(
    () => ({
      mat_cat:
        data?.mat_cat_option?.data?.map((item) => ({
          value: `${item.component}`,
          label: `${item.component_label} - ${item.unit}`,
        })) || [],
      status_check_id:
        data?.statusCheckOption?.data?.map((item) => ({
          value: item.status_check_id,
          label: item.label,
      })) || [],
    }),
    [data]
  );

  const handleCreate = async (values) => {
    try {
      const formData = new FormData();

      formData.append("mat", JSON.stringify(values.mat || {}));
      formData.append("mat_cat", JSON.stringify(values.mat_cat || []));
      formData.append("mat_unit", JSON.stringify(values.mat_unit || []));
      formData.append("mat_dimension", JSON.stringify(values.mat_dimension || []));

      if (values.file instanceof File) {
        formData.append("file", values.file);
      }
      console.log("formData before submit", formData);
      const result = await mutate({
        url: `${baseURL}/app2/m_mat/postSingle`,
        method: "POST",
        data: formData,
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Create success");
        navigate(-1);
      } else {
        message.error(result?.data?.msg || mutationError || "Create failed");
      }
    } catch (err) {
      message.error(mutationError || "Create failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading form data</div>;

  return (
    <DynamicForm
      mode="create"
      tableName="Material"
      column={column}
      initialValues={{
        mat: {status_check_id: 1, revision : "REV. 00"},
        mat_cat: [],
        mat_unit: [],
        mat_dimension: [],
        file: null,
      }}
      optionsMap={optionsMap}
      loading={loading || mutationLoading}
      onSubmit={handleCreate}
      onCancel={() => navigate(-1)}
    />
  );
};

export default PostSinglemat;