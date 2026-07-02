import React from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tag,
} from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function HomePage() {
  const navigate = useNavigate();

  const systems = [
    {
      key: "app1",
      title: "Disc Brake Pad",
      description:
        "Manage Bill of Material (BOM), raw materials, packaging, drawings, specifications, and related engineering documents for Disc Brake Pad products.",
      icon: (
        <img
          src="https://www.compact-brake.com/images/product/brakepads_NOLOGO.png"
          alt="Disc Brake Pad"
          style={{ width: 60, height: 60 }}
        />
      ),
      color: "#1677ff",
      href: "http://192.168.4.242:3001/Home",
      status: "Available",
      disabled: false,
    },
    {
      key: "app2",
      title: "Brake Lining (CPI)",
      description:
        "Bill of Material (BOM) management module for Brake Lining products. This application is currently under development.",
      icon: (
        <img
          src="https://www.compact-brake.com/images/product/brake%20lining.png"
          alt="Brake Lining"
          style={{ width: 60, height: 60 }}
        />
      ),
      color: "#52c41a",
      path: "/app2/home",
      status: "Under Development",
      disabled: false,
    },
    {
      key: "app3",
      title: "Brake Lining (ACI)",
      description:
        "Bill of Material (BOM) management module for Brake Lining products. This application is currently under development.",
      icon: (
        <img
          src="https://www.compact-brake.com/images/product/brake%20lining.png"
          alt="Brake Lining"
          style={{ width: 60, height: 60 }}
        />
      ),
      color: "#52c41a",
      path: "/app2",
      status: "Under Development",
      disabled: true,
    },
    {
      key: "app4",
      title: "Brake Shoe",
      description:
        "Bill of Material (BOM) management module for Brake Shoe products. This application is currently under development.",
      icon: (
        <img
          src="https://www.compact-brake.com/images/product/brake%20shoe.png"
          alt="Brake Shoe"
          style={{ width: 60, height: 60 }}
        />
      ),
      color: "#fa8c16",
      path: "/app3",
      status: "Under Development",
      disabled: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          background: "#001529",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <ToolOutlined /> Compact BOM Management System
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 14,
          }}
        >
          Compact Manufacturing Co., Ltd.
        </div>
      </Header>

      {/* Content */}
      <Content
        style={{
          padding: "50px 24px",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 50,
          }}
        >
          <Title level={1}>Bill of Material Applications</Title>

          <Paragraph
            style={{
              fontSize: 16,
              color: "#666",
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            Select a product group to manage Bill of Materials (BOM),
            raw materials, packaging materials, drawings, specifications,
            and related engineering documents.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]} justify="center">
          {systems.map((system) => (
            <Col xs={24} sm={12} lg={8} key={system.key}>
              <Card
                hoverable={!system.disabled}
                style={{
                  height: "100%",
                  borderRadius: 12,
                  opacity: system.disabled ? 0.85 : 1,
                }}
                styles={{
                  body: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    minHeight: 360,
                  },
                }}
              >
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    background: `${system.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  {system.icon}
                </div>

                <Title level={3}>{system.title}</Title>

                <Tag color={system.disabled ? "orange" : "success"}>
                  {system.status}
                </Tag>

                <Paragraph
                  style={{
                    marginTop: 20,
                    flexGrow: 1,
                    color: "#666",
                  }}
                >
                  {system.description}
                </Paragraph>

                <Button
                  type="primary"
                  size="large"
                  disabled={system.disabled}
                  onClick={() => {
                    if (system.href) {
                      window.location.href = system.href;
                    } else if (system.path) {
                      navigate(system.path);
                    }
                  }}
                >
                  {system.disabled
                    ? "Under Development"
                    : "Open BOM System"}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      {/* Footer */}
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Compact BOM Management System
      </Footer>
    </Layout>
  );
}