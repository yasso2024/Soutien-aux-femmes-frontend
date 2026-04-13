// ======================
// Layouts
// ======================

// ClientLayout.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  Avatar, Badge, Button, Dropdown, Layout, Menu, Typography,
} from "antd";
import {
  BellOutlined, LogoutOutlined, UserOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ChatBot from "../components/chatbot/ChatBot";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const PINK = "#f7078b";

const menuConfig = {
  ADMINISTRATEUR: [
    { key: "/admin/dashboard", label: "Home", icon: "📊" },
    { key: "/admin/utilisateurs", label: "Utilisateurs", icon: "👥" },
    { key: "/admin/demandes", label: "Demandes", icon: "📋" },
    { key: "/admin/propositions-aide", label: "Propositions", icon: "💝" },
    { key: "/admin/dons", label: "Dons", icon: "💰" },
    { key: "/admin/affectations", label: "Affectations", icon: "📌" },
    { key: "/notifications", label: "Notifications", icon: "🔔" },
    { key: "/profile", label: "Profil", icon: "👤" },
  ],
  "FEMME MALADE": [
    { key: "/femme/dashboard", label: "Home", icon: "🏠" },
    { key: "/femme/demandes", label: "Mes demandes", icon: "📋" },
    { key: "/femme/add-demande", label: "Ajouter demande", icon: "➕" },
    { key: "/femme/propositions", label: "Propositions", icon: "💝" },
    { key: "/notifications", label: "Notifications", icon: "🔔" },
    { key: "/profile", label: "Profil", icon: "👤" },
  ],
  ASSOCIATION: [
    { key: "/association/dashboard", label: "Home", icon: "🏠" },
    { key: "/association/actions-solidaires", label: "Actions solidaires", icon: "🤝" },
    { key: "/association/propositions-aide", label: "Propositions aide", icon: "💝" },
    { key: "/notifications", label: "Notifications", icon: "🔔" },
    { key: "/profile", label: "Profil", icon: "👤" },
  ],
  BENEVOLE: [
    { key: "/benevole/dashboard", label: "Home", icon: "🏠" },
    { key: "/benevole/affectations", label: "Affectations", icon: "📅" },
    { key: "/notifications", label: "Notifications", icon: "🔔" },
    { key: "/profile", label: "Profil", icon: "👤" },
  ],
  DONTEUR: [
    { key: "/donateur/dashboard", label: "Home", icon: "🏠" },
    { key: "/donateur/dons", label: "Mes dons", icon: "💰" },
    { key: "/donateur/add-don", label: "Ajouter don", icon: "➕" },
    { key: "/donateur/demandes-financees", label: "Demandes financées", icon: "✅" },
    { key: "/notifications", label: "Notifications", icon: "🔔" },
    { key: "/profile", label: "Profil", icon: "👤" },
  ],
  DONATEUR: [
    { key: "/donateur/dashboard", label: "Home", icon: "🏠" },
    { key: "/donateur/dons", label: "Mes dons", icon: "💰" },
    { key: "/donateur/add-don", label: "Ajouter don", icon: "➕" },
    { key: "/donateur/demandes-financees", label: "Demandes financées", icon: "✅" },
    { key: "/notifications", label: "Notifications", icon: "🔔" },
    { key: "/profile", label: "Profil", icon: "👤" },
  ],
};

const roleLabel = {
  "FEMME MALADE": "Femme malade",
  ASSOCIATION: "Association",
  BENEVOLE: "Bénévole",
  DONTEUR: "Donateur",
  DONATEUR: "Donateur",
  ADMINISTRATEUR: "Administrateur",
};

const roleColor = {
  "FEMME MALADE": PINK,
  ASSOCIATION: "#0F9488",
  BENEVOLE: "#8B5CF6",
  DONTEUR: "#F59E0B",
  DONATEUR: "#F59E0B",
  ADMINISTRATEUR: "#EF4444",
};

export default function ClientLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount] = useState(3);

  const items = (menuConfig[user?.role] || []).map(item => ({
    key: item.key,
    label: (
      <Link to={item.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 15 }}>{item.icon}</span>
        <span>{item.label}</span>
        {item.key === "/notifications" && unreadCount > 0 && (
          <Badge
            count={unreadCount}
            size="small"
            style={{ background: PINK, marginLeft: "auto" }}
          />
        )}
      </Link>
    ),
  }));

  const profileMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: <Link to="/profile">Mon profil</Link>,
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        danger: true,
        label: (
          <span onClick={() => { logout(); navigate("/login"); }}>
            Se déconnecter
          </span>
        ),
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        theme="light"
        style={{
          boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
          zIndex: 10,
          position: "sticky", top: 0, height: "100vh", overflow: "auto",
        }}
      >
        <div
          style={{
            height: 64, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 10,
            borderBottom: "1px solid #f5f5f5",
            background: "#fff",
          }}
        >
          <span style={{ fontSize: 22 }}>🌸</span>
          <span style={{ fontWeight: 800, color: PINK, fontSize: 18, letterSpacing: -0.5 }}>
            Courage Rose
          </span>
        </div>

        <div
          style={{
            padding: "14px 16px",
            background: "linear-gradient(135deg, #fff5f8, #fff)",
            borderBottom: "1px solid #fce4ec",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              style={{ background: roleColor[user?.role] || PINK, flexShrink: 0 }}
            />
            <div style={{ overflow: "hidden" }}>
              <Text strong style={{ display: "block", fontSize: 13, lineHeight: 1.2 }}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: roleColor[user?.role] || PINK,
                  fontWeight: 600,
                }}
              >
                {roleLabel[user?.role] || user?.role}
              </Text>
            </div>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0, paddingTop: 8 }}
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex", justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            borderBottom: "1px solid #f5f5f5",
            position: "sticky", top: 0, zIndex: 9,
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            height: 60,
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </Text>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Badge count={unreadCount} size="small" color={PINK}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                onClick={() => navigate("/notifications")}
                style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
              />
            </Badge>

            <Dropdown menu={profileMenu} placement="bottomRight" trigger={["click"]}>
              <Button
                type="text"
                style={{
                  height: "auto", padding: "6px 10px",
                  borderRadius: 10, border: "1px solid #f0f0f0",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <Avatar
                  size={28}
                  icon={<UserOutlined />}
                  style={{ background: roleColor[user?.role] || PINK }}
                />
                <Text style={{ fontSize: 13 }}>{user?.firstName}</Text>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: 24, background: "#f8f9fa",
            minHeight: "calc(100vh - 60px - 48px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      <ChatBot />
    </Layout>
  );
}