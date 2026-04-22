import React, { useEffect, useState, useCallback } from "react";
import { Badge, Button, Dropdown, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { listNotifications, markAsRead } from "../../api/notifications";

const PINK = "#f7078b";

const TYPE_ICONS = {
  // Association
  demande_nouvelle:      "📋",
  benevole_inscrit:      "🙋",
  proposition_acceptee:  "✅",
  proposition_rejetee:   "❌",
  // Bénévole
  affectation:           "📌",
  nouvelle_action:       "🤝",
  participation_confirmee: "✅",
  participation_annulee: "🚫",
  // Donateur
  don_enregistre:        "🎁",
  don_confirme:          "💰",
  don_refuse:            "💔",
  don_suivi:             "📊",
  don_reçu:              "💝",
  // Administrateur
  demande_en_attente:    "⏳",
  action_a_valider:      "🔍",
  new_user:              "👤",
  new_association:       "🏢",
  activite_importante:   "📢",
  // Femme malade
  demande_acceptee:      "✅",
  demande_rejetee:       "❌",
  demande_en_cours:      "🔄",
  demande_terminee:      "🏁",
  proposition_aide:      "💝",
  affectation_confirmee: "🤗",
  // Événements
  event_today:           "🔔",
  event_tomorrow:        "⏰",
  event_reminder:        "📅",
  // Général
  info:                  "ℹ️",
};

function timeAgo(dateStr) {
  if (!dateStr) return "-";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `${mins} min`;
  if (hours < 24) return `${hours}h`;
  return `${days}j`;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await listNotifications();
      const data = res?.data?.notifications || res?.data?.data || res?.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.lu).length;
  const recent = notifications.slice(0, 5);

  const handleItemClick = async (notif) => {
    try {
      if (!notif.lu) {
        await markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, lu: true } : n))
        );
      }
    } catch (error) {}

    setOpen(false);
    if (notif.lien) {
      navigate(notif.lien);
    } else {
      navigate("/notifications");
    }
  };

  const dropdownContent = (
    <div
      style={{
        width: 340,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        border: "1px solid #f0f0f0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid #f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, color: "#1E293B" }}>
          Notifications {unreadCount > 0 && <span style={{ color: PINK }}>({unreadCount})</span>}
        </span>

        <button
          onClick={() => {
            setOpen(false);
            navigate("/notifications");
          }}
          style={{
            background: "none",
            border: "none",
            color: PINK,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tout voir →
        </button>
      </div>

      {recent.length === 0 ? (
        <div style={{ padding: 20 }}>
          <Empty description="Aucune notification" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {recent.map((notif) => (
            <div
              key={notif._id || notif.id}
              onClick={() => handleItemClick(notif)}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 16px",
                cursor: "pointer",
                background: notif.lu ? "#fff" : "#FFF5F8",
                borderBottom: "1px solid #f8f8f8",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F8F9FA",
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              >
                {TYPE_ICONS[notif.type] || "🔔"}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: 12.5,
                    fontWeight: notif.lu ? 400 : 600,
                    color: "#1E293B",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {notif.message || notif.titre || "-"}
                </p>
                <span style={{ color: "#94A3B8", fontSize: 11 }}>
                  {timeAgo(notif.createdAt || notif.dateEnvoi || notif.date)}
                </span>
              </div>

              {!notif.lu && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: PINK,
                    flexShrink: 0,
                    alignSelf: "center",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: "12px 18px", borderTop: "1px solid #f5f5f5", textAlign: "center" }}>
        <button
          onClick={() => {
            setOpen(false);
            navigate("/notifications");
          }}
          style={{
            background: PINK,
            border: "none",
            color: "#fff",
            borderRadius: 10,
            padding: "8px 24px",
            fontWeight: 600,
            fontSize: 12.5,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Voir toutes les notifications
        </button>
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => dropdownContent}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Badge count={unreadCount} size="small" color={PINK} overflowCount={9}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: open ? "#FFF0F5" : "transparent",
          }}
        />
      </Badge>
    </Dropdown>
  );
}