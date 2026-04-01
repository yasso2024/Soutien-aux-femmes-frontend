// PublicLayout.jsx
import React, { useContext, useEffect, useState } from "react";
import { Button, Layout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ChatBot from "../components/chatbot/ChatBot";

const { Content, Footer } = Layout;

const PINK = "#e91e63";
const PINK_DARK = "#c2185b";

const navItems = [
  { key: "/", label: <Link to="/">Accueil</Link> },
  { key: "/traitements", label: <Link to="/traitements">Traitements</Link> },
  { key: "/quiz", label: <Link to="/quiz">Quiz</Link> },
  { key: "/events", label: <Link to="/events">Événements</Link> },
];

const PublicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
          borderBottom: `1px solid ${scrolled ? "#f0d6e0" : "#f8edf1"}`,
          boxShadow: scrolled ? "0 4px 20px rgba(233,30,99,0.08)" : "none",
          transition: "all 0.3s ease",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="/src/assets/courage-rose.png"
            alt="Courage Rose"
            style={{ width: 44, height: 44, objectFit: "contain" }}
            onError={e => {
              e.target.style.display = "none";
            }}
          />
          <span
            style={{
              fontWeight: 800,
              color: PINK,
              fontSize: 20,
              letterSpacing: "-0.5px",
              fontFamily: "Georgia, serif",
            }}
          >
            Courage Rose
          </span>
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          selectable
          style={{
            flex: 1,
            minWidth: 0,
            justifyContent: "center",
            border: "none",
            background: "transparent",
            fontWeight: 500,
          }}
          items={navItems}
        />

        <div style={{ flexShrink: 0, display: "flex", gap: 10 }}>
          {token ? (
            <Button
              type="primary"
              onClick={() => navigate("/redirect-by-role")}
              style={{
                background: `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`,
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
                height: 40,
                boxShadow: "0 4px 14px rgba(233,30,99,0.35)",
              }}
            >
              Tableau de bord
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate("/login")}
                style={{
                  borderColor: PINK,
                  color: PINK,
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 40,
                }}
              >
                Connexion
              </Button>
              <Button
                type="primary"
                onClick={() => navigate("/inscription")}
                style={{
                  background: `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`,
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 40,
                  boxShadow: "0 4px 14px rgba(233,30,99,0.35)",
                }}
              >
                S'inscrire
              </Button>
            </>
          )}
        </div>
      </header>

      <Content>
        <Outlet />
      </Content>

      <Footer
        style={{
          background: "#1a0a0f",
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          padding: "28px 40px",
          borderTop: `2px solid ${PINK}30`,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>🌸</span>
            <span style={{ color: PINK, fontWeight: 700, fontSize: 16 }}>Courage Rose</span>
          </div>
          <p style={{ margin: 0, fontSize: 13 }}>
            © 2026 Courage Rose — Tous droits réservés · Plateforme de solidarité pour les femmes atteintes du cancer du sein en Tunisie
          </p>
        </div>
      </Footer>

      <ChatBot />
    </Layout>
  );
};

export default PublicLayout;