// ────────────────────────────────────────────────
//  FemmeDashboard.jsx
// ────────────────────────────────────────────────
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { listDemandes } from "../../api/demandes";
import { listPropositionsAide } from "../../api/propositionsAide";
import { listAffectations } from "../../api/affectations";
import { listNotifications } from "../../api/notifications";

const PINK = "#EC7FA7";
const PINK_MID = "#ffd6e7";

const styles = {
  page: { fontFamily: "'Sora', system-ui, sans-serif", paddingBottom: 40, color: "#1a1a1a" },
  hero: {
    background: "linear-gradient(135deg, #EC7FA7 0%, #c2185b 100%)",
    borderRadius: 20, padding: "32px 40px", marginBottom: 28,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 20,
    boxShadow: "0 8px 32px rgba(236,127,167,0.35)",
  },
  heroLeft: { display: "flex", alignItems: "center", gap: 20 },
  heroAvatar: {
    width: 90, height: 90, borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.7)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    background: "rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 36, position: "relative", flexShrink: 0,
  },
  onlineDot: {
    position: "absolute", bottom: 4, right: 4,
    width: 16, height: 16, borderRadius: "50%",
    background: "#4CAF50", border: "2px solid white",
  },
  heroName: { fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px" },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  heroGreeting: { fontSize: 14, color: "rgba(255,255,255,0.85)" },
  heroBtns: { display: "flex", gap: 12, flexWrap: "wrap" },
  heroBtn: {
    background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)",
    color: "#fff", borderRadius: 10, padding: "10px 18px",
    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
  heroIconBtn: {
    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)",
    color: "#fff", borderRadius: 10, padding: "10px 14px",
    fontSize: 16, cursor: "pointer", fontFamily: "inherit",
    position: "relative",
  },
  notifBadge: {
    position: "absolute", top: -6, right: -6,
    width: 18, height: 18, borderRadius: "50%",
    background: "#fff", color: PINK, fontSize: 10, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: 16, marginBottom: 28,
  },
  statCard: {
    background: "#fff", borderRadius: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: 20,
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
  },
  statLabel: { fontSize: 12, color: "#888", marginBottom: 6, display: "block" },
  statValue: (c) => ({ fontSize: 28, fontWeight: 700, color: c, lineHeight: 1 }),
  statIcon: (c) => ({
    width: 44, height: 44, borderRadius: 12, background: c + "18",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, color: c, flexShrink: 0,
  }),
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff", borderRadius: 16,
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden",
  },
  cardHeader: {
    padding: "16px 20px", borderBottom: "1px solid #f5f5f5",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  cardLink: { fontSize: 13, color: PINK, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" },
  cardBody: { padding: "12px 16px" },
  demandeItem: (last) => ({
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 4px", borderBottom: last ? "none" : "1px solid #f5f5f5",
  }),
  demandeTitle: { fontSize: 13, fontWeight: 600, color: "#0f172a", display: "block", marginBottom: 4 },
  demandeMetaRow: { display: "flex", gap: 8, alignItems: "center" },
  typePill: { background: "#fce4ec", color: "#c2185b", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 },
  dateText: { fontSize: 12, color: "#94a3b8" },
  propositionItem: (last) => ({
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 4px", borderBottom: last ? "none" : "1px solid #f5f5f5",
  }),
  propositionTitle: { fontSize: 13, fontWeight: 600, color: "#0f172a", display: "block", marginBottom: 4 },
  propositionMeta: { fontSize: 12, color: "#94a3b8" },
  statutPill: (c) => ({ background: c + "18", color: c, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }),
  addBtn: {
    width: "100%", padding: "11px", borderRadius: 10,
    border: `1.5px dashed ${PINK}`, background: "transparent",
    color: PINK, fontSize: 13, fontWeight: 600,
    cursor: "pointer", marginTop: 12, fontFamily: "inherit",
  },
  progressWrap: { padding: "16px 20px" },
  progressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  progressLabelText: { fontSize: 13, color: "#475569" },
  progressLabelVal: (c) => ({ fontSize: 13, fontWeight: 700, color: c }),
  progressTrack: { height: 8, borderRadius: 99, background: "#f1f5f9", marginBottom: 16, overflow: "hidden" },
  progressFill: (pct, c) => ({ height: "100%", width: pct + "%", borderRadius: 99, background: c, transition: "width 1s ease" }),
  timeline: { padding: "0 20px 16px" },
  timelineItem: (last) => ({
    position: "relative", paddingLeft: 24, paddingBottom: last ? 0 : 20,
    borderLeft: last ? "2px solid transparent" : "2px solid #f1f5f9",
    marginLeft: 6,
  }),
  timelineDot: (c) => ({
    position: "absolute", left: -8, top: 3,
    width: 12, height: 12, borderRadius: "50%", background: c, flexShrink: 0,
  }),
  timelineTitle: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  timelineDate: { fontSize: 11, color: "#94a3b8" },
};

const TIMELINE = [
  { label: "Inscription validée", date: "Jan 2025", color: "#22c55e" },
  { label: "Première demande soumise", date: "Mar 2025", color: PINK },
  { label: "Proposition d'aide reçue", date: "Avr 2025", color: "#3b82f6" },
  { label: "Prochaine étape…", date: "", color: "#cbd5e1" },
];

const STATUS_COLOR_MAP = {
  EN_ATTENTE: "#f59e0b",
  VALIDEE: "#22c55e",
  REFUSEE: "#ef4444",
  EN_COURS: "#3b82f6",
  TERMINEE: "#0ea5e9",
};

export default function FemmeDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Bonjour");
  const [notifCount, setNotifCount] = useState(0);
  const [stats, setStats] = useState({
    demandesDeposees: 0,
    propositionsRecues: 0,
    enCoursTraitement: 0,
    demandesAcceptees: 0,
    affectationsLiees: 0,
  });
  const [demandesRecentes, setDemandesRecentes] = useState([]);
  const [propositionsRecentes, setPropositionsRecentes] = useState([]);
  const [affectationsRecentes, setAffectationsRecentes] = useState([]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir");
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const userId = user?._id || user?.id;

        const [demandesRes, propositionsRes, affectationsRes, notificationsRes] =
          await Promise.all([
            listDemandes(userId ? { femme: userId } : {}),
            listPropositionsAide(),
            listAffectations(),
            listNotifications(),
          ]);

        const demandes = Array.isArray(demandesRes?.data?.demandes)
          ? demandesRes.data.demandes
          : [];

        const demandeIds = new Set(
          demandes
            .map((d) => (d?._id || d?.id || "").toString())
            .filter(Boolean)
        );

        const propositions = Array.isArray(propositionsRes?.data?.propositions)
          ? propositionsRes.data.propositions
          : [];

        const propositionsLiees = propositions.filter((p) => {
          const demandeId = (p?.demande?._id || p?.demande || "").toString();
          return demandeIds.has(demandeId);
        });

        const affectations = Array.isArray(affectationsRes?.data?.affectations)
          ? affectationsRes.data.affectations
          : [];

        const affectationsLiees = affectations.filter((a) => {
          const demandeId = (a?.demande?._id || a?.demande || "").toString();
          return demandeIds.has(demandeId);
        });

        const notifications = Array.isArray(notificationsRes?.data?.notifications)
          ? notificationsRes.data.notifications
          : [];

        setNotifCount(notifications.filter((n) => !n?.lu).length);

        setStats({
          demandesDeposees: demandes.length,
          propositionsRecues: propositionsLiees.length,
          enCoursTraitement: demandes.filter((d) => d?.statut === "EN_COURS").length,
          demandesAcceptees: demandes.filter((d) => ["VALIDEE", "TERMINEE"].includes(d?.statut)).length,
          affectationsLiees: affectationsLiees.length,
        });

        const recentes = [...demandes]
          .sort((a, b) => new Date(b?.createdAt || b?.dateCreation || 0) - new Date(a?.createdAt || a?.dateCreation || 0))
          .slice(0, 3)
          .map((d) => ({
          titre: d?.titre || "Demande sans titre",
          statut: d?.statut || "EN_ATTENTE",
          date: d?.createdAt || d?.dateCreation
            ? new Date(d.createdAt || d.dateCreation).toLocaleDateString("fr-FR")
            : "-",
          type: d?.type || "-",
          statColor: STATUS_COLOR_MAP[d?.statut] || "#64748b",
        }));

        const propsRecentes = [...propositionsLiees]
          .sort((a, b) => new Date(b?.dateProposition || b?.createdAt || 0) - new Date(a?.dateProposition || a?.createdAt || 0))
          .slice(0, 3)
          .map((p) => ({
            titre: p?.demande?.titre || "Demande liée",
            date: p?.dateProposition || p?.createdAt
              ? new Date(p.dateProposition || p.createdAt).toLocaleDateString("fr-FR")
              : "-",
            statut: p?.statut || "PROPOSEE",
            statColor: STATUS_COLOR_MAP[p?.statut] || "#3b82f6",
          }));

        const affRecentes = [...affectationsLiees]
          .sort((a, b) => new Date(b?.dateAffectation || b?.createdAt || 0) - new Date(a?.dateAffectation || a?.createdAt || 0))
          .slice(0, 3)
          .map((a) => ({
            titre: a?.action?.titre || a?.demande?.titre || "Affectation liée",
            date: a?.dateAffectation || a?.createdAt
              ? new Date(a.dateAffectation || a.createdAt).toLocaleDateString("fr-FR")
              : "-",
            statut: a?.statut || "EN_ATTENTE",
            statColor: STATUS_COLOR_MAP[a?.statut] || "#0ea5e9",
          }));

        setDemandesRecentes(recentes);
        setPropositionsRecentes(propsRecentes);
        setAffectationsRecentes(affRecentes);
      } catch {
        setNotifCount(0);
      }
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const statCards = [
    { label: "Demandes déposées", value: stats.demandesDeposees, icon: "📄", color: PINK },
    { label: "Propositions reçues", value: stats.propositionsRecues, icon: "💝", color: "#9C27B0" },
    { label: "En cours de traitement", value: stats.enCoursTraitement, icon: "⏳", color: "#FF9800" },
    { label: "Demandes acceptées", value: stats.demandesAcceptees, icon: "✅", color: "#4CAF50" },
    { label: "Affectations liées", value: stats.affectationsLiees, icon: "📌", color: "#0ea5e9" },
  ];

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : "mars 2025";
  const userRegion = user?.region || "Tunisie";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .f-hero-btn:hover { background: rgba(255,255,255,0.3) !important; }
        .f-add-btn:hover { background: #fff0f6 !important; }
        @media (max-width: 1024px) { .f-main-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div style={styles.page}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroAvatar}>
              👤
              <div style={styles.onlineDot} />
            </div>
            <div>
              <span style={styles.heroGreeting}>{greeting},</span>
              <h2 style={styles.heroName}>{user?.firstName || "Fatima"} {user?.lastName || ""}</h2>
              <p style={styles.heroSub}>Membre depuis {memberSince} · Région {userRegion}</p>
            </div>
          </div>
          <div style={styles.heroBtns}>
            <button className="f-hero-btn" style={styles.heroBtn} onClick={() => navigate("/femme/add-demande")}>
              + Nouvelle demande
            </button>
            <button className="f-hero-btn" style={styles.heroBtn} onClick={() => navigate("/femme/propositions")}>
              Mes propositions
            </button>
            <button className="f-hero-btn" style={styles.heroIconBtn} onClick={() => navigate("/notifications")}>
              🔔
              <span style={styles.notifBadge}>{notifCount}</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {statCards.map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div>
                <span style={styles.statLabel}>{s.label}</span>
                <span style={styles.statValue(s.color)}>{s.value}</span>
              </div>
              <div style={styles.statIcon(s.color)}>{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={styles.mainGrid} className="f-main-grid">
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Mes demandes récentes</span>
              <button style={styles.cardLink} className="f-card-link" onClick={() => navigate("/femme/demandes")}>Voir tout</button>
            </div>
            <div style={styles.cardBody}>
              {demandesRecentes.length === 0 ? (
                <div style={{ padding: "10px 4px", color: "#64748b", fontSize: 13 }}>
                  Aucune demande recente.
                </div>
              ) : (
                demandesRecentes.map((d, i) => (
                  <div key={i} style={styles.demandeItem(i === demandesRecentes.length - 1)}>
                    <div>
                      <span style={styles.demandeTitle}>{d.titre}</span>
                      <div style={styles.demandeMetaRow}>
                        <span style={styles.typePill}>{d.type}</span>
                        <span style={styles.dateText}>📅 {d.date}</span>
                      </div>
                    </div>
                    <span style={styles.statutPill(d.statColor)}>{d.statut.replace("_", " ")}</span>
                  </div>
                ))
              )}
              <button style={styles.addBtn} className="f-add-btn" onClick={() => navigate("/femme/add-demande")}>
                + Ajouter une demande
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Propositions d'aide reçues</span>
              <button style={styles.cardLink} onClick={() => navigate("/femme/propositions")}>Voir tout</button>
            </div>
            <div style={styles.cardBody}>
              {propositionsRecentes.length === 0 ? (
                <div style={{ padding: "10px 4px", color: "#64748b", fontSize: 13 }}>
                  Aucune proposition reçue.
                </div>
              ) : (
                propositionsRecentes.map((p, i) => (
                  <div key={i} style={styles.propositionItem(i === propositionsRecentes.length - 1)}>
                    <div>
                      <span style={styles.propositionTitle}>{p.titre}</span>
                      <span style={styles.propositionMeta}>📅 {p.date}</span>
                    </div>
                    <span style={styles.statutPill(p.statColor)}>{p.statut.replace("_", " ")}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Affectations liées</span>
            </div>
            <div style={styles.cardBody}>
              {affectationsRecentes.length === 0 ? (
                <div style={{ padding: "10px 4px", color: "#64748b", fontSize: 13 }}>
                  Aucune affectation liée pour le moment.
                </div>
              ) : (
                affectationsRecentes.map((a, i) => (
                  <div key={i} style={styles.propositionItem(i === affectationsRecentes.length - 1)}>
                    <div>
                      <span style={styles.propositionTitle}>{a.titre}</span>
                      <span style={styles.propositionMeta}>📅 {a.date}</span>
                    </div>
                    <span style={styles.statutPill(a.statColor)}>{a.statut.replace("_", " ")}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
