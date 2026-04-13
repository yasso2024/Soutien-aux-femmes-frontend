import React, { useEffect, useState } from "react";
import {
  App as AntApp, Avatar, Button, Card, Input, Table, Tag, Typography,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { listUsers } from "../../api/users";

const { Title, Text } = Typography;
const RED = "#EF4444";

const roleColor = {
  "FEMME MALADE": "#EC7FA7",
  BENEVOLE: "#8B5CF6",
  DONTEUR: "#F59E0B",
  DONATEUR: "#F59E0B",
  ASSOCIATION: "#0F9488",
  ADMINISTRATEUR: "#3B82F6",
  VISITEUR: "#9CA3AF",
  USER: "#9CA3AF",
};

export default function AdminUtilisateurs() {
  const { message } = AntApp.useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listUsers()
      .then((res) => {
        const data = Array.isArray(res?.data?.users)
          ? res.data.users
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];

        setUsers(data);
      })
      .catch(() => message.error("Impossible de charger les utilisateurs"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      title: "Utilisateur",
      key: "user",
      render: (_, u) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            size={36}
            icon={<UserOutlined />}
            style={{ background: roleColor[u.role] || "#ccc", flexShrink: 0 }}
          />
          <div>
            <Text strong style={{ display: "block", fontSize: 13 }}>
              {u.firstName} {u.lastName}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{u.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          style={{
            borderRadius: 6,
            fontSize: 11,
            color: roleColor[role] || "#555",
            borderColor: (roleColor[role] || "#aaa") + "60",
            background: (roleColor[role] || "#aaa") + "15",
          }}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Région",
      dataIndex: "region",
      key: "region",
      render: (v) => v || <Text type="secondary">—</Text>,
    },
    {
      title: "Inscription",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) =>
        v
          ? new Date(v).toLocaleDateString("fr-FR")
          : <Text type="secondary">—</Text>,
    },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
          borderRadius: 20,
          padding: "24px 32px",
          marginBottom: 28,
          boxShadow: "0 8px 32px rgba(239,68,68,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Avatar
          size={56}
          icon={<UserOutlined />}
          style={{ background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.6)" }}
        />
        <div>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Gestion des utilisateurs
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            {users.length} membre{users.length !== 1 ? "s" : ""} enregistré{users.length !== 1 ? "s" : ""}
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
            placeholder="Rechercher par nom, email ou rôle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360, borderRadius: 8 }}
            allowClear
          />
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey={(r) => r._id || r.id}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="small"
          style={{ padding: "0 8px" }}
        />
      </Card>
    </div>
  );
}
