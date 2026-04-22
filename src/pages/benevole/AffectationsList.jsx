import { App as AntApp, Button, Form, Modal, Popconfirm, Select, Space, Table, Tag, Card, Input, Typography, Avatar } from "antd";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  confirmerParticipation,
  createAffectation,
  deleteAffectation,
  listAffectations,
} from "../../api/affectations";
import { listActionsSolidaires } from "../../api/actionSolidaires";
import { listDemandes } from "../../api/demandes";
import { CheckOutlined, CloseOutlined, PlusOutlined, SearchOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const PURPLE = "#8B5CF6";
const STATUT_LABELS = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  TERMINEE: "Terminée",
};

const AffectationsList = () => {
  const { message } = AntApp.useApp();
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useContext(AuthContext);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actions, setActions] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await listAffectations();
      const data =
        response?.data?.affectations || response?.data?.data || response?.data || [];
      setAffectations(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(error.message || "Erreur lors du chargement");
      setAffectations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmer = async (id) => {
    try {
      const response = await confirmerParticipation(id);
      message.success(response.data?.message || "Participation confirmée");
      fetchData();
    } catch (error) {
      message.error(error.message || "Erreur lors de la confirmation");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteAffectation(id);
      message.success(response.data?.message || "Affectation supprimée");
      fetchData();
    } catch (error) {
      message.error(error.message || "Erreur lors de la suppression");
    }
  };

  const openModal = async () => {
    try {
      const res = await listActionsSolidaires();
      const data = Array.isArray(res?.data?.actions) ? res.data.actions
        : Array.isArray(res?.data) ? res.data : [];
      // Only show VALIDEE actions
      setActions(data.filter((a) => !a.statut || a.statut === "VALIDEE" || a.statut === "EN_ATTENTE"));
    } catch {
      setActions([]);
    }
    try {
      const resDem = await listDemandes();
      const allDem = Array.isArray(resDem?.data?.demandes) ? resDem.data.demandes : [];
      setDemandes(allDem.filter((d) => d.statut !== "REFUSEE" && d.statut !== "TERMINEE"));
    } catch {
      setDemandes([]);
    }
    form.resetFields();
    setModalOpen(true);
  };

  const handleCreate = async (values) => {
    try {
      setSubmitting(true);
      const payload = { benevole: user._id, action: values.action };
      if (values.demande) {
        payload.demande = values.demande;
        // Also send femme so backend can store direct link
        const selectedDemande = demandes.find((d) => d._id === values.demande);
        const femmeId = selectedDemande?.femme?._id || selectedDemande?.femme;
        if (femmeId) payload.femme = femmeId;
      }
      await createAffectation(payload);
      message.success("Affectation créée avec succès");
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error.message || "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = affectations.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.benevole?.firstName?.toLowerCase().includes(q) ||
      a.benevole?.lastName?.toLowerCase().includes(q) ||
      a.action?.titre?.toLowerCase().includes(q) ||
      a.demande?.titre?.toLowerCase().includes(q) ||
      a.demande?.description?.toLowerCase().includes(q) ||
      a.statut?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      title: "Bénévole",
      key: "benevole",
      render: (_, record) =>
        record.benevole ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar
              size={36}
              style={{ background: PURPLE + "22", color: PURPLE, flexShrink: 0, fontWeight: 700 }}
            >
              {(record.benevole.firstName || record.benevole.lastName)?.[0]}
            </Avatar>
            <div>
              <Text strong style={{ display: "block", fontSize: 13 }}>
                {`${record.benevole.firstName || ""} ${record.benevole.lastName || ""}`.trim()}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {record.benevole.email}
              </Text>
            </div>
          </div>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Action solidaire",
      key: "action",
      render: (_, record) =>
        record.action ? (
          <div>
            <Text strong style={{ display: "block", fontSize: 13 }}>
              {record.action.titre}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.action.dateAction
                ? new Date(record.action.dateAction).toLocaleDateString("fr-FR")
                : "-"}
            </Text>
          </div>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Demande d'aide",
      key: "demande",
      render: (_, record) =>
        record.demande ? (
          <div>
            <Text strong style={{ display: "block", fontSize: 13 }}>
              {record.demande.titre || "Demande d'aide"}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.demande.type || "Type non précisé"}
            </Text>
          </div>
        ) : (
          <Text type="secondary">Aucune demande liée</Text>
        ),
    },
    {
      title: "Date d'affectation",
      dataIndex: "dateAffectation",
      key: "dateAffectation",
      render: (value) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
      sorter: (a, b) => new Date(a.dateAffectation) - new Date(b.dateAffectation),
      defaultSortOrder: "descend",
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (statut) => {
        const colorMap = {
          EN_ATTENTE: "orange",
          ACCEPTEE: "green",
          TERMINEE: "blue",
        };
        return (
          <Tag color={colorMap[statut] || "default"} style={{ borderRadius: 6 }}>
            {STATUT_LABELS[statut] || statut || "-"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size={6}>
          {(user?.role === "ADMINISTRATEUR" || user?.role === "BENEVOLE") &&
            record.statut === "EN_ATTENTE" && (
            <Popconfirm
              title="Confirmer cette participation ?"
              onConfirm={() => handleConfirmer(record._id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                size="small"
                icon={<CheckOutlined />}
                style={{ color: "#10B981", borderColor: "#10B981" }}
              >
                Confirmer
              </Button>
            </Popconfirm>
          )}

          {user?.role === "ADMINISTRATEUR" && (
            <Popconfirm
              title="Supprimer cette affectation ?"
              onConfirm={() => handleDelete(record._id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
              >
                Supprimer
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
          borderRadius: 20,
          padding: "24px 32px",
          marginBottom: 24,
          boxShadow: "0 8px 32px #8B5CF640",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Avatar
          size={56}
          icon={<FileTextOutlined />}
          style={{ background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.6)" }}
        />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Mes affectations
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            {affectations.length} affectation{affectations.length !== 1 ? "s" : ""} pour suivre mes demandes d'aide et missions terrain
          </Text>
        </div>
        {user?.role === "BENEVOLE" && (
          <Button
            icon={<PlusOutlined />}
            onClick={openModal}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.5)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Nouvelle affectation
          </Button>
        )}
      </div>

      <Card
        style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#aaa" }} />}
            placeholder="Rechercher par nom, action, demande ou statut…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 420, borderRadius: 8 }}
            allowClear
          />
        </div>
        <Table
          rowKey={(record) => record._id || record.id}
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="small"
          style={{ padding: "0 8px" }}
        />
      </Card>

      {/* Modal création affectation */}
      <Modal
        title="Nouvelle affectation"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        footer={null}
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="action"
            label="Action solidaire"
            rules={[{ required: true, message: "Veuillez choisir une action" }]}
          >
            <Select
              placeholder="Sélectionner une action solidaire"
              showSearch
              optionFilterProp="label"
              options={actions.map((a) => ({
                value: a._id,
                label: `${a.titre} — ${a.dateAction ? new Date(a.dateAction).toLocaleDateString("fr-FR") : "Date N/A"}`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="demande"
            label="Demande d'aide concernée"
            rules={[{ required: true, message: "Veuillez choisir une demande" }]}
          >
            <Select
              placeholder="Sélectionner une demande d'aide"
              showSearch
              allowClear
              optionFilterProp="label"
              options={demandes.map((d) => ({
                value: d._id,
                label: `${d.titre || d.description || d._id}${
                  d.femme ? ` — ${d.femme.firstName || ""} ${d.femme.lastName || ""}`.trim() : ""
                }`,
              }))}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ background: "#8B5CF6", borderColor: "#8B5CF6" }}
              >
                Créer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AffectationsList;