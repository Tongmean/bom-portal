import React, { useMemo, useState } from "react";
import { Tabs, Badge } from "antd";
import { Button, Space, message } from "antd";
import useFetch from "../../hook/useFetch";
import { baseURL } from "../../../utility/apiClient";

import {
  pivotDrawningData,
  createColumnDefs,
} from "../../utility/engineeingUltility";

import EngineeringpartDetail from "./EngineeringpartDetail";
const TAB_STATUS = [
  "Approve",
  "Wait",
  "Review",
  "Reject",
];

const Engineeringpart = () => {
  const [activeTab, setActiveTab] = useState("Approve");

  const { data, loading, error } = useFetch(
    `${baseURL}/app2/engineering`
  );
  // console.log("data", data)
  /**
   * Pivot Data
   */
  const pivotResult = useMemo(() => {
    return pivotDrawningData(data?.data || [],  [
      "drawing_header_id",
      "compact_no",
      "part_no",
      "drawing_no",
      "status",
      "revision",
      "remark",
      "check_status",
    ]
  );
  }, [data]);
  // console.log("pivotResult", pivotResult)
  /**
   * Dynamic Columns
   */
  const columnDefs = useMemo(() => {
    return createColumnDefs(pivotResult);
  }, [pivotResult]);
  // console.log("columnDefs", columnDefs)
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
        <EngineeringpartDetail
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

export default Engineeringpart;