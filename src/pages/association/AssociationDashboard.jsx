import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Spin } from "antd";
import { AuthContext } from "../../contexts/AuthContext";
import { listActionsSolidaires } from "../../api/actionSolidaires";
import { listPropositionsAide } from "../../api/propositionsAide";

const TEAL = "#0F9488";
const TEAL_DARK = "#0d7a6f";

const styles = {
  page: {
    fontFamily: "'Sora', system-ui, sans-serif",
    paddingBottom: 40,
    color: "#1a1a1a",
  },
  hero: {
    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
    borderRadius: 20,
    padding: "32px 40px",
    marginBottom: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 20,
    boxShadow: "0 8px 32px rgba(15,148,136,0.35)",
  },
  heroLeft: { display: "flex", alignItems: "center", gap: 20 },
  heroAvatar: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.7)",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    flexShrink: 0,
  },
  heroSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    margin: "0 0 2px",
  },
  heroName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 4px",
  },
  heroDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  heroBtns: { display: "flex", gap: 10, flexWrap: "wrap" },
  heroBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.5)",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
    display: "block",
  },
  statValue: (c) => ({
    fontSize: 28,
    fontWeight: 700,
    color: c,
    lineHeight: 1,
  }),
  statIcon: (c) => ({
    width: 44,
    height: 44,
    borderRadius: 12,
    background: c + "18",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    color: c,
    flexShrink: 0,
  }),

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #f5f5f5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
  },
  cardLink: {
    fontSize: 13,
    color: TEAL,
    fontWeight: 600,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  cardBody: { padding: "8px 0" },
  actionItem: (last) => ({
    padding: "12px 20px",
    borderBottom: last ? "none" : "1px solid #f8fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  }),
  actionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 3,
    display: "block",
  },
  actionMeta: {
    fontSize: 12,
    color: "#94a3b8",
  },
  statutPill: (c) => ({
    background: c + "18",
    color: c,
    borderRadius: 8,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  }),
  emptyWrap: {
    padding: 30,
    textAlign: "center",
    color: "#64748b",
  },
};

const statutColorMap = {
  EN_ATTENTE: "#f59e0b",
  VALIDEE:    "#0ea5e9",
  REFUSEE:    "#ef4444",
  TERMINEE:   "#22c55e",
};

const statutLabelMap = {
  EN_ATTENTE: "En attente",
  VALIDEE:    "Validée",
  REFUSEE:    "Refusée",
  TERMINEE:   "Terminée",
};

function getActionStatus(action) {
  return action?.statut || "EN_ATTENTE";
}

const propositionColorMap = {
  PROPOSEE: "#f59e0b",
  ACCEPTEE: "#22c55e",
  REFUSEE: "#ef4444",
};

const propositionLabelMap = {
  PROPOSEE: "Proposée",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
};

function formatDate(dateValue) {
  if (!dateValue) return "Date non définie";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Date non définie";

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AssociationDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [actions, setActions] = useState([]);
  const [propositions, setPropositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        const [actionsRes, propositionsRes] = await Promise.all([
          listActionsSolidaires(),
          listPropositionsAide(),
        ]);

        setActions(actionsRes?.data?.actions || []);
        setPropositions(propositionsRes?.data?.propositions || []);
      } catch (error) {
        message.error(
          error?.response?.data?.message ||
            error?.message ||
            "Erreur lors du chargement du dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [message]);

  const stats = useMemo(() => {
    const totalActions = actions.length;
    const totalPropositions = propositions.length;
    const actionsEnAttente = actions.filter((a) => (a?.statut || "EN_ATTENTE") === "EN_ATTENTE").length;
    const actionsValidees = actions.filter((a) => a?.statut === "VALIDEE").length;
    const actionsTerminees = actions.filter((a) => a?.statut === "TERMINEE").length;

    return [
      { label: "Actions solidaires", value: totalActions, icon: "📅", color: TEAL },
      { label: "Propositions d'aide", value: totalPropositions, icon: "✅", color: "#EC7FA7" },
      { label: "Actions en attente", value: actionsEnAttente, icon: "🕒", color: "#f59e0b" },
      { label: "Actions validées", value: actionsValidees, icon: "🎯", color: "#0ea5e9" },
      { label: "Actions terminées", value: actionsTerminees, icon: "✔️", color: "#22c55e" },
    ];
  }, [actions, propositions]);

  const recentActions = useMemo(() => {
    return [...actions]
      .sort((a, b) => new Date(b?.dateAction || 0) - new Date(a?.dateAction || 0))
      .slice(0, 5);
  }, [actions]);

  const recentPropositions = useMemo(() => {
    return [...propositions]
      .sort((a, b) => new Date(b?.dateProposition || b?.createdAt || 0) - new Date(a?.dateProposition || a?.createdAt || 0))
      .slice(0, 5);
  }, [propositions]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .a-hero-btn:hover { background: rgba(255,255,255,0.3) !important; }
        @media (max-width: 1024px) {
          .a-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroAvatar}>🏢</div>
            <div>
              <p style={styles.heroSub}>Espace Association</p>
              <h2 style={styles.heroName}>
                {user?.firstName || user?.nomOrganisation || "Association"}
              </h2>
              <p style={styles.heroDesc}>
                Tableau de bord avec statistiques réelles
              </p>
            </div>
          </div>

          <div style={styles.heroBtns}>
            <button
              className="a-hero-btn"
              style={styles.heroBtn}
              onClick={() => navigate("/association/actions-solidaires/add")}
            >
              + Organiser une action
            </button>
            <button
              className="a-hero-btn"
              style={styles.heroBtn}
              onClick={() => navigate("/association/add-proposition-aide")}
            >
              + Proposer une aide
            </button>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              minHeight: 220,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div style={styles.statsGrid}>
              {stats.map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <div>
                    <span style={styles.statLabel}>{s.label}</span>
                    <span style={styles.statValue(s.color)}>{s.value}</span>
                  </div>
                  <div style={styles.statIcon(s.color)}>{s.icon}</div>
                </div>
              ))}
            </div>

            <div style={styles.mainGrid} className="a-main-grid">
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>Actions solidaires récentes</span>
                  <button
                    className="a-card-link"
                    style={styles.cardLink}
                    onClick={() => navigate("/association/actions-solidaires")}
                  >
                    Gérer
                  </button>
                </div>

                <div style={styles.cardBody}>
                  {recentActions.length === 0 ? (
                    <div style={styles.emptyWrap}>
                      Aucune action solidaire trouvée.
                    </div>
                  ) : (
                    recentActions.map((a, i) => {
                      const statut = getActionStatus(a);
                      const pillColor = statutColorMap[statut] || "#64748b";
                      const participants = a?.benevoles?.length || 0;

                      return (
                        <div
                          key={a?._id || i}
                          style={styles.actionItem(i === recentActions.length - 1)}
                        >
                          <div>
                            <span style={styles.actionTitle}>
                              {a?.titre || "Sans titre"}
                            </span>
                            <span style={styles.actionMeta}>
                              📅 {formatDate(a?.dateAction)} · 👥 {participants} participant
                              {participants > 1 ? "s" : ""}
                            </span>
                          </div>

                          <span style={styles.statutPill(pillColor)}>
                            {statutLabelMap[statut] || statut.replace("_", " ")}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>Propositions d'aide récentes</span>
                  <button
                    className="a-card-link"
                    style={styles.cardLink}
                    onClick={() => navigate("/association/propositions-aide")}
                  >
                    Gérer
                  </button>
                </div>

                <div style={styles.cardBody}>
                  {recentPropositions.length === 0 ? (
                    <div style={styles.emptyWrap}>
                      Aucune proposition d'aide trouvée.
                    </div>
                  ) : (
                    recentPropositions.map((p, i) => {
                      const statut = p?.statut || "PROPOSEE";
                      const pillColor = propositionColorMap[statut] || "#64748b";
                      const demandeTitre = p?.demande?.titre || "Demande non liée";

                      return (
                        <div
                          key={p?._id || i}
                          style={styles.actionItem(i === recentPropositions.length - 1)}
                        >
                          <div>
                            <span style={styles.actionTitle}>
                              {p?.description || "Proposition sans description"}
                            </span>
                            <span style={styles.actionMeta}>
                              📅 {formatDate(p?.dateProposition || p?.createdAt)} · 🎯 {demandeTitre}
                            </span>
                          </div>

                          <span style={styles.statutPill(pillColor)}>
                            {propositionLabelMap[statut] || statut.replace("_", " ")}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}