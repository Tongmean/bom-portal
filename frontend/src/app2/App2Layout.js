import React, { useState } from "react";
import {
  ReloadOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  ExceptionOutlined,
  FieldTimeOutlined,
  // FileExcelOutlined,
  // FileExclamationOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Space } from "antd";
import { Link, Outlet } from "react-router-dom";
import { useAuthContext } from "../Auth/useAuthContext";
import TokenCountdown from "./utility/TokenCountdown";

const { Header, Sider, Content } = Layout;

export default function App2Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear(); // or remove token only
    navigate("/login");
  };
  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/app2/home">Home</Link>,
    },

    {
      key: "Display",
      icon: <ExceptionOutlined />,
      label: "Display",
      children: [
        {
          key: "Display-1",
          label: <Link to="display/bomdisplay">Bill of Material</Link>,
        },
       
      ],
    },
    {
      key: "mater_data",
      icon: <ExceptionOutlined />,
      label: "Master Data",
      children: [
        {
          key: "mater_data-1",
          label: <Link to="app2/master/enitity">M_entity</Link>,
        },
        {
          key: "mater_data-2",
          label: <Link to="master/mat">M_mat</Link>,
        },
       
      ],
    },
    // {
    //   key: "3",
    //   icon: <ExceptionOutlined />,
    //   label: <Link to="/product-register">product-register</Link>,
    // },
    // {
    //   key: "product-spec",
    //   icon: <ExceptionOutlined />,
    //   label: <Link to="/product-spec">product-spec</Link>,
    // },
    {
      key: "product-spec",
      icon: <ExceptionOutlined />,
      label: "product-spec",
      children: [
        {
          key: "product-spec-1",
          label: <Link to="/app2/product-spec/Customer">Customer</Link>,
        },
        {
          key: "product-spec-2",
          label: <Link to="/app2/product-spec/product-spec">product-spec</Link>,
        },
       
      ],
    },
    // {
    //   key: "engineering",
    //   icon: <ExceptionOutlined />,
    //   label: "Engineering",
    //   children: [
    //     {
    //       key: "engineering-1",
    //       label: <Link to="/engineering/drawing">Drawing</Link>,
    //     },
    //     {
    //       key: "engineering-2",
    //       label: <Link to="/engineering/revit">Revit</Link>,
    //     },
       
    //   ],
    // },
    {
      key: "Data-sheet",
      icon: <ExceptionOutlined />,
      label: "product-Register",
      children: [
        {
          key: "product-Register-1",
          label: <Link to="/app2/Datasheet/WIP-Register">WIP-Register</Link>,
        },
        {
          key: "product-Register-2",
          label: <Link to="/app2/product-register/semifg-Register">SEMI-FG-Register</Link>,
        },
        {
          key: "product-Register-3",
          label: <Link to="/app2/product-Register/FG-Register">FG-Register</Link>,
        },
      ],
    },

    {
      key: "certificate",
      icon: <ExceptionOutlined />,
      label: <Link to="/app2/certificate">certificate</Link>,
    },
    


    {
      key: "sdPackaging",
      icon: <ExceptionOutlined />,
      label: "SD-Packaging",
      children: [
        {
          key: "sdPackaging-1",
          label: <Link to="/app2/sdPackaging/packaging">SD-Packaging</Link>,
        },
        {
          key: "sdPackaging-2",
          label: <Link to="/sdPackaging/innerbox">Inner Box</Link>,
        },
      ],
    },
    {
      key: "engineering-part",
      icon: <ExceptionOutlined />,
      label: "Engineering-Part",
      children: [
        {
          key: "engineering-part-1",
          label: <Link to="/app2/engineering/drawing">Drawing</Link>,
        },
        {
          key: "engineering-part-2",
          label: <Link to="/app2/engineering/drawingfile">Drawing File</Link>,
        },
      ],
    },
    {
      key: "additionalFaom",
      icon: <ExceptionOutlined />,
      label: <Link to="/app2/additionalFaom">Additional-Faom</Link>,
    },
    {
      key: "process",
      icon: <ExceptionOutlined />,
      label: "Process-Routing",
      children: [
        {
          key: "Routing Order",
          label: <Link to="/app2/process/routing-order">Routing Order</Link>,
        },
        {
          key: "Routing Order tooling",
          label: <Link to="/app2/process/routing-order-tooling">Routing Order Tooling</Link>,
        },
      ],
    },
    {
      key: "User",
      icon: <ExceptionOutlined />,
      label: <Link to="/user">User-Management</Link>,
    },
   
  ];

  return (
        <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        {/* Logo Section */}
        <div
          style={{
            height: 64,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 8px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: collapsed ? "12px" : "16px",
              lineHeight: 1.2,
            }}
          >
            {collapsed ? "CB" : "Compact Brake"}
          </div>

          {!collapsed && (
            <div
              style={{
                opacity: 0.75,
                fontSize: "11px",
                marginTop: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              {user?.user?.email}
            </div>
          )}

          {collapsed && (
            <div
              style={{
                opacity: 0.75,
                fontSize: "10px",
                marginTop: 2,
              }}
            >
              {user?.user?.role}
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={items}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Space size="middle">
            <span>
                <h4>
                  <FieldTimeOutlined style={{ marginRight: 6 }} />
                  Token Expire:{" "}
                  <TokenCountdown token = {user?.user?.token}/>
                </h4>
            </span>
            <span>
              <UserOutlined style={{ marginRight: 6 }} />
              {user?.user?.email || "-"} ({user?.user?.role || "-"})
            </span>

            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>

            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 16,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}