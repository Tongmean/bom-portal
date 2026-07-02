import React, { useMemo, useState } from "react";
import { Tabs, Badge } from "antd";
import { Button, Space, message } from "antd";
import  useFetch  from '../../../../hook/useFetch';
import { baseURL } from "../../../../utility/apiClient";
import LoadingSpin from '../../../component/LoadingSpin';
import useFakeLoading from '../../../utility/useFakeLoading';
import {
  pivoProductspecData,
  createColumnDefs,
} from "../../../utility/productspecPivet";

import ProductspecDetail from "./ProductspecDetail";

const TAB_STATUS = [
  "Approve",
  "Wait",
  "Review",
  "Reject",
];

const Productspec = () => {
  const [activeTab, setActiveTab] = useState("Approve");

  const { data, loading, error } = useFetch(
    `${baseURL}/app2/productspec`
  );
  const percent = useFakeLoading(loading);
  // console.log("data",data)

  /**
   * Pivot Data
   */
  const pivotResult = useMemo(() => {
    return pivoProductspecData(data?.data || [],  [
      "productspec_header_id",
      "productspec_code",
      "sale_code",
      "channel",
      "customer_name",
      "nick_name",
      "formulation",
      "revit",
      "drill",
      "screen",
      "emark",
      "status",
      "remark",
      "revision",
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
        <ProductspecDetail
          data={rowData}
          columnDefs={columnDefs}
        />
      ),
    }));
  }, [statusCounts, rowData, columnDefs]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }
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

export default Productspec;