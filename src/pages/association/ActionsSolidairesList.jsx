import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {
  deleteActionSolidaire,
  listActionsSolidaires,
  participerAction,
} from "../../api/actionSolidaires";

const TEAL = "#0F9488";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_DARK = "#085041";

const statutConfig = {
  EN_ATTENTE: { label: "En attente", bg: "#FFF7ED", color: "#92400E", dot: "#F59E0B" },
  TERMINEE: { label: "Terminée", bg: "#F0FDF4", color: "#14532D", dot: "#22C55E" },
};

function getActionStatus(action) {
  if (!action?.dateAction) {
    return "EN_ATTENTE";
  }

  const actionDate = new Date(action.dateAction);

  if (Number.isNaN(actionDate.getTime())) {
    return "EN_ATTENTE";
  }

  const endOfActionDay = new Date(actionDate);
  endOfActionDay.setHours(23, 59, 59, 999);

  return endOfActionDay < new Date() ? "TERMINEE" : "EN_ATTENTE";
}

const styles = {
  page: {
    fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
    minHeight: "100vh",
    padding: "32px 0",
    color: "#1a1a1a",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
    gap: 16,
    flexWrap: "wrap",
  },
  headerLeft: {},
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: TEAL,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  addBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: TEAL,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "11px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.15s",
    textDecoration: "none",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  filterChip: (active) => ({
    padding: "6px 16px",
    borderRadius: 99,
    border: active ? `1.5px solid ${TEAL}` : "1.5px solid #e2e8f0",
    background: active ? TEAL_LIGHT : "#fff",
    color: active ? TEAL_DARK : "#64748b",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.2s, transform 0.2s",
    display: "flex",
    flexDirection: "column",
  },
  cardAccent: (statut) => ({
    height: 4,
    background: statutConfig[statut]?.dot || TEAL,
  }),
  cardBody: {
    padding: "20px 20px 16px",
    flex: 1,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    flex: 1,
    paddingRight: 12,
    lineHeight: 1.3,
  },
  statut: (statut) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: 99,
    background: statutConfig[statut]?.bg,
    color: statutConfig[statut]?.color,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.03em",
    whiteSpace: "nowrap",
  }),
  statutDot: (statut) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: statutConfig[statut]?.dot,
    flexShrink: 0,
  }),
  cardMeta: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 12,
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#475569",
  },
  metaIcon: {
    width: 16,
    height: 16,
    flexShrink: 0,
    color: "#94a3b8",
  },
  divider: {
    height: 1,
    background: "#f1f5f9",
    margin: "0",
  },
  cardFooter: {
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  assocLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  assocName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
  },
  actionBtns: {
    display: "flex",
    gap: 6,
  },
  participerBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    background: TEAL,
    color: "#fff",
    border: "none",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  deleteBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    background: "#FEF2F2",
    color: "#DC2626",
    border: "1px solid #FECACA",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#94a3b8",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#64748b",
    margin: "0 0 8px",
  },
  emptyText: {
    fontSize: 14,
    margin: 0,
  },
  benevolesPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "#F5F3FF",
    color: "#5B21B6",
    borderRadius: 99,
    padding: "2px 8px",
    fontSize: 12,
    fontWeight: 600,
  },
  loadingWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 16,
  },
  skeleton: {
    background: "#f8fafc",
    borderRadius: 16,
    height: 180,
    animation: "pulse 1.5s ease-in-out infinite",
  },
};

const FILTERS = ["Toutes", "EN_ATTENTE", "TERMINEE"];
const FILTER_LABELS = {
  Toutes: "Toutes",
  EN_ATTENTE: "En attente",
  TERMINEE: "Terminées",
};

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" style={styles.metaIcon} stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="14" height="12" rx="2" />
      <path d="M5 1v4M11 1v4M1 7h14" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" style={styles.metaIcon} stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="5" r="3" />
      <path d="M1 14c0-3.314 3.134-6 7-6s7 2.686 7 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

function ConfirmDialog({ message: msg, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(15,20,40,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "24px 28px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          maxWidth: 280,
          width: "90%",
        }}
      >
        <p style={{ margin: "0 0 20px", fontSize: 15, color: "#0f172a", lineHeight: 1.5 }}>
          {msg}
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              ...styles.deleteBtn,
              background: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
            }}
          >
            Annuler
          </button>
          <button onClick={onConfirm} style={styles.deleteBtn}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ item, user, onParticiper, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const statut = getActionStatus(item);
  const cfg = statutConfig[statut] || statutConfig.EN_ATTENTE;

  const dateStr = item.dateAction
    ? new Date(item.dateAction).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const assocName = item.association
    ? `${item.association.firstName || ""} ${item.association.lastName || ""}`.trim() ||
      item.association.nomOrganisation ||
      "—"
    : "—";

  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hover ? "0 6px 24px rgba(15,148,136,0.12)" : styles.card.boxShadow,
        transform: hover ? "translateY(-2px)" : "none",
        position: "relative",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.cardAccent(statut)} />
      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <h3 style={styles.cardTitle}>{item.titre}</h3>
          <span style={styles.statut(statut)}>
            <span style={styles.statutDot(statut)} />
            {cfg.label}
          </span>
        </div>

        {item.description && (
          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              margin: "0 0 4px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.description}
          </p>
        )}

        <div style={styles.cardMeta}>
          <div style={styles.metaRow}>
            <CalendarIcon />
            <span>{dateStr}</span>
          </div>
          <div style={styles.metaRow}>
            <UserIcon />
            <span style={styles.benevolesPill}>
              {item.benevoles?.length || 0} bénévole{item.benevoles?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.cardFooter}>
        <div>
          <div style={styles.assocLabel}>Association</div>
          <div style={styles.assocName}>{assocName}</div>
        </div>

        <div style={styles.actionBtns}>
          {user?.role === "BENEVOLE" && statut === "EN_ATTENTE" && (
            <button style={styles.participerBtn} onClick={() => onParticiper(item._id)}>
              Participer
            </button>
          )}

          {(user?.role === "ASSOCIATION" || user?.role === "ADMINISTRATEUR") && (
            <button style={styles.deleteBtn} onClick={() => setConfirmOpen(true)}>
              Supprimer
            </button>
          )}
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          message="Supprimer cette action solidaire définitivement ?"
          onConfirm={() => {
            setConfirmOpen(false);
            onDelete(item._id);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}

const ActionsSolidairesList = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Toutes");
  const [refresh, setRefresh] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await listActionsSolidaires();
        setActions(response.data.actions || []);
      } catch (error) {
        console.error(error.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refresh]);

  const handleParticiper = async (id) => {
    try {
      await participerAction(id);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error.message || "Erreur lors de la participation");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteActionSolidaire(id);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleAddAction = () => {
    if (user?.role === "ASSOCIATION") {
      navigate("/association/actions-solidaires/add");
      return;
    }

    if (user?.role === "ADMINISTRATEUR") {
      navigate("/admin/actions-solidaires/add");
      return;
    }

    navigate("/association/actions-solidaires/add");
  };

  const filtered =
    filter === "Toutes"
      ? actions
      : actions.filter((action) => getActionStatus(action) === filter);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.eyebrow}>Solidarité</div>
          <h1 style={styles.title}>Actions solidaires</h1>
          <p style={styles.subtitle}>
            {actions.length} action{actions.length !== 1 ? "s" : ""} au total
          </p>
        </div>

        {(user?.role === "ASSOCIATION" || user?.role === "ADMINISTRATEUR") && (
          <button style={styles.addBtn} onClick={handleAddAction}>
            <PlusIcon /> Nouvelle action
          </button>
        )}
      </div>

      <div style={styles.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f}
            style={styles.filterChip(filter === f)}
            onClick={() => setFilter(f)}
          >
            {FILTER_LABELS[f]}
            {f !== "Toutes" && (
              <span style={{ marginLeft: 5, opacity: 0.7 }}>
                ({actions.filter((action) => getActionStatus(action) === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loadingWrap}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={styles.skeleton} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🌱</div>
          <h3 style={styles.emptyTitle}>Aucune action trouvée</h3>
          <p style={styles.emptyText}>
            {filter === "Toutes"
              ? "Il n'y a pas encore d'actions solidaires."
              : `Aucune action avec le statut « ${FILTER_LABELS[filter]} ».`}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((item) => (
            <ActionCard
              key={item._id}
              item={item}
              user={user}
              onParticiper={handleParticiper}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionsSolidairesList;