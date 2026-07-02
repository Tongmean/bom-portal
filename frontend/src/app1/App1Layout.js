import React, { useState } from "react";
import {
  ReloadOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  ExceptionOutlined,
  FileExcelOutlined,
  FileExclamationOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Space } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Sider, Content } = Layout;

export default function App1Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
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
      label: <Link to="/home">Home</Link>,
    },

    {
      key: "Display",
      icon: <ExceptionOutlined />,
      label: "Display",
      children: [
        {
          key: "17",
          label: <Link to="/bomdisplay">Bill of Material</Link>,
        },
       
      ],
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
        <div
          style={{
            height: 64,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "CB" : "Compact Brake"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={items}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
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
              <UserOutlined /> Admin
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

        <Content
          style={{
            margin: 16,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}