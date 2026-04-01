import { App, Button, Col, Form, Input, Row, Typography, Select, DatePicker, Card } from "antd";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../../api/auth";
import signupImage from "../../assets/femme.jpg";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const regions = ["Tunis", "Monastir", "Sousse", "Gafsa", "Medenine"];

function SignUp() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const disableTodayAndFuture = (current) => {
    return current && current >= dayjs().startOf("day");
  };

  async function onFinish(values) {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        telephone: values.telephone,
        password: values.password,
        confirmPassword: values.confirmPassword,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : undefined,
        region: values.region,
        role: values.role,
      };

      const response = await signUpUser(payload);

      message.success(response?.data?.message || "Inscription réussie");
      form.resetFields();
      navigate("/login");
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'inscription"
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 1000,
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
                minHeight: 650,
                backgroundImage: `url(${signupImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(236,127,167,0.45)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 40,
                  color: "#fff",
                }}
              >
                <h1 style={{ margin: 0, color: "#fff" }}>Bienvenue 💗</h1>
                <p style={{ marginTop: 8 }}>
                  Rejoignez la plateforme et créez votre compte.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div style={{ padding: 30 }}>
              <Title level={3}>Créer un compte</Title>
              <Paragraph>Remplissez vos informations</Paragraph>

              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      label="Prénom"
                      rules={[{ required: true, message: "Prénom requis" }]}
                    >
                      <Input autoComplete="given-name" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      label="Nom"
                      rules={[{ required: true, message: "Nom requis" }]}
                    >
                      <Input autoComplete="family-name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Email requis" },
                    { type: "email", message: "Email invalide" },
                  ]}
                >
                  <Input autoComplete="email" />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="telephone"
                      label="Téléphone"
                      rules={[{ required: true, message: "Téléphone requis" }]}
                    >
                      <Input autoComplete="tel" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="dob"
                      label="Date de naissance"
                      rules={[{ required: true, message: "Date requise" }]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        disabledDate={disableTodayAndFuture}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="region"
                      label="Région"
                      rules={[{ required: true, message: "Région requise" }]}
                    >
                      <Select placeholder="Choisir région">
                        {regions.map((region) => (
                          <Option key={region} value={region}>
                            {region}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="role"
                      label="Rôle"
                      rules={[{ required: true, message: "Rôle requis" }]}
                    >
                      <Select placeholder="Choisir un rôle">
                        <Option value="FEMME MALADE">Femme Malade</Option>
                        <Option value="BENEVOLE">Bénévole</Option>
                        <Option value="DONTEUR">Donateur</Option>
                        <Option value="ASSOCIATION">Association</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="password"
                      label="Mot de passe"
                      rules={[
                        { required: true, message: "Mot de passe requis" },
                        { min: 8, message: "Minimum 8 caractères" },
                      ]}
                    >
                      <Input.Password autoComplete="new-password" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="confirmPassword"
                      label="Confirmer"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Confirmation requise" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Les mots de passe ne correspondent pas")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password autoComplete="new-password" />
                    </Form.Item>
                  </Col>
                </Row>

                <Button type="primary" htmlType="submit" block size="large">
                  S'inscrire
                </Button>

                <div style={{ marginTop: 15, textAlign: "center" }}>
                  <Text>
                    Déjà inscrit ? <Link to="/login">Login</Link>
                  </Text>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default SignUp;