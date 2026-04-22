import { useContext } from "react";
import { App as AntApp, Button, Card, Col, Divider, Form, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { loginUser } from "../../api/auth";
import loginImage from "../../assets/login.jpg";
function Login() {
  const { message } = AntApp.useApp();
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  async function onFinish(values) {
    try {
      const response = await loginUser(values);
      setToken(response.data.token);
      message.success(response.data.message);
      navigate("/");
    } catch (error) {
      const data = error?.response?.data;
      const fieldErrors = data?.errors?.fieldErrors || {};
      const firstFieldError = Object.values(fieldErrors)?.flat?.()?.[0];

      message.error(firstFieldError || data?.message || "Email ou mot de passe invalide");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Row gutter={0}>
          <Col xs={0} md={12}>
            <div
              style={{
                height: "100%",
                minHeight: 550,
                backgroundImage: `url(${loginImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.25)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 30,
                  color: "#fff",
                }}
              >
                <div>
                  <h2 style={{ color: "#fff", marginBottom: 8 }}>Bienvenue</h2>
                  <p style={{ margin: 0 }}>
                    Connectez-vous pour accéder à votre espace.
                  </p>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                minHeight: 550,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 32,
                backgroundColor: "#FAFAFA",
              }}
            >
              <div style={{ width: "100%", maxWidth: 360 }}>
                <Divider titlePlacement="center">Login</Divider>

                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Email required" },
                      { type: "email", message: "Enter a valid email" },
                    ]}
                  >
                    <Input placeholder="Enter your email" autoComplete="email" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: "Password required" },
                      { min: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
                    ]}
                  >
                    <Input.Password placeholder="Enter your password" autoComplete="current-password" />
                  </Form.Item>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <Link to="/forgot-password">Forgot Password?</Link>

                    <Button type="primary" htmlType="submit" block>
                      Login
                    </Button>
                  </div>
                  <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link to="/signup">Créer un compte</Link>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default Login;