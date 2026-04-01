import React from "react";
import { Button, Col, Divider, Form, Input, Row, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/auth";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  async function onFinish(values) {
    try {
      const response = await resetPassword(token, values);

      message.success(response?.data?.message || "Mot de passe réinitialisé");
      form.resetFields();
      navigate("/login");
    } catch (error) {
      message.error(error.message || "Erreur lors de la réinitialisation");
    }
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col
          xs={22}
          sm={16}
          md={10}
          lg={8}
          xl={6}
          style={{
            borderRadius: "13px",
            backgroundColor: "#FAFAFA",
            padding: 24,
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <Divider>Reset Password</Divider>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Password"
              name="newPassword"
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "Password must be at least 8 chars" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmNewPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Confirm Password is required" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Button type="primary" htmlType="submit">
                Reset
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default ResetPassword;