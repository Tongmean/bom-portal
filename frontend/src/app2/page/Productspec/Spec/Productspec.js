import React, { useMemo, useState } from "react";
import { Tabs, Badge, Button, Space, message } from "antd";
import useFetch from '../../../../hook/useFetch';
import { baseURL } from "../../../../utility/apiClient";
import LoadingSpin from '../../../component/LoadingSpin';
import useFakeLoading from '../../../utility/useFakeLoading';
import ProductspecDetail from "./ProductspecDetail";

const TAB_STATUS = [
  "Approve",
  "Wait",
  "Review",
  "Reject",
];

const Spec = () => {
  const [activeTab, setActiveTab] = useState("Approve");

  const { data, loading, error } = useFetch(
    `${baseURL}/app2/spec`
  );
  
  const percent = useFakeLoading(loading);

  // FIX: Uncommented this line, changed 'data1' to 'data', 
  // and added default empty arrays to prevent `.reduce()` and `.filter()` from crashing
  const { columnDefs = [], data: pivotResult = [] } = data || {};

  /**
   * Dynamic Columns
   */
  const statusCounts = useMemo(() => {
    return pivotResult.reduce((acc, row) => {
      const status = row.check_status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [pivotResult]);

  /**
   * Current Tab Data
   */
  const rowData = useMemo(() => {
    return pivotResult.filter(
      row => row.check_status === activeTab
    );
  }, [pivotResult, activeTab]);

  /**
   * Tabs
   */
  const items = useMemo(() => {
    return TAB_STATUS.map(status => ({
      key: status,
      label: (
        <Badge
          count={statusCounts[status] || 0}
          overflowCount={9999}
          size="small"
        >
          <span style={{ paddingRight: 12 }}>
            {status}
          </span>
        </Badge>
      ),
      children: (
        <ProductspecDetail
          data={rowData}
          columnDefs={columnDefs}
        />
      ),
    }));
  }, [statusCounts, rowData, columnDefs]);

  if (loading) {
      return (
          <div>
              <LoadingSpin
                  loading={loading}
                  percent={percent}
              />
          </div>
      );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ padding: 16 }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </div>
  );
};

export default Spec;