import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { listDons } from "../../api/dons";
import { listPropositionsAide } from "../../api/propositionsAide";
import { App as AntApp } from "antd";

const GOLD = "#F59E0B";
const GOLD_DARK = "#D97706";
const GOLD_LIGHT = "#fffbeb";

const styles = {
  page: { fontFamily: "'Sora', system-ui, sans-serif", paddingBottom: 40, color: "#1a1a1a" },
  hero: {
    background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
    borderRadius: 20, padding: "32px 40px", marginBottom: 28,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 20, boxShadow: "0 8px 32px rgba(245,158,11,0.35)",
  },
  heroLeft: { display: "flex", alignItems: "center", gap: 20 },
  heroAvatar: {
    width: 90, height: 90, borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.7)",
    background: "rgba(255,255,255,0.2)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 36, flexShrink: 0,
  },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.85)", margin: "0 0 2px" },
  heroName: { fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 6px" },
  heroBadge: {
    background: "rgba(255,255,255,0.25)", border: "none",
    color: "#fff", borderRadius: 20, padding: "4px 12px",
    fontSize: 12, fontWeight: 600, display: "inline-block",
  },
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
  statValue: (c) => ({ fontSize: 26, fontWeight: 700, color: c, lineHeight: 1 }),
  statIcon: (c) => ({
    width: 44, height: 44, borderRadius: 12, background: c + "18",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, color: c, flexShrink: 0,
  }),
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 },
  card: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden" },
  cardHeader: {
    padding: "16px 20px", borderBottom: "1px solid #f5f5f5",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  cardLink: { fontSize: 13, color: GOLD, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontSize: 11, fontWeight: 600, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.05em",
    padding: "10px 16px", textAlign: "left",
    borderBottom: "1px solid #f5f5f5", background: "#fafafa",
  },
  td: {
    padding: "12px 16px", fontSize: 13, color: "#334155",
    borderBottom: "1px solid #f8fafc", verticalAlign: "middle",
  },
  montantText: { fontSize: 14, fontWeight: 700, color: GOLD },
  typePill: (c) => ({
    background: c + "18", color: c, borderRadius: 6,
    padding: "3px 10px", fontSize: 11, fontWeight: 600,
  }),
  propositionRow: (last) => ({
    padding: "12px 20px",
    borderBottom: last ? "none" : "1px solid #f8fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  }),
  propositionTitle: { fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3, display: "block" },
  propositionMeta: { fontSize: 12, color: "#64748b" },
  confirmedPill: {
    background: "#f0fdf4", color: "#15803d", borderRadius: 6,
    padding: "3px 10px", fontSize: 11, fontWeight: 600,
  },
  pendingPill: {
    background: "#fff7ed", color: "#c2410c", borderRadius: 6,
    padding: "3px 10px", fontSize: 11, fontWeight: 600,
  },
  // Impact panel
  impactPanel: { padding: "20px" },
  trophyCircle: {
    width: 100, height: 100, borderRadius: "50%",
    background: GOLD_LIGHT, border: `4px solid ${GOLD}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 40, margin: "0 auto 16px",
  },
  impactTitle: { fontSize: 16, fontWeight: 700, color: GOLD, textAlign: "center", marginBottom: 2 },
  impactSub: { fontSize: 13, color: "#94a3b8", textAlign: "center", marginBottom: 20 },
  progressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  progressLabelText: { fontSize: 13, color: "#475569" },
  progressLabelVal: (c) => ({ fontSize: 13, fontWeight: 700, color: c }),
  progressTrack: { height: 7, borderRadius: 99, background: "#f1f5f9", marginBottom: 14, overflow: "hidden" },
  progressFill: (pct, c) => ({ height: "100%", width: pct + "%", borderRadius: 99, background: c }),
  impactBtn: {
    width: "100%", padding: "11px", borderRadius: 10,
    background: GOLD, border: "none",
    color: "#fff", fontSize: 13, fontWeight: 700,
    cursor: "pointer", marginTop: 4, fontFamily: "inherit",
    boxShadow: `0 4px 14px ${GOLD}55`,
  },
};

export default function DonateurDashboard() {
  const { message } = AntApp.useApp();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dons, setDons] = useState([]);
  const [propositionsLiees, setPropositionsLiees] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatAmount = (n) =>
    new Intl.NumberFormat("fr-FR").format(Number(n) || 0);

  useEffect(() => {
    async function fetchDons() {
      try {
        setLoading(true);
        const userId = user?._id || user?.id;
        const [donsRes, propositionsRes] = await Promise.all([
          listDons(userId ? { donateur: userId } : {}),
          listPropositionsAide(),
        ]);

        const data = Array.isArray(donsRes?.data?.dons) ? donsRes.data.dons : [];
        const filtered = userId
          ? data.filter((don) => (don?.donateur?._id || don?.donateur || "").toString() === userId.toString())
          : data;
        setDons(filtered);

        const demandeIdsFinancees = new Set(
          filtered
            .map((d) => (d?.demande?._id || d?.demande || "").toString())
            .filter(Boolean)
        );

        const allPropositions = Array.isArray(propositionsRes?.data?.propositions)
          ? propositionsRes.data.propositions
          : [];

        const liees = allPropositions.filter((p) => {
          const demandeId = (p?.demande?._id || p?.demande || "").toString();
          return demandeIdsFinancees.has(demandeId);
        });

        setPropositionsLiees(liees);
      } catch {
        message.error("Impossible de charger les dons pour le moment.");
        setDons([]);
        setPropositionsLiees([]);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchDons();
    }
  }, [user]);

  const stats = useMemo(() => {
    const totalMontant = dons.reduce((sum, d) => sum + (Number(d?.montant) || 0), 0);
    const donsEffectues = dons.length;
    const demandesFinancees = new Set(
      dons
        .map((d) => (d?.demande?._id || d?.demande || "").toString())
        .filter(Boolean)
    ).size;
    const femmesAidees = new Set(
      dons
        .map((d) => (d?.demande?.femme?._id || d?.demande?.femme || "").toString())
        .filter(Boolean)
    ).size;
    const propositionsRecues = propositionsLiees.length;

    let rang = "Bronze";
    if (totalMontant >= 3000) rang = "Or";
    else if (totalMontant >= 1500) rang = "Argent";

    const statCards = [
      { label: "Total donné", value: `${formatAmount(totalMontant)} TND`, icon: "💰", color: GOLD },
      { label: "Dons effectués", value: donsEffectues, icon: "🎁", color: "#EC7FA7" },
      { label: "Femmes aidées", value: femmesAidees, icon: "💝", color: "#EF4444" },
      { label: "Propositions liées", value: propositionsRecues, icon: "📩", color: "#3b82f6" },
    ];

    const financierCount = dons.filter((d) => d?.type === "FINANCIER").length;
    const materielCount = dons.filter((d) => d?.type === "MATERIEL").length;
    const totalCount = dons.length || 1;
    const objectifMensuel = 1000;
    const totalMois = dons
      .filter((d) => {
        const date = new Date(d?.createdAt || d?.dateDon);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, d) => sum + (Number(d?.montant) || 0), 0);

    const impact = [
      { label: "Aide financière", pct: Math.round((financierCount / totalCount) * 100), color: GOLD },
      { label: "Aide matérielle", pct: Math.round((materielCount / totalCount) * 100), color: "#EC7FA7" },
      { label: "Objectif mensuel", pct: Math.min(100, Math.round((totalMois / objectifMensuel) * 100)), color: "#8B5CF6" },
    ];

    return { totalMontant, donsEffectues, rang, statCards, impact };
  }, [dons, propositionsLiees]);

  const recentDons = useMemo(
    () =>
      dons.slice(0, 5).map((d) => ({
        date: d?.createdAt || d?.dateDon
          ? new Date(d.createdAt || d.dateDon).toLocaleDateString("fr-FR")
          : "-",
        beneficiaire: d?.demande?.titre || "Demande generale",
        montant: Number(d?.montant) || 0,
        type: d?.type || "-",
        statut: d?.statut === "CONFIRME" ? "CONFIRME" : "EN_ATTENTE",
      })),
    [dons]
  );

  const recentPropositions = useMemo(
    () =>
      [...propositionsLiees]
        .sort((a, b) => new Date(b?.dateProposition || b?.createdAt || 0) - new Date(a?.dateProposition || a?.createdAt || 0))
        .slice(0, 4)
        .map((p) => ({
          id: p?._id,
          titreDemande: p?.demande?.titre || "Demande liée",
          description: p?.description || "Proposition sans description",
          statut: p?.statut || "PROPOSEE",
          date: p?.dateProposition || p?.createdAt
            ? new Date(p.dateProposition || p.createdAt).toLocaleDateString("fr-FR")
            : "-",
        })),
    [propositionsLiees]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .d-hero-btn:hover { background: rgba(255,255,255,0.3) !important; }
        .d-impact-btn:hover { opacity: 0.88; }
        @media (max-width: 1024px) { .d-main-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div style={styles.page}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroAvatar}>💛</div>
            <div>
              <p style={styles.heroSub}>Bienvenue,</p>
              <h2 style={styles.heroName}>{user?.firstName || "Ahmed"} {user?.lastName || ""}</h2>
              <span style={styles.heroBadge}>Donateur {stats.rang} · {formatAmount(stats.totalMontant)} TND donnés</span>
              <p style={{ margin: "10px 0 0", fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                Acteur financier ou matériel, vous faites des dons, financez les demandes
                et aidez indirectement les bénéficiaires.
              </p>
            </div>
          </div>
          <button className="d-hero-btn" style={styles.heroBtn} onClick={() => navigate("/donateur/add-don")}>
            + Faire un don
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {stats.statCards.map((s, i) => (
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
        <div style={styles.mainGrid} className="d-main-grid">
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Historique de mes dons</span>
              <button style={styles.cardLink} onClick={() => navigate("/donateur/dons")}>Voir tout</button>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Date", "Bénéficiaire", "Montant", "Type", "Statut"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td style={styles.td} colSpan={5}>Chargement...</td>
                  </tr>
                ) : recentDons.length === 0 ? (
                  <tr>
                    <td style={styles.td} colSpan={5}>Aucun don enregistré pour le moment.</td>
                  </tr>
                ) : recentDons.map((d, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{d.date}</td>
                    <td style={styles.td}><strong>{d.beneficiaire}</strong></td>
                    <td style={styles.td}><span style={styles.montantText}>{formatAmount(d.montant)} TND</span></td>
                    <td style={styles.td}>
                      <span style={styles.typePill(d.type === "FINANCIER" ? GOLD : "#3b82f6")}>{d.type}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={d.statut === "CONFIRME" ? styles.confirmedPill : styles.pendingPill}>{d.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Mon impact</span>
            </div>
            <div style={styles.impactPanel}>
              <div style={styles.trophyCircle}>🏆</div>
              <div style={styles.impactTitle}>Donateur {stats.rang}</div>
              <div style={styles.impactSub}>Soutenir les demandes et amplifier votre impact</div>
              {stats.impact.map((item, i) => (
                <div key={i}>
                  <div style={styles.progressLabel}>
                    <span style={styles.progressLabelText}>{item.label}</span>
                    <span style={styles.progressLabelVal(item.color)}>{item.pct}%</span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div style={styles.progressFill(item.pct, item.color)} />
                  </div>
                </div>
              ))}
              <button className="d-impact-btn" style={styles.impactBtn} onClick={() => navigate("/donateur/demandes-financees")}>
                📈 Demandes financées
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Propositions d'aide reçues</span>
              <button style={styles.cardLink} onClick={() => navigate("/donateur/demandes-financees")}>Demandes liées</button>
            </div>
            <div>
              {loading ? (
                <div style={{ padding: "14px 20px", color: "#64748b", fontSize: 13 }}>Chargement...</div>
              ) : recentPropositions.length === 0 ? (
                <div style={{ padding: "14px 20px", color: "#64748b", fontSize: 13 }}>
                  Aucune proposition liée à vos financements pour le moment.
                </div>
              ) : (
                recentPropositions.map((p, i) => {
                  const statusStyle =
                    p.statut === "ACCEPTEE"
                      ? styles.confirmedPill
                      : p.statut === "REFUSEE"
                      ? { ...styles.pendingPill, background: "#fef2f2", color: "#b91c1c" }
                      : styles.pendingPill;

                  return (
                    <div key={p.id || i} style={styles.propositionRow(i === recentPropositions.length - 1)}>
                      <div>
                        <span style={styles.propositionTitle}>{p.titreDemande}</span>
                        <span style={styles.propositionMeta}>📅 {p.date} · {p.description}</span>
                      </div>
                      <span style={statusStyle}>{p.statut}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
