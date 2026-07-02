import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Modal,
  Space,
} from "antd";
import {
  DollarOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useLogin from './Auth/useLogin';

const { Title, Paragraph, Text } = Typography;

export default function LoginPage() {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { error, isLoading, login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const success = await login(values.email, values.password);

    if (!success) {
      setShowErrorModal(true);
    } else {
      navigate("/home");
    }
  };

  return (
    <>
      <Row style={{ minHeight: "100vh" }}>
        {/* LEFT PANEL */}
        <Col
          xs={0}
          md={12}
          style={{
            background: "linear-gradient(135deg, #1677ff 0%, #003eb3 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            padding: "48px",
          }}
        >
          <div
            style={{
              maxWidth: 500,
              textAlign: "center",
            }}
          >
            <DollarOutlined
              style={{
                fontSize: 80,
                marginBottom: 24,
              }}
            />

            <Title level={1} style={{ color: "#fff", marginBottom: 16 }}>
              Bill of Material Management System
            </Title>

            <Paragraph
              style={{
                color: "#e6f4ff",
                fontSize: 18,
              }}
            >
              Engineering Information
              {/* & Quotation Management */}
            </Paragraph>

            <Space
              direction="vertical"
              size="middle"
              style={{
                marginTop: 32,
                fontSize: 16,
              }}
            >
              <Text style={{ color: "#fff" }}>
                ✓ Material 
              </Text>

              <Text style={{ color: "#fff" }}>
                ✓ Process 
              </Text>

              <Text style={{ color: "#fff" }}>
                ✓ Packaging 
              </Text>

              <Text style={{ color: "#fff" }}>
                ✓ Bill of Material  Management
              </Text>
            </Space>
          </div>
        </Col>

        {/* RIGHT PANEL */}
        <Col
          xs={24}
          md={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f5f5",
            padding: 24,
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 450,
              borderRadius: 12,
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              <Title level={2}>Welcome Back</Title>

              <Text type="secondary">
                Sign in to access the Price Estimation System
              </Text>
            </div>

            <Form
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email",
                  },
                  {
                    type: "email",
                    message: "Invalid email format",
                  },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  // loading={isLoading}
                  block
                >
                  Login
                </Button>
              </Form.Item>
            </Form>

            <div
              style={{
                textAlign: "center",
                marginTop: 16,
              }}
            >
              <Text type="secondary">
                Price Estimation System ©{" "}
                {new Date().getFullYear()}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        open={showErrorModal}
        title="Login Failed"
        onCancel={() => setShowErrorModal(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setShowErrorModal(false)}
          >
            Close
          </Button>,
        ]}
      >
        {/* <p>{error || "Invalid email or password."}</p> */}
      </Modal>
    </>
  );
}