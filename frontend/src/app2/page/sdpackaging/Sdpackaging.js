import React, { useMemo, useState } from "react";
import { Tabs, Badge } from "antd";
import useFetch from "../../hook/useFetch";
import { baseURL } from "../../../utility/apiClient";

import {
  pivotPackagingData,
  createColumnDefs,
} from "../../utility/SdpackagingUltility";

import SdpackagingDetail from "./SdpackagingDetail";

const TAB_STATUS = [
  "Approve",
  "Wait",
  "Review",
  "Reject",
];

const Sdpackaging = () => {
  const [activeTab, setActiveTab] = useState("Approve");

  const { data, loading, error } = useFetch(
    `${baseURL}/app2/sdpackaging`
  );
  console.log("data",data)

  /**
   * Pivot Data
   */
  const pivotResult = useMemo(() => {
    return pivotPackagingData(data?.data || [],  [
      "sdpackaging_header_id",
      "sdpackaing_code",
      "revision",
      "remark",
      "check_status",
    ]
  );
  }, [data]);

  /**
   * Dynamic Columns
   */
  const columnDefs = useMemo(() => {
    return createColumnDefs(pivotResult);
  }, [pivotResult]);

  /**
   * Count by Status
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
        <SdpackagingDetail
          data={rowData}
          columnDefs={columnDefs}
        />
      ),
    }));
  }, [statusCounts, rowData, columnDefs]);

  if (loading) {
    return <p>Loading...</p>;
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

export default Sdpackaging;