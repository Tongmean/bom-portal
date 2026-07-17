import React, { useState } from "react";
import { Modal, Table, Button, message } from "antd";
import useMutation from "../../../hook/useMutation";
import {baseURL} from "../../../../utility/apiClient";

const DeleteModal = ({
  open,
  onClose,
  selectedRows = [],
  onPostSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation();

  const handleDelete = async () => {
    try {
      setLoading(true);

      const data = selectedRows
      console.log("data", data)
      const result  = await mutate({
        method: "post",
        url: `${baseURL}/app2/m_mat/deleteArray`,
        data: data
        
      });
      console.log("result", result)
      message.success(result.data.msg);


      if (result) {
          onPostSuccess?.();
          onClose();
      }
    } catch (error) {
      console.error(error);
      message.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const columns = [

    {
      title: "mat_id",
      dataIndex: "mat_id",
      // render: (value) => Number(value).toFixed(9),
    },
    {
      title: "erp",
      dataIndex: "erp",
    },
    {
      title: "name",
      dataIndex: "name",
    },
  ];

  return (
    <Modal
      open={open}
      title="Confirm Delete"
      footer={null}
      onCancel={onClose}
      width={700}
    >
      <p>
        Are you sure you want to delete{" "}
        <strong>{selectedRows.length}</strong> item(s)?
      </p>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={selectedRows}
        pagination={false}
      />

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          type="primary"
          danger
          loading={loading}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;