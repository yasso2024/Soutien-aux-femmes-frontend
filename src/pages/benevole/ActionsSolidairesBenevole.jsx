import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { listActionsSolidaires, participerAction, quitterAction } from "../../api/actionSolidaires";

const PURPLE = "#8B5CF6";
const PURPLE_DARK = "#6D28D9";
const PURPLE_LIGHT = "#F5F3FF";

// ─── helpers ────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isAlreadyIn(action, userId) {
  const id = String(userId || "");
  return (action.benevoles || []).some(
    (b) => String(b?._id || b) === id
  );
}

// ─── icons ───────────────────────────────────────────────────────────────────
function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="1" y="3" width="14" height="12" rx="2" />
      <path d="M5 1v4M11 1v4M1 7h14" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="6" cy="5" r="3" />
      <path d="M1 14c0-2.761 2.239-5 5-5s5 2.239 5 5" />
      <path d="M11 8c1.657 0 3 1.343 3 3v1" />
      <circle cx="12" cy="4" r="2" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.6">
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3 3" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M3 8l4 4 6-7" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.8 4H14l-3.5 2.7 1.3 4.3L8 9.6l-3.8 2.4 1.3-4.3L2 5h4.2z" />
    </svg>
  );
}

// ─── statut config ───────────────────────────────────────────────────────────
const STATUT = {
  EN_ATTENTE: { label: "En attente",  bg: "#FFF7ED", color: "#92400E", dot: "#F59E0B" },
  VALIDEE:    { label: "Validée",     bg: "#F0FDF4", color: "#14532D", dot: "#22C55E" },
  REFUSEE:    { label: "Refusée",     bg: "#FEF2F2", color: "#991B1B", dot: "#EF4444" },
  TERMINEE:   { label: "Terminée",    bg: "#F8FAFC", color: "#334155", dot: "#94A3B8" },
};

const FILTERS = [
  { key: "TOUTES",   label: "Toutes" },
  { key: "VALIDEE",  label: "Disponibles" },
  { key: "TERMINEE", label: "Terminées" },
  { key: "MES",      label: "Mes participations" },
];

// ─── derive effective statut (same logic as stats) ─────────────────────────
function getEffectiveStatutCard(action) {
  if (action?.statut && action.statut !== "EN_ATTENTE") return action.statut;
  if (!action?.dateAction) return "EN_ATTENTE";
  const d = new Date(action.dateAction);
  if (Number.isNaN(d.getTime())) return "EN_ATTENTE";
  const endOfDay = new Date(d);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay < new Date() ? "TERMINEE" : "EN_ATTENTE";
}

// ─── ActionCard ──────────────────────────────────────────────────────────────
function ActionCard({ action, userId, onParticiper, onQuitter, joining, leaving }) {
  const [hovered, setHovered] = useState(false);
  const statut = getEffectiveStatutCard(action);
  const cfg = STATUT[statut] || STATUT.EN_ATTENTE;
  const already = isAlreadyIn(action, userId);
  const isDisponible = statut === "VALIDEE" || statut === "EN_ATTENTE";
  const canJoin = isDisponible && !already;
  const canLeave = already;

  const assocName =
    action.association
      ? (action.association.nomOrganisation ||
         `${action.association.firstName || ""} ${action.association.lastName || ""}`.trim() ||
         "Association")
      : "—";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 8px 32px rgba(139,92,246,0.14)"
          : "0 2px 10px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "none",
        transition: "box-shadow 0.2s, transform 0.2s",
        display: "flex",
        flexDirection: "column",
        border: already ? `2px solid ${PURPLE}` : "1.5px solid #f1f5f9",
      }}
    >
      {/* accent bar */}
      <div style={{ height: 4, background: cfg.dot }} />

      {/* body */}
      <div style={{ padding: "18px 20px 14px", flex: 1 }}>
        {/* top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.3, flex: 1, paddingRight: 10 }}>
            {action.titre}
          </h3>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 9px", borderRadius: 99,
            background: cfg.bg, color: cfg.color,
            fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
            {cfg.label}
          </span>
        </div>

        {/* description */}
        {action.description && (
          <p style={{
            margin: "0 0 12px", fontSize: 13, color: "#64748b", lineHeight: 1.55,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {action.description}
          </p>
        )}

        {/* meta rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#475569" }}>
            <IconCalendar /> {fmtDate(action.dateAction)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#475569" }}>
            <IconUsers />
            <span style={{
              background: PURPLE_LIGHT, color: PURPLE_DARK,
              borderRadius: 99, padding: "1px 8px", fontSize: 12, fontWeight: 600,
            }}>
              {action.benevoles?.length || 0} bénévole{action.benevoles?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* divider */}
      <div style={{ height: 1, background: "#f1f5f9" }} />

      {/* footer */}
      <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 1 }}>Association</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{assocName}</div>
        </div>

        {already ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: PURPLE_LIGHT, color: PURPLE_DARK,
              borderRadius: 99, padding: "6px 13px",
              fontSize: 12, fontWeight: 700,
            }}>
              <IconCheck /> Inscrit
            </span>
            {canLeave && (
              <button
                disabled={leaving === action._id}
                onClick={(e) => { e.stopPropagation(); onQuitter(action._id); }}
                style={{
                  background: leaving === action._id ? "#e5e7eb" : "#FEF2F2",
                  color: leaving === action._id ? "#6b7280" : "#DC2626",
                  border: "1px solid #FECACA",
                  borderRadius: 10,
                  padding: "7px 13px", fontSize: 12, fontWeight: 600,
                  cursor: leaving === action._id ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {leaving === action._id ? "..." : "❌ Se désinscrire"}
              </button>
            )}
          </div>
        ) : canJoin ? (
          <button
            disabled={joining === action._id}
            onClick={() => onParticiper(action._id)}
            style={{
              background: joining === action._id ? "#e5e7eb" : PURPLE,
              color: joining === action._id ? "#6b7280" : "#fff",
              border: "none", borderRadius: 10,
              padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: joining === action._id ? "not-allowed" : "pointer",
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
          >
            {joining === action._id ? "..." : "Rejoindre"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────
export default function ActionsSolidairesBenevole() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TOUTES");
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState(null);
  const [leaving, setLeaving] = useState(null);
  const [toast, setToast] = useState(null);

  const userId = user?._id || user?.id || "";

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchActions() {
    setLoading(true);
    try {
      const res = await listActionsSolidaires();
      setActions(Array.isArray(res?.data?.actions) ? res.data.actions : []);
    } catch (err) {
      setActions([]);
      showToast(err?.message || "Impossible de charger les actions. Vérifiez la connexion au serveur.", false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchActions(); }, []);

  async function handleJoin(id) {
    setJoining(id);
    try {
      await participerAction(id);
      showToast("🎉 Participation enregistrée !");
      await fetchActions();
    } catch (err) {
      showToast(err.message || "Erreur lors de la participation", false);
    } finally {
      setJoining(null);
    }
  }

  async function handleLeave(id) {
    setLeaving(id);
    // optimistic update — remove user from benevoles immediately
    setActions((prev) =>
      prev.map((a) =>
        a._id === id
          ? { ...a, benevoles: (a.benevoles || []).filter((b) => String(b?._id || b) !== String(userId)) }
          : a
      )
    );
    try {
      await quitterAction(id);
      showToast("✅ Désinscription effectuée");
      await fetchActions();
    } catch (err) {
      // rollback on error
      await fetchActions();
      showToast(err.message || "Erreur lors de la désinscription", false);
    } finally {
      setLeaving(null);
    }
  }

  // ── computed stats ──────────────────────────────────────────────────────
  function getEffectiveStatut(action) {
    if (action?.statut && action.statut !== "EN_ATTENTE") return action.statut;
    if (!action?.dateAction) return "EN_ATTENTE";
    const d = new Date(action.dateAction);
    if (Number.isNaN(d.getTime())) return "EN_ATTENTE";
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay < new Date() ? "TERMINEE" : "EN_ATTENTE";
  }

  const mesParticipations = actions.filter((a) => isAlreadyIn(a, userId));
  const disponibles = actions.filter((a) => {
    const s = getEffectiveStatut(a);
    return (s === "VALIDEE" || s === "EN_ATTENTE") && !isAlreadyIn(a, userId);
  });
  const terminees = actions.filter((a) => getEffectiveStatut(a) === "TERMINEE");

  const STAT_CARDS = [
    { label: "Mes participations", value: mesParticipations.length, icon: "🏅", color: PURPLE },
    { label: "Actions disponibles", value: disponibles.length,      icon: "🎯", color: "#22C55E" },
    { label: "Terminées",           value: terminees.length,        icon: "✅", color: "#0EA5E9" },
    { label: "Total actions",       value: actions.length,          icon: "📋", color: "#F59E0B" },
  ];

  // ── filter + search ─────────────────────────────────────────────────────
  let displayed = actions;
  if (filter === "VALIDEE")  displayed = actions.filter((a) => {
    const s = getEffectiveStatut(a);
    return s === "VALIDEE" || s === "EN_ATTENTE";
  });
  if (filter === "TERMINEE") displayed = actions.filter((a) => getEffectiveStatut(a) === "TERMINEE");
  if (filter === "MES")      displayed = mesParticipations;

  if (search.trim()) {
    const q = search.toLowerCase();
    displayed = displayed.filter(
      (a) =>
        a.titre?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
    );
  }

  const competences = user?.competences || [];

  return (
    <div style={{ fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif", color: "#1a1a1a", paddingBottom: 48 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
      `}</style>

      {/* ── toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: toast.ok ? "#14532D" : "#991B1B",
          color: "#fff", borderRadius: 12, padding: "12px 20px",
          fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          transition: "opacity 0.3s",
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── hero ─────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)`,
        borderRadius: 20, padding: "28px 32px",
        marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
        boxShadow: "0 8px 32px rgba(139,92,246,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "3px solid rgba(255,255,255,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, flexShrink: 0,
          }}>
            🤝
          </div>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
              Espace bénévole
            </p>
            <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#fff" }}>
              Actions solidaires
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
              Rejoignez des actions et faites la différence
            </p>
          </div>
        </div>

        {/* competences pills */}
        {competences.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 300 }}>
            {competences.slice(0, 4).map((c, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.35)",
                color: "#fff", borderRadius: 99,
                padding: "4px 12px", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <IconStar /> {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── stats row ────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 14, marginBottom: 24,
      }}>
        {STAT_CARDS.map((s) => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 14,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            padding: "18px 20px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: s.color + "18",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── search + filters ─────────────────────────────────────── */}
      <div style={{ marginBottom: 18, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {/* search */}
        <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 320 }}>
          <span style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)", pointerEvents: "none" }}>
            <IconSearch />
          </span>
          <input
            type="text"
            placeholder="Rechercher une action…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px 9px 36px",
              borderRadius: 10, border: "1.5px solid #e2e8f0",
              fontSize: 13, outline: "none",
              fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
        </div>

        {/* filter chips */}
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "8px 16px", borderRadius: 99,
              border: filter === f.key ? `1.5px solid ${PURPLE}` : "1.5px solid #e2e8f0",
              background: filter === f.key ? PURPLE_LIGHT : "#fff",
              color: filter === f.key ? PURPLE_DARK : "#64748b",
              fontSize: 13, fontWeight: filter === f.key ? 700 : 400,
              cursor: "pointer", transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            {f.label}
            {f.key === "TOUTES" ? (
              <span style={{ marginLeft: 5, opacity: 0.65 }}>({actions.length})</span>
            ) : f.key === "VALIDEE" ? (
              <span style={{ marginLeft: 5, opacity: 0.65 }}>({disponibles.length})</span>
            ) : f.key === "MES" ? (
              <span style={{ marginLeft: 5, opacity: 0.65 }}>({mesParticipations.length})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── grid ─────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              height: 200, borderRadius: 18,
              background: "linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%)",
              backgroundSize: "200% 100%",
              animation: "skeleton-shimmer 1.4s ease-in-out infinite",
            }} />
          ))}
          <style>{`@keyframes skeleton-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px", color: "#94a3b8" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#64748b", margin: "0 0 8px" }}>
            Aucune action trouvée
          </h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            {search ? "Essayez un autre mot-clé" : "Revenez plus tard pour de nouvelles actions"}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {displayed.map((action) => (
            <ActionCard
              key={action._id}
              action={action}
              userId={userId}
              onParticiper={handleJoin}
              onQuitter={handleLeave}
              joining={joining}
              leaving={leaving}
            />
          ))}
        </div>
      )}
    </div>
  );
}
