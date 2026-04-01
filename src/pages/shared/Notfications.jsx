// Notifications.jsx — Système complet: tous rôles + rappels events + nouvelles inscriptions
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../../api/notifications"; // adjust path
// import { AuthContext } from "../contexts/AuthContext"; // uncomment in project

const PINK = "#e91e63";
const PINK_DARK = "#c2185b";
const PINK_LIGHT = "#FCE4EC";

// ─── Notification type config ─────────────────────────────────────────────────
const TYPE_CONFIG = {
  // Event reminders
  event_reminder: {
    icon: "📅",
    bg: "#EFF6FF",
    color: "#2563EB",
    border: "#BFDBFE",
    label: "Rappel événement",
  },
  event_tomorrow: {
    icon: "⏰",
    bg: "#FFF7ED",
    color: "#EA580C",
    border: "#FED7AA",
    label: "Événement demain",
  },
  event_today: {
    icon: "🔔",
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#FECACA",
    label: "Aujourd'hui !",
  },
  // New user signup (admin only)
  new_user: {
    icon: "👤",
    bg: "#F0FDF4",
    color: "#16A34A",
    border: "#BBF7D0",
    label: "Nouveau membre",
  },
  new_association: {
    icon: "🏢",
    bg: "#F5F3FF",
    color: "#7C3AED",
    border: "#DDD6FE",
    label: "Nouvelle association",
  },
  // Donations (donateur + admin)
  don_confirme: {
    icon: "💰",
    bg: "#FFFBEB",
    color: "#D97706",
    border: "#FDE68A",
    label: "Don confirmé",
  },
  don_reçu: {
    icon: "💝",
    bg: PINK_LIGHT,
    color: PINK_DARK,
    border: "#F48FB1",
    label: "Don reçu",
  },
  // Demandes (femme malade + admin + association)
  demande_acceptee: {
    icon: "✅",
    bg: "#F0FDF4",
    color: "#16A34A",
    border: "#BBF7D0",
    label: "Demande acceptée",
  },
  demande_rejetee: {
    icon: "❌",
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#FECACA",
    label: "Demande refusée",
  },
  demande_nouvelle: {
    icon: "📋",
    bg: "#EFF6FF",
    color: "#2563EB",
    border: "#BFDBFE",
    label: "Nouvelle demande",
  },
  // Affectations (bénévole)
  affectation: {
    icon: "📅",
    bg: "#F0FDF4",
    color: "#16A34A",
    border: "#BBF7D0",
    label: "Affectation",
  },
  // Propositions aide (association + femme)
  proposition_aide: {
    icon: "💝",
    bg: PINK_LIGHT,
    color: PINK_DARK,
    border: "#F48FB1",
    label: "Proposition d'aide",
  },
  // Default
  info: {
    icon: "ℹ️",
    bg: "#F8FAFC",
    color: "#475569",
    border: "#E2E8F0",
    label: "Information",
  },
};

const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.info;

// ─── Notification Card ─────────────────────────────────────────────────────
function NotificationCard({ notif, onMarkRead, onDelete }) {
  const cfg = getTypeConfig(notif.type);
  const isUnread = !notif.lu;
  const navigate = useNavigate();

  const handleClick = () => {
    if (isUnread) onMarkRead(notif._id);
    if (notif.lien) navigate(notif.lien);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "16px 18px",
        background: isUnread ? cfg.bg : "#fff",
        borderRadius: 14,
        border: `1.5px solid ${isUnread ? cfg.border : "#F1F5F9"}`,
        cursor: notif.lien ? "pointer" : "default",
        transition: "all 0.2s ease",
        position: "relative",
        boxShadow: isUnread ? `0 3px 14px ${cfg.color}14` : "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onClick={handleClick}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; }}
    >
      {/* Unread dot */}
      {isUnread && (
        <span style={{
          position: "absolute", top: 14, right: 14,
          width: 8, height: 8, borderRadius: "50%",
          background: cfg.color, boxShadow: `0 0 6px ${cfg.color}80`,
        }} />
      )}

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: isUnread ? "#fff" : cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
      }}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.border}`,
            padding: "1px 8px", borderRadius: 20,
            fontSize: 10.5, fontWeight: 700,
          }}>
            {cfg.label}
          </span>
          <span style={{ color: "#94A3B8", fontSize: 11 }}>{timeAgo(notif.createdAt || notif.date)}</span>
        </div>
        <p style={{
          margin: "0 0 2px",
          fontSize: 13.5, fontWeight: isUnread ? 600 : 400,
          color: isUnread ? "#1E293B" : "#374151",
          lineHeight: 1.5,
        }}>
          {notif.message || notif.titre}
        </p>
        {notif.description && (
          <p style={{ margin: 0, fontSize: 12, color: "#94A3B8", lineHeight: 1.4 }}>
            {notif.description}
          </p>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notif._id); }}
        style={{
          background: "none", border: "none", color: "#CBD5E1",
          cursor: "pointer", fontSize: 14, padding: "4px",
          borderRadius: 6, transition: "color 0.15s", flexShrink: 0, alignSelf: "flex-start",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#CBD5E1"; }}
        title="Supprimer"
      >
        🗑️
      </button>
    </div>
  );
}

// ─── Main Notifications Page ──────────────────────────────────────────────────
export default function Notifications() {
  const navigate = useNavigate();
  // const { user } = useContext(AuthContext); // uncomment in project
  const user = { role: "ADMINISTRATEUR", firstName: "Admin" }; // demo — remove in project

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // ── Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listNotifications();
      setNotifications(res?.data?.notifications || res?.data || []);
    } catch {
      // Fallback demo data to visualize the system
      setNotifications(getDemoNotifications(user?.role));
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    loadNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, lu: true } : n));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Supprimer toutes les notifications ?")) return;
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch {}
  };

  // ── Filters config
  const filterConfig = [
    { key: "all", label: "Toutes", icon: "🔔" },
    { key: "unread", label: "Non lues", icon: "⚪" },
    { key: "event", label: "Événements", icon: "📅" },
    { key: "demande", label: "Demandes", icon: "📋" },
    { key: "don", label: "Dons", icon: "💰" },
    { key: "user", label: "Membres", icon: "👥" },
  ];

  // Only show filters relevant to the role
  const visibleFilters = filterConfig.filter((f) => {
    if (f.key === "all" || f.key === "unread" || f.key === "event") return true;
    if (f.key === "user" && user?.role === "ADMINISTRATEUR") return true;
    if (f.key === "demande" && ["ADMINISTRATEUR", "FEMME MALADE", "ASSOCIATION"].includes(user?.role)) return true;
    if (f.key === "don" && ["ADMINISTRATEUR", "DONTEUR", "FEMME MALADE"].includes(user?.role)) return true;
    return false;
  });

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.lu;
    if (activeFilter === "event") return n.type?.includes("event");
    if (activeFilter === "demande") return n.type?.includes("demande");
    if (activeFilter === "don") return n.type?.includes("don");
    if (activeFilter === "user") return n.type?.includes("user") || n.type?.includes("association");
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.lu).length;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1E293B" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span style={{
                background: PINK, color: "#fff",
                borderRadius: 20, padding: "3px 12px",
                fontSize: 13, fontWeight: 700,
                boxShadow: `0 3px 10px ${PINK}50`,
              }}>
                {unreadCount} nouvelles
              </span>
            )}
          </div>
          <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>
            {unreadCount > 0
              ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Tout est à jour ✓"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{ padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${PINK}`, background: "transparent", color: PINK_DARK, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}
            >
              ✓ Tout marquer lu
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "transparent", color: "#94A3B8", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}
            >
              🗑️ Tout effacer
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {visibleFilters.map((f) => {
          const count = f.key === "all" ? notifications.length
            : f.key === "unread" ? unreadCount
            : notifications.filter((n) => {
                if (f.key === "event") return n.type?.includes("event");
                if (f.key === "demande") return n.type?.includes("demande");
                if (f.key === "don") return n.type?.includes("don");
                if (f.key === "user") return n.type?.includes("user") || n.type?.includes("association");
                return false;
              }).length;
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "7px 14px", borderRadius: 20, fontSize: 13,
                fontWeight: isActive ? 700 : 500, cursor: "pointer", transition: "all 0.2s",
                background: isActive ? PINK : "#fff",
                border: `1.5px solid ${isActive ? PINK : "#E5E7EB"}`,
                color: isActive ? "#fff" : "#64748B",
                boxShadow: isActive ? `0 3px 12px ${PINK}35` : "none",
              }}
            >
              {f.icon} {f.label}
              {count > 0 && (
                <span style={{
                  marginLeft: 6, background: isActive ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                  color: isActive ? "#fff" : "#64748B", borderRadius: 10,
                  padding: "0 6px", fontSize: 11, fontWeight: 700,
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8" }}>
          <div style={{ fontSize: 36, marginBottom: 12, animation: "spin 1.5s linear infinite", display: "inline-block" }}>🔄</div>
          <p>Chargement des notifications...</p>
        </div>
      ) : filteredNotifs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", background: "#fff", borderRadius: 20, border: "1.5px solid #F1F5F9" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🔕</div>
          <h3 style={{ color: "#1E293B", margin: "0 0 8px" }}>Aucune notification</h3>
          <p style={{ color: "#94A3B8", fontSize: 13 }}>
            {activeFilter === "unread" ? "Toutes vos notifications ont été lues ✓" : "Aucune notification dans cette catégorie"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredNotifs.map((notif) => (
            <NotificationCard
              key={notif._id}
              notif={notif}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Demo data per role (for development / fallback) ──────────────────────────
function getDemoNotifications(role) {
  const now = new Date();
  const h = (hours) => new Date(now - hours * 3600000).toISOString();

  const base = [
    {
      _id: "evt1",
      type: "event_today",
      message: "Rappel : La Marche rose de sensibilisation a lieu AUJOURD'HUI !",
      description: "Tunis, Avenue Habib Bourguiba · 10h00",
      lu: false,
      lien: "/events",
      createdAt: h(0.5),
    },
    {
      _id: "evt2",
      type: "event_tomorrow",
      message: "Rappel : Atelier bien-être et relaxation — c'est demain",
      description: "Centre Belvédère, Tunis · 14h00",
      lu: false,
      lien: "/events",
      createdAt: h(2),
    },
    {
      _id: "evt3",
      type: "event_reminder",
      message: "Conférence « Avancées thérapeutiques » dans 3 jours",
      description: "Hôtel Africa, Tunis · 18 Avril 2026",
      lu: true,
      lien: "/events",
      createdAt: h(8),
    },
  ];

  const byRole = {
    ADMINISTRATEUR: [
      ...base,
      { _id: "usr1", type: "new_user", message: "Nouvelle inscription : Leila Ben Salah (Femme malade)", description: "Compte en attente de validation", lu: false, lien: "/admin/utilisateurs", createdAt: h(1) },
      { _id: "usr2", type: "new_association", message: "Nouvelle association enregistrée : Association Espoir Tunis", description: "Documents fournis — en attente de vérification", lu: false, lien: "/admin/utilisateurs", createdAt: h(3) },
      { _id: "usr3", type: "new_user", message: "Nouveau bénévole inscrit : Rami Karray", description: "Disponibilité : week-ends", lu: true, lien: "/admin/utilisateurs", createdAt: h(12) },
      { _id: "dem1", type: "demande_nouvelle", message: "Nouvelle demande d'aide soumise par Fatima Zahra", description: "Type : Aide financière traitement chimio", lu: false, lien: "/admin/demandes", createdAt: h(4) },
    ],
    "FEMME MALADE": [
      ...base,
      { _id: "dem2", type: "demande_acceptee", message: "Votre demande d'aide a été acceptée ! 🎉", description: "Montant alloué : 800 TND — virement sous 48h", lu: false, lien: "/femme/demandes", createdAt: h(1) },
      { _id: "prop1", type: "proposition_aide", message: "Association Espoir Tunis vous propose une aide en transport", description: "Trajet domicile–hôpital 3x/semaine", lu: false, lien: "/femme/propositions", createdAt: h(5) },
      { _id: "don1", type: "don_reçu", message: "Un donateur anonyme a financé votre demande", description: "Contribution : 400 TND", lu: true, lien: "/femme/demandes", createdAt: h(24) },
    ],
    ASSOCIATION: [
      ...base,
      { _id: "dem3", type: "demande_nouvelle", message: "Nouvelle demande d'aide à examiner", description: "Soumise par : Meriem Jebali — Aide médicale urgente", lu: false, lien: "/association/propositions-aide", createdAt: h(2) },
      { _id: "prop2", type: "proposition_aide", message: "Votre proposition d'aide a été acceptée", description: "Femme malade : Leila Ben Salah", lu: false, lien: "/association/propositions-aide", createdAt: h(6) },
      { _id: "act1", type: "event_reminder", message: "Rappel : Réunion mensuelle de votre association demain", description: "Siège Courage Rose · 10h00", lu: true, lien: "/events", createdAt: h(10) },
    ],
    BENEVOLE: [
      ...base,
      { _id: "aff1", type: "affectation", message: "Nouvelle affectation : Transport médical", description: "Patiente : Amira Habib · Lundi 6 Avril 09h00", lu: false, lien: "/benevole/affectations", createdAt: h(1) },
      { _id: "aff2", type: "affectation", message: "Rappel affectation demain : Accompagnement chimiothérapie", description: "Hôpital Salah Azaiez · 08h30", lu: false, lien: "/benevole/affectations", createdAt: h(4) },
      { _id: "aff3", type: "info", message: "Merci pour votre bénévolat ce week-end ! 🌸", description: "Votre participation a été validée par l'équipe", lu: true, lien: null, createdAt: h(48) },
    ],
    DONTEUR: [
      ...base,
      { _id: "don2", type: "don_confirme", message: "Votre don de 500 TND a été confirmé", description: "Ref: DON-2026-0412 · Reçu fiscal disponible", lu: false, lien: "/donateur/dons", createdAt: h(1) },
      { _id: "don3", type: "don_confirme", message: "Impact de votre don : 2 femmes malades aidées ce mois", description: "Voir le détail des demandes financées", lu: false, lien: "/donateur/demandes-financees", createdAt: h(3) },
      { _id: "don4", type: "info", message: "Merci pour votre générosité 💝 — Rapport mensuel disponible", description: "Avril 2026 : 12 bénéficiaires, 8 700 TND collectés", lu: true, lien: "/donateur/dons", createdAt: h(72) },
    ],
  };

  return byRole[role] || base;
}
