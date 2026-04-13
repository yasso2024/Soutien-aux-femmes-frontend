import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  App as AntApp, Avatar, Button, Card, Col, Row, Segmented, Statistic, Table, Tag, Typography,
} from "antd";
import {
  CheckOutlined, CloseOutlined, FileTextOutlined,
  TeamOutlined, UserOutlined, DollarOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { listUsers } from "../../api/users";
import { listDemandes, updateStatutDemande } from "../../api/demandes";
import { changePropositionAideStatus, listPropositionsAide } from "../../api/propositionsAide";
import { changeDonStatus, listDons } from "../../api/dons";
import { changeAffectationStatus, listAffectations } from "../../api/affectations";

const { Title, Text } = Typography;
const RED = "#EF4444";

const roleColor = {
  "FEMME MALADE": "#EC7FA7",
  BENEVOLE: "#8B5CF6",
  DONTEUR: "#F59E0B",
  DONATEUR: "#F59E0B",
  ASSOCIATION: "#0F9488",
  ADMINISTRATEUR: RED,
};

const STATUS_META = {
  EN_ATTENTE: { color: "orange", label: "En attente" },
  VALIDEE: { color: "green", label: "Validée" },
  REFUSEE: { color: "red", label: "Refusée" },
  EN_COURS: { color: "blue", label: "En cours" },
  TERMINEE: { color: "cyan", label: "Terminée" },
  PROPOSEE: { color: "gold", label: "Proposée" },
  ACCEPTEE: { color: "green", label: "Acceptée" },
  CONFIRME: { color: "green", label: "Confirmé" },
  REFUSE: { color: "red", label: "Refusé" },
};

function StatusTag({ value }) {
  const meta = STATUS_META[value] || { color: "default", label: value || "-" };
  return <Tag color={meta.color} style={{ borderRadius: 6 }}>{meta.label}</Tag>;
}

function ActionButtons({ actions, loading }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {actions.map((action) => (
        <Button
          key={action.key}
          size="small"
          icon={action.icon}
          onClick={action.onClick}
          loading={loading === action.key}
          style={action.style}
          danger={action.danger}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { message } = AntApp.useApp();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState("Demandes");
  const [actionLoading, setActionLoading] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    demandes: [],
    propositions: [],
    dons: [],
    affectations: [],
  });

  const formatDate = (value) => value ? new Date(value).toLocaleDateString("fr-FR") : "-";
  const formatDateTime = (value) => value ? new Date(value).toLocaleDateString("fr-FR") : "-";
  const formatCurrency = (value) => `${new Intl.NumberFormat("fr-FR").format(Number(value) || 0)} TND`;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, demandesRes, propositionsRes, donsRes, affectationsRes] = await Promise.all([
        listUsers(),
        listDemandes(),
        listPropositionsAide(),
        listDons(),
        listAffectations(),
      ]);

      setDashboardData({
        users: Array.isArray(usersRes?.data?.users) ? usersRes.data.users : Array.isArray(usersRes?.data) ? usersRes.data : [],
        demandes: Array.isArray(demandesRes?.data?.demandes) ? demandesRes.data.demandes : [],
        propositions: Array.isArray(propositionsRes?.data?.propositions) ? propositionsRes.data.propositions : [],
        dons: Array.isArray(donsRes?.data?.dons) ? donsRes.data.dons : [],
        affectations: Array.isArray(affectationsRes?.data?.affectations) ? affectationsRes.data.affectations : [],
      });
    } catch (error) {
      message.error(error.message || "Impossible de charger le tableau de bord administrateur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const pathToModule = {
      "/admin/dashboard": "Demandes",
      "/admin/demandes": "Demandes",
      "/admin/propositions-aide": "Propositions",
      "/admin/dons": "Dons",
      "/admin/affectations": "Affectations",
    };

    setActiveModule(pathToModule[location.pathname] || "Demandes");
  }, [location.pathname]);

  const handleStatusChange = async (entity, id, statut) => {
    const actionKey = `${entity}-${id}-${statut}`;
    try {
      setActionLoading(actionKey);

      if (entity === "demande") {
        await updateStatutDemande(id, statut);
      } else if (entity === "proposition") {
        await changePropositionAideStatus(id, statut);
      } else if (entity === "don") {
        await changeDonStatus(id, statut);
      } else if (entity === "affectation") {
        await changeAffectationStatus(id, statut);
      }

      message.success("Statut mis à jour avec succès");
      await fetchDashboardData();
    } catch (error) {
      message.error(error.message || "Erreur lors de la mise à jour du statut");
    } finally {
      setActionLoading(null);
    }
  };

  const stats = useMemo(() => {
    const pendingDemandes = dashboardData.demandes.filter((item) => item?.statut === "EN_ATTENTE").length;
    const donsMonth = dashboardData.dons
      .filter((item) => {
        const date = new Date(item?.createdAt || item?.dateDon);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, item) => sum + (Number(item?.montant) || 0), 0);

    return [
      { title: "Utilisateurs", value: dashboardData.users.length, icon: <UserOutlined />, color: RED },
      { title: "Demandes en attente", value: pendingDemandes, icon: <FileTextOutlined />, color: "#F59E0B" },
      { title: "Dons ce mois", value: formatCurrency(donsMonth), icon: <DollarOutlined />, color: "#10B981" },
      { title: "Affectations", value: dashboardData.affectations.length, icon: <TeamOutlined />, color: "#8B5CF6" },
    ];
  }, [dashboardData]);

  const recentUsers = useMemo(
    () => [...dashboardData.users].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)).slice(0, 4),
    [dashboardData.users]
  );

  const demandesColumns = [
    {
      title: "Bénéficiaire",
      dataIndex: ["femme", "firstName"],
      key: "nom",
      render: (_, row) => <Text strong>{`${row?.femme?.firstName || ""} ${row?.femme?.lastName || ""}`.trim() || "-"}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (v) => <Tag color="pink" style={{ borderRadius: 6 }}>{v || "-"}</Tag>,
    },
    { title: "Date", dataIndex: "createdAt", key: "date", render: formatDate },
    { title: "Statut", dataIndex: "statut", key: "statut", render: (v) => <StatusTag value={v} /> },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <ActionButtons
          loading={actionLoading}
          actions={[
            {
              key: `demande-${row._id}-VALIDEE`,
              label: "Valider",
              icon: <CheckOutlined />,
              onClick: () => handleStatusChange("demande", row._id, "VALIDEE"),
              style: { color: "#10B981", borderColor: "#10B981", borderRadius: 6 },
            },
            {
              key: `demande-${row._id}-REFUSEE`,
              label: "Refuser",
              icon: <CloseOutlined />,
              onClick: () => handleStatusChange("demande", row._id, "REFUSEE"),
              danger: true,
              style: { borderRadius: 6 },
            },
            {
              key: `demande-${row._id}-EN_ATTENTE`,
              label: "Attente",
              icon: <ReloadOutlined />,
              onClick: () => handleStatusChange("demande", row._id, "EN_ATTENTE"),
              style: { borderRadius: 6 },
            },
          ]}
        />
      ),
    },
  ];

  const propositionsColumns = [
    { title: "Demande", dataIndex: ["demande", "titre"], key: "demande", render: (v) => <Text strong>{v || "-"}</Text> },
    {
      title: "Association",
      dataIndex: ["association", "nomOrganisation"],
      key: "association",
      render: (_, row) => row?.association?.nomOrganisation || `${row?.association?.firstName || ""} ${row?.association?.lastName || ""}`.trim() || "-",
    },
    { title: "Date", dataIndex: "createdAt", key: "date", render: formatDate },
    { title: "Statut", dataIndex: "statut", key: "statut", render: (v) => <StatusTag value={v} /> },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <ActionButtons
          loading={actionLoading}
          actions={[
            {
              key: `proposition-${row._id}-ACCEPTEE`,
              label: "Valider",
              icon: <CheckOutlined />,
              onClick: () => handleStatusChange("proposition", row._id, "ACCEPTEE"),
              style: { color: "#10B981", borderColor: "#10B981", borderRadius: 6 },
            },
            {
              key: `proposition-${row._id}-REFUSEE`,
              label: "Refuser",
              icon: <CloseOutlined />,
              onClick: () => handleStatusChange("proposition", row._id, "REFUSEE"),
              danger: true,
              style: { borderRadius: 6 },
            },
            {
              key: `proposition-${row._id}-PROPOSEE`,
              label: "Attente",
              icon: <ReloadOutlined />,
              onClick: () => handleStatusChange("proposition", row._id, "PROPOSEE"),
              style: { borderRadius: 6 },
            },
          ]}
        />
      ),
    },
  ];

  const donsColumns = [
    {
      title: "Donateur",
      dataIndex: ["donateur", "firstName"],
      key: "donateur",
      render: (_, row) => <Text strong>{`${row?.donateur?.firstName || ""} ${row?.donateur?.lastName || ""}`.trim() || "-"}</Text>,
    },
    { title: "Montant", dataIndex: "montant", key: "montant", render: (v) => formatCurrency(v) },
    { title: "Type", dataIndex: "type", key: "type", render: (v) => <Tag color="gold" style={{ borderRadius: 6 }}>{v || "-"}</Tag> },
    { title: "Statut", dataIndex: "statut", key: "statut", render: (v) => <StatusTag value={v} /> },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <ActionButtons
          loading={actionLoading}
          actions={[
            {
              key: `don-${row._id}-CONFIRME`,
              label: "Valider",
              icon: <CheckOutlined />,
              onClick: () => handleStatusChange("don", row._id, "CONFIRME"),
              style: { color: "#10B981", borderColor: "#10B981", borderRadius: 6 },
            },
            {
              key: `don-${row._id}-REFUSE`,
              label: "Refuser",
              icon: <CloseOutlined />,
              onClick: () => handleStatusChange("don", row._id, "REFUSE"),
              danger: true,
              style: { borderRadius: 6 },
            },
            {
              key: `don-${row._id}-EN_ATTENTE`,
              label: "Attente",
              icon: <ReloadOutlined />,
              onClick: () => handleStatusChange("don", row._id, "EN_ATTENTE"),
              style: { borderRadius: 6 },
            },
          ]}
        />
      ),
    },
  ];

  const affectationsColumns = [
    {
      title: "Bénévole",
      dataIndex: ["benevole", "firstName"],
      key: "benevole",
      render: (_, row) => <Text strong>{`${row?.benevole?.firstName || ""} ${row?.benevole?.lastName || ""}`.trim() || "-"}</Text>,
    },
    { title: "Action", dataIndex: ["action", "titre"], key: "action", render: (v) => v || "-" },
    { title: "Date", dataIndex: "dateAffectation", key: "date", render: formatDateTime },
    { title: "Statut", dataIndex: "statut", key: "statut", render: (v) => <StatusTag value={v} /> },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <ActionButtons
          loading={actionLoading}
          actions={[
            {
              key: `affectation-${row._id}-ACCEPTEE`,
              label: "Valider",
              icon: <CheckOutlined />,
              onClick: () => handleStatusChange("affectation", row._id, "ACCEPTEE"),
              style: { color: "#10B981", borderColor: "#10B981", borderRadius: 6 },
            },
            {
              key: `affectation-${row._id}-REFUSEE`,
              label: "Refuser",
              icon: <CloseOutlined />,
              onClick: () => handleStatusChange("affectation", row._id, "REFUSEE"),
              danger: true,
              style: { borderRadius: 6 },
            },
            {
              key: `affectation-${row._id}-EN_ATTENTE`,
              label: "Attente",
              icon: <ReloadOutlined />,
              onClick: () => handleStatusChange("affectation", row._id, "EN_ATTENTE"),
              style: { borderRadius: 6 },
            },
          ]}
        />
      ),
    },
  ];

  const moduleConfig = {
    Demandes: {
      title: "Demandes d'aide",
      extra: <Tag color="orange">{dashboardData.demandes.filter((item) => item?.statut === "EN_ATTENTE").length} en attente</Tag>,
      columns: demandesColumns,
      data: dashboardData.demandes,
    },
    Propositions: {
      title: "Propositions d'aide",
      extra: <Tag color="gold">{dashboardData.propositions.length} propositions</Tag>,
      columns: propositionsColumns,
      data: dashboardData.propositions,
    },
    Dons: {
      title: "Dons",
      extra: <Tag color="green">{dashboardData.dons.length} dons</Tag>,
      columns: donsColumns,
      data: dashboardData.dons,
    },
    Affectations: {
      title: "Affectations",
      extra: <Tag color="blue">{dashboardData.affectations.length} affectations</Tag>,
      columns: affectationsColumns,
      data: dashboardData.affectations,
    },
  };

  const currentModule = moduleConfig[activeModule];

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
        {stats.map((s, i) => (
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
            title={<span style={{ fontWeight: 700 }}>{currentModule.title}</span>}
            extra={currentModule.extra}
            style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
          >
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <Segmented
                options={["Demandes", "Propositions", "Dons", "Affectations"]}
                value={activeModule}
                onChange={(value) => {
                  const moduleToPath = {
                    Demandes: "/admin/demandes",
                    Propositions: "/admin/propositions-aide",
                    Dons: "/admin/dons",
                    Affectations: "/admin/affectations",
                  };

                  navigate(moduleToPath[value] || "/admin/demandes");
                }}
              />
              <Button icon={<ReloadOutlined />} onClick={fetchDashboardData} loading={loading}>
                Actualiser
              </Button>
            </div>
            <Table
              rowKey={(record) => record._id}
              columns={currentModule.columns}
              dataSource={currentModule.data}
              pagination={{ pageSize: 5 }}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>

        {/* Nouveaux utilisateurs */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 700 }}>Nouveaux inscrits</span>}
            style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
          >
            {recentUsers.map((u, i) => (
              <div key={u._id || i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < recentUsers.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                <Avatar size={36} style={{ background: roleColor[u.role] || "#ccc" }}>{(u?.firstName || "U")[0]}</Avatar>
                <div style={{ flex: 1 }}>
                  <Text strong style={{ display: "block", fontSize: 13 }}>{`${u?.firstName || ""} ${u?.lastName || ""}`.trim() || "-"}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{formatDate(u?.createdAt)}</Text>
                </div>
                <Tag style={{ borderRadius: 6, fontSize: 10, color: roleColor[u.role], borderColor: (roleColor[u.role] || "#ccc") + "50", background: (roleColor[u.role] || "#ccc") + "12" }}>
                  {u.role}
                </Tag>
              </div>
            ))}

            {recentUsers.length === 0 && (
              <Text type="secondary">Aucun nouvel utilisateur.</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
