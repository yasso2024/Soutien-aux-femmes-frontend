import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Empty,
  Spin,
  Table,
  Tag,
  Typography,
  App as AntApp,
} from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { listDons } from "../../api/dons";

const { Title, Text } = Typography;
const GOLD = "#F59E0B";

const DON_STATUT_LABEL = {
  EN_ATTENTE: "En attente",
  CONFIRME: "Confirmé",
  REFUSE: "Refusé",
};

const DON_STATUT_COLOR = {
  EN_ATTENTE: "orange",
  CONFIRME: "green",
  REFUSE: "red",
};

const DEMANDE_STATUT_LABEL = {
  EN_ATTENTE: "En attente",
  VALIDEE: "Validée",
  REFUSEE: "Refusée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
};

const DEMANDE_STATUT_COLOR = {
  EN_ATTENTE: "orange",
  VALIDEE: "blue",
  REFUSEE: "red",
  EN_COURS: "processing",
  TERMINEE: "green",
};

export default function DemandesFinanceesList() {
  const { message } = AntApp.useApp();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dons, setDons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const userId = user?._id || user?.id;
        const res = await listDons(userId ? { donateur: userId } : {});
        const all = Array.isArray(res?.data?.dons) ? res.data.dons : [];
        // Only keep dons that are linked to a demande
        setDons(all.filter((d) => d?.demande));
      } catch (err) {
        message.error(err?.message || "Erreur lors du chargement.");
        setDons([]);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchData();
  }, [user]);

  const columns = [
    {
      title: "Bénéficiaire",
      key: "femme",
      render: (_, record) => {
        const femme = record.demande?.femme;
        const name = femme
          ? `${femme.firstName || ""} ${femme.lastName || ""}`.trim()
          : "—";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar
              size={36}
              style={{ background: "#fce4ec", color: "#c2185b", fontWeight: 700 }}
            >
              {name?.[0] || "?"}
            </Avatar>
            <div>
              <Text strong style={{ fontSize: 13 }}>{name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 11 }}>
                {femme?.email || ""}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Demande",
      key: "demande",
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 13, display: "block" }}>
            {record.demande?.titre || "—"}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.demande?.type || ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Statut demande",
      key: "statutDemande",
      render: (_, record) => {
        const s = record.demande?.statut || "EN_ATTENTE";
        return (
          <Tag color={DEMANDE_STATUT_COLOR[s] || "default"}>
            {DEMANDE_STATUT_LABEL[s] || s}
          </Tag>
        );
      },
    },
    {
      title: "Montant don",
      dataIndex: "montant",
      key: "montant",
      render: (v) => (
        <Text strong style={{ color: GOLD }}>
          {new Intl.NumberFormat("fr-FR").format(Number(v) || 0)} TND
        </Text>
      ),
    },
    {
      title: "Type don",
      dataIndex: "type",
      key: "type",
      render: (t) => (
        <Tag color={t === "FINANCIER" ? "gold" : "blue"}>{t}</Tag>
      ),
    },
    {
      title: "Statut don",
      dataIndex: "statut",
      key: "statut",
      render: (s) => (
        <Tag color={DON_STATUT_COLOR[s] || "default"}>
          {DON_STATUT_LABEL[s] || s}
        </Tag>
      ),
    },
    {
      title: "Date",
      key: "date",
      render: (_, record) => {
        const d = record.createdAt || record.dateDon;
        return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
      },
      sorter: (a, b) =>
        new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      defaultSortOrder: "descend",
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${GOLD} 0%, #D97706 100%)`,
          borderRadius: 20,
          padding: "24px 32px",
          marginBottom: 24,
          boxShadow: "0 8px 32px rgba(245,158,11,0.3)",
        }}
      >
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          Demandes financées
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>
          {dons.length} demande{dons.length !== 1 ? "s" : ""} financée
          {dons.length !== 1 ? "s" : ""} via vos dons
        </Text>
      </div>

      <Card
        style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
        styles={{ body: { padding: 0 } }}
      >
        {loading ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : dons.length === 0 ? (
          <Empty
            description="Aucune demande financée. Liez vos dons à une demande lors de la création."
            style={{ padding: 40 }}
          >
            <button
              onClick={() => navigate("/donateur/add-don")}
              style={{
                background: GOLD,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              + Faire un don lié
            </button>
          </Empty>
        ) : (
          <Table
            rowKey={(r) => r._id || r.id}
            columns={columns}
            dataSource={dons}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            size="small"
            style={{ padding: "0 8px" }}
          />
        )}
      </Card>
    </div>
  );
}
