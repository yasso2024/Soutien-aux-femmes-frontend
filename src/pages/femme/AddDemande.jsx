import {
  App as AntApp,
  Button,
  Divider,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { createDemande } from "../../api/demandes";
import { Link, useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const AddDemande = () => {
  const { message } = AntApp.useApp();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await createDemande(values);
      message.success(response.data?.message || "Demande créée avec succès");
      navigate("/femme/demandes");
    } catch (error) {
      message.error(error.message || "Erreur lors de la création");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff0f6, #f9fbff)",
        padding: "24px",
      }}
    >
      <Row justify="center">
        <Col xs={24} md={22} lg={18} xl={16}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
            styles={{ body: { padding: 0 } }}
          >
            <Row gutter={0}>
              <Col xs={24} md={10}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYjsneqqL-aWVdLckrTtPgMY5-EiBkISb3DQ&s"
                  alt="Demande d'aide"
                  style={{
                    width: "100%",
                    height: 620,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Col>

              <Col xs={24} md={14}>
                <div style={{ padding: "32px" }}>
                  <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    <Link
                      to="/femme/dashboard"
                      style={{
                        color: "#d81b60",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <ArrowLeftOutlined />
                      Retour
                    </Link>

                    <div>
                      <Title level={2} style={{ marginBottom: 8 }}>
                        Nouvelle demande
                      </Title>
                      <Paragraph style={{ color: "#666", marginBottom: 0 }}>
                        Décrivez votre besoin afin de permettre à la communauté
                        de mieux comprendre comment vous aider.
                      </Paragraph>
                    </div>

                    <Divider style={{ margin: "8px 0 0" }} />

                    <Form layout="vertical" onFinish={onFinish}>
                      <Form.Item
                        label="Titre"
                        name="titre"
                        rules={[{ required: true, message: "Titre obligatoire" }]}
                      >
                        <Input placeholder="Ex: Aide pour traitement" />
                      </Form.Item>

                      <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: "Type obligatoire" }]}
                      >
                        <Select
                          placeholder="Choisir un type"
                          options={[
                            { value: "FINANCIERE", label: "Financière" },
                            { value: "MATERIELLE", label: "Matérielle" },
                            { value: "ACCOMPAGNEMENT", label: "Accompagnement" },
                            { value: "MEDICALE", label: "Médicale" },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Description obligatoire" }]}
                      >
                        <Input.TextArea rows={5} placeholder="Décrivez votre besoin..." />
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                          Enregistrer
                        </Button>
                      </Form.Item>
                    </Form>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddDemande;