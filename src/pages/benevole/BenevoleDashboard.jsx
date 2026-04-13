import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { listAffectations } from "../../api/affectations";
import { listActionsSolidaires, participerAction } from "../../api/actionSolidaires";

const PURPLE = "#8B5CF6";
const PURPLE_DARK = "#6D28D9";

const styles = {
  page: { fontFamily: "'Sora', system-ui, sans-serif", paddingBottom: 40, color: "#1a1a1a" },
  hero: {
    background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)`,
    borderRadius: 20, padding: "32px 40px", marginBottom: 28,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 20, boxShadow: "0 8px 32px rgba(139,92,246,0.35)",
  },
  heroLeft: { display: "flex", alignItems: "center", gap: 20 },
  heroAvatar: {
    width: 90, height: 90, borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.7)",
    background: "rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 36, flexShrink: 0,
  },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.85)", margin: "0 0 2px" },
  heroName: { fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px" },
  heroDesc: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  heroBtn: {
    background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)",
    color: "#fff", borderRadius: 10, padding: "10px 20px",
    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
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
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 },
  card: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden" },
  cardHeader: {
    padding: "16px 20px", borderBottom: "1px solid #f5f5f5",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  cardLink: { fontSize: 13, color: PURPLE, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" },
  cardBody: { padding: "8px 0" },
  affItem: (last) => ({
    display: "flex", alignItems: "center", gap: 14,
    padding: "12px 20px", borderBottom: last ? "none" : "1px solid #f8fafc",
  }),
  affIcon: {
    width: 44, height: 44, borderRadius: 10, background: PURPLE + "18",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: PURPLE, fontSize: 20, flexShrink: 0,
  },
  affTitle: { fontSize: 13, fontWeight: 600, color: "#0f172a", display: "block" },
  affMeta: { fontSize: 12, color: "#94a3b8" },
  statutPill: (c) => ({
    marginLeft: "auto", background: c + "18", color: c,
    borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700,
    flexShrink: 0,
  }),
  actionItem: (last) => ({
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 20px", borderBottom: last ? "none" : "1px solid #f8fafc",
  }),
  actionTitle: { fontSize: 13, fontWeight: 700, color: "#0f172a", display: "block" },
  actionMeta: { fontSize: 12, color: "#64748b" },
  actionBtn: {
    marginLeft: "auto",
    background: PURPLE,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  actionBtnDisabled: {
    marginLeft: "auto",
    background: "#e5e7eb",
    color: "#6b7280",
    border: "none",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "not-allowed",
  },
  // mini calendar
  calHeader: {
    padding: "16px 20px 8px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  calMonth: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
  calGrid: {
    display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
    gap: 2, padding: "0 16px 16px",
  },
  calDayLabel: { textAlign: "center", fontSize: 10, fontWeight: 600, color: "#94a3b8", padding: "4px 0" },
  calDay: (active, today) => ({
    textAlign: "center", fontSize: 12, padding: "6px 0",
    borderRadius: 8, cursor: "default",
    background: active ? PURPLE : today ? PURPLE + "18" : "transparent",
    color: active ? "#fff" : today ? PURPLE : "#475569",
    fontWeight: active || today ? 700 : 400,
  }),
};

const STATUT_COLOR = {
  EN_ATTENTE: "#f59e0b",
  ACCEPTEE: "#22c55e",
  TERMINEE: "#0ea5e9",
};

const STATUT_LABEL = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  TERMINEE: "Terminée",
};

// Minimal calendar widget without antd
function MiniCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const startPad = (firstDay + 6) % 7; // Mon-start

  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthName = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const DAY_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
  const MARKED = [5, 15, 22]; // sample highlighted dates

  return (
    <div>
      <div style={styles.calHeader}>
        <span style={styles.calMonth}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>
      </div>
      <div style={styles.calGrid}>
        {DAY_LABELS.map((d) => (
          <div key={d} style={styles.calDayLabel}>{d}</div>
        ))}
        {days.map((d, i) => (
          <div key={i} style={d ? styles.calDay(MARKED.includes(d), d === today) : {}} />
        ))}
      </div>
    </div>
  );
}

export default function BenevoleDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [affectations, setAffectations] = useState([]);
  const [actionsDisponibles, setActionsDisponibles] = useState([]);
  const [participatingId, setParticipatingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    terminated: 0,
    inProgress: 0,
    pending: 0,
    openActions: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [affectationsRes, actionsRes] = await Promise.all([
          listAffectations(),
          listActionsSolidaires(),
        ]);

        const data = Array.isArray(affectationsRes?.data?.affectations)
          ? affectationsRes.data.affectations
          : [];

        setAffectations(data);

        const currentUserId = (user?._id || user?.id || "").toString();
        const allActions = Array.isArray(actionsRes?.data?.actions)
          ? actionsRes.data.actions
          : [];

        const ouvertes = allActions.filter((action) => {
          const benevoles = Array.isArray(action?.benevoles) ? action.benevoles : [];
          const alreadyParticipant = benevoles.some(
            (b) => (b?._id || b || "").toString() === currentUserId
          );
          return !alreadyParticipant;
        });

        setActionsDisponibles(ouvertes);

        const stats = {
          total: data.length,
          terminated: data.filter((a) => a.statut === "TERMINEE").length,
          inProgress: data.filter((a) => a.statut === "ACCEPTEE").length,
          pending: data.filter((a) => a.statut === "EN_ATTENTE").length,
          openActions: ouvertes.length,
        };
        setStats(stats);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleParticiper = async (actionId) => {
    try {
      setParticipatingId(actionId);
      await participerAction(actionId);
      await (async () => {
        const [affectationsRes, actionsRes] = await Promise.all([
          listAffectations(),
          listActionsSolidaires(),
        ]);

        const data = Array.isArray(affectationsRes?.data?.affectations)
          ? affectationsRes.data.affectations
          : [];

        setAffectations(data);

        const currentUserId = (user?._id || user?.id || "").toString();
        const allActions = Array.isArray(actionsRes?.data?.actions)
          ? actionsRes.data.actions
          : [];

        const ouvertes = allActions.filter((action) => {
          const benevoles = Array.isArray(action?.benevoles) ? action.benevoles : [];
          const alreadyParticipant = benevoles.some(
            (b) => (b?._id || b || "").toString() === currentUserId
          );
          return !alreadyParticipant;
        });

        setActionsDisponibles(ouvertes);

        setStats({
          total: data.length,
          terminated: data.filter((a) => a.statut === "TERMINEE").length,
          inProgress: data.filter((a) => a.statut === "ACCEPTEE").length,
          pending: data.filter((a) => a.statut === "EN_ATTENTE").length,
          openActions: ouvertes.length,
        });
      })();
    } catch (error) {
      console.error("Erreur de participation:", error);
    } finally {
      setParticipatingId(null);
    }
  };

  const displayAffectations = affectations.slice(0, 3).map((a) => ({
    titre: a.action?.titre || "Action sans titre",
    demande: a.demande?.titre || "Aucune demande liée",
    date: a.dateAffectation
      ? new Date(a.dateAffectation).toLocaleDateString("fr-FR")
      : "-",
    lieu: a.action?.lieu || "—",
    statut: a.statut || "EN_ATTENTE",
    statutLabel: STATUT_LABEL[a.statut] || "En attente",
    statColor: STATUT_COLOR[a.statut] || "#64748b",
  }));

  const displayActions = actionsDisponibles.slice(0, 3);

  const competences = user?.competences || [];

  const STAT_CARDS = [
    { label: "Affectations reçues", value: stats.total, icon: "📅", color: PURPLE },
    { label: "Participations confirmées", value: stats.inProgress, icon: "⏳", color: "#EC7FA7" },
    { label: "Missions terminées", value: stats.terminated, icon: "✅", color: "#10B981" },
    { label: "Actions à suivre", value: stats.openActions, icon: "🎯", color: "#F59E0B" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .b-hero-btn:hover { background: rgba(255,255,255,0.3) !important; }
        @media (max-width: 1024px) { .b-main-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div style={styles.page}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroAvatar}>🤝</div>
            <div>
              <p style={styles.heroSub}>Espace Bénévole</p>
              <h2 style={styles.heroName}>{user?.firstName || "Bénévole"} {user?.lastName || ""}</h2>
              <p style={styles.heroDesc}>
                {competences.length > 0
                  ? `Acteur terrain, vous participez aux actions solidaires, recevez des demandes d'aide via vos affectations et suivez vos missions selon vos compétences : ${competences.join(", ")}`
                  : "Acteur terrain, vous participez aux actions solidaires, recevez des demandes d'aide via vos affectations et suivez vos missions."}
              </p>
            </div>
          </div>
          <button className="b-hero-btn" style={styles.heroBtn} onClick={() => navigate("/benevole/affectations")}>
            Mes affectations
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {STAT_CARDS.map((s, i) => (
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
        <div style={styles.mainGrid} className="b-main-grid">
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Demandes d'aide et affectations récentes</span>
              <button style={styles.cardLink} onClick={() => navigate("/benevole/affectations")}>Voir tout</button>
            </div>
            <div style={styles.cardBody}>
              {displayAffectations.length === 0 ? (
                <div style={{ padding: "10px 20px", color: "#64748b", fontSize: 13 }}>
                  Aucune affectation pour le moment.
                </div>
              ) : (
                displayAffectations.map((a, i) => (
                  <div key={i} style={styles.affItem(i === displayAffectations.length - 1)}>
                    <div style={styles.affIcon}>📅</div>
                    <div>
                      <span style={styles.affTitle}>{a.titre}</span>
                      <span style={styles.affMeta}>{a.date} · {a.lieu} · {a.demande}</span>
                    </div>
                    <span style={styles.statutPill(a.statColor)}>{a.statutLabel}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Participer aux actions solidaires</span>
              <button style={styles.cardLink} onClick={() => navigate("/benevole/affectations")}>Mes affectations</button>
            </div>
            <div style={styles.cardBody}>
              {displayActions.length === 0 ? (
                <div style={{ padding: "10px 20px", color: "#64748b", fontSize: 13 }}>
                  Aucune action disponible pour le moment.
                </div>
              ) : (
                displayActions.map((a, i) => (
                  <div key={a._id || i} style={styles.actionItem(i === displayActions.length - 1)}>
                    <div>
                      <span style={styles.actionTitle}>{a.titre || "Action"}</span>
                      <span style={styles.actionMeta}>
                        {(a.lieu || "Lieu non précisé") + " · " + (a.dateAction ? new Date(a.dateAction).toLocaleDateString("fr-FR") : "Date non précisée")}
                      </span>
                    </div>
                    <button
                      style={participatingId === a._id ? styles.actionBtnDisabled : styles.actionBtn}
                      onClick={() => handleParticiper(a._id)}
                      disabled={participatingId === a._id}
                    >
                      {participatingId === a._id ? "..." : "Participer"}
                    </button>
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
