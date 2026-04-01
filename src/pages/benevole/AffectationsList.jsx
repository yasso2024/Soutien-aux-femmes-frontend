import { App as AntApp, Button, Popconfirm, Space, Table, Tag, Card, Input, Typography, Avatar } from "antd";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  confirmerParticipation,
  deleteAffectation,
  listAffectations,
} from "../../api/affectations";
import { CheckOutlined, CloseOutlined, SearchOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const PURPLE = "#8B5CF6";

const AffectationsList = () => {
  const { message } = AntApp.useApp();
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useContext(AuthContext);

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

  const filtered = affectations.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.benevole?.firstName?.toLowerCase().includes(q) ||
      a.benevole?.lastName?.toLowerCase().includes(q) ||
      a.action?.titre?.toLowerCase().includes(q) ||
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
              {new Date(record.action.dateDebut).toLocaleDateString("fr-FR")}
            </Text>
          </div>
        ) : (
          <Text type="secondary">—</Text>
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
            {statut || "-"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size={6}>
          {user?.role === "ADMINISTRATEUR" && record.statut === "EN_ATTENTE" && (
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
        <div>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Mes affectations
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            {affectations.length} affectation{affectations.length !== 1 ? "s" : ""}
          </Text>
        </div>
      </div>

      <Card
        style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#aaa" }} />}
            placeholder="Rechercher par nom, action ou statut…"
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
    </div>
  );
};

export default AffectationsList;