import React, { useContext } from "react";
import {
  Avatar, Button, Card, Col, Row, Statistic, Table, Tag, Typography,
} from "antd";
import {
  CheckOutlined, CloseOutlined, FileTextOutlined,
  TeamOutlined, UserOutlined, DollarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const { Title, Text } = Typography;
const RED = "#EF4444";

const statCards = [
  { title: "Utilisateurs", value: 128, icon: <UserOutlined />, color: RED },
  { title: "Demandes en attente", value: 23, icon: <FileTextOutlined />, color: "#F59E0B" },
  { title: "Dons ce mois", value: "8 400 TND", icon: <DollarOutlined />, color: "#10B981" },
  { title: "Actions solidaires", value: 14, icon: <TeamOutlined />, color: "#8B5CF6" },
];

const demandesColumns = [
  { title: "Bénéficiaire", dataIndex: "nom", key: "nom", render: v => <Text strong>{v}</Text> },
  { title: "Type", dataIndex: "type", key: "type", render: v => <Tag color="pink" style={{ borderRadius: 6 }}>{v}</Tag> },
  { title: "Date", dataIndex: "date", key: "date" },
  {
    title: "Statut", dataIndex: "statut", key: "statut",
    render: v => (
      <Tag
        color={{ EN_ATTENTE: "orange", VALIDEE: "green", REFUSEE: "red" }[v]}
        style={{ borderRadius: 6 }}
      >
        {v.replace("_", " ")}
      </Tag>
    ),
  },
  {
    title: "Actions", key: "actions",
    render: (_, row) => (
      <div style={{ display: "flex", gap: 6 }}>
        <Button size="small" icon={<CheckOutlined />} style={{ color: "#10B981", borderColor: "#10B981", borderRadius: 6 }}>
          Valider
        </Button>
        <Button size="small" icon={<CloseOutlined />} danger style={{ borderRadius: 6 }}>
          Refuser
        </Button>
      </div>
    ),
  },
];

const demandesData = [
  { key: 1, nom: "Fatima Ben Ali", type: "FINANCIERE", date: "26 Mar 2026", statut: "EN_ATTENTE" },
  { key: 2, nom: "Amal Khelifi", type: "MATERIELLE", date: "25 Mar 2026", statut: "EN_ATTENTE" },
  { key: 3, nom: "Sana Mansour", type: "ACCOMPAGNEMENT", date: "24 Mar 2026", statut: "VALIDEE" },
  { key: 4, nom: "Rania Trabelsi", type: "LOGEMENT", date: "23 Mar 2026", statut: "REFUSEE" },
  { key: 5, nom: "Meriem Chaari", type: "FINANCIERE", date: "22 Mar 2026", statut: "EN_ATTENTE" },
];

const usersRecents = [
  { nom: "Mehdi Arfaoui", role: "BENEVOLE", date: "28 Mar" },
  { nom: "Sara Belhaj", role: "FEMME MALADE", date: "27 Mar" },
  { nom: "Khalil Toumi", role: "DONTEUR", date: "26 Mar" },
  { nom: "Nadia Ferchichi", role: "ASSOCIATION", date: "25 Mar" },
];

const roleColor = {
  "FEMME MALADE": "#EC7FA7",
  BENEVOLE: "#8B5CF6",
  DONTEUR: "#F59E0B",
  ASSOCIATION: "#0F9488",
};

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
          borderRadius: 20, padding: "28px 36px", marginBottom: 28,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(239,68,68,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar size={72} icon={<UserOutlined />} style={{ background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.6)" }} />
          <div>
            <Title level={3} style={{ color: "#fff", margin: 0 }}>
              Tableau de bord Administrateur
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>
              Bienvenue, {user?.firstName || "Admin"} · {new Date().toLocaleDateString("fr-FR")}
            </Text>
          </div>
        </div>
        <Button
          size="large"
          onClick={() => navigate("/admin/utilisateurs")}
          style={{
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)",
            color: "#fff", borderRadius: 10, fontWeight: 600,
          }}
        >
          Gérer les utilisateurs
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {statCards.map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }} styles={{ body: { padding: 20 } }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Statistic
                  title={<span style={{ fontSize: 13, color: "#888" }}>{s.title}</span>}
                  value={s.value}
                  styles={{ content: { color: s.color, fontWeight: 700, fontSize: 26 } }}
                />
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: s.color }}>
                  {s.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]}>
        {/* Demandes récentes */}
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ fontWeight: 700 }}>Demandes à traiter</span>}
            extra={<Tag color="orange">23 en attente</Tag>}
            style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
          >
            <Table columns={demandesColumns} dataSource={demandesData} pagination={false} size="small" />
          </Card>
        </Col>

        {/* Nouveaux utilisateurs */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 700 }}>Nouveaux inscrits</span>}
            style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
          >
            {usersRecents.map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                <Avatar size={36} style={{ background: roleColor[u.role] || "#ccc" }}>{u.nom[0]}</Avatar>
                <div style={{ flex: 1 }}>
                  <Text strong style={{ display: "block", fontSize: 13 }}>{u.nom}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{u.date}</Text>
                </div>
                <Tag style={{ borderRadius: 6, fontSize: 10, color: roleColor[u.role], borderColor: roleColor[u.role] + "50", background: roleColor[u.role] + "12" }}>
                  {u.role}
                </Tag>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
