import { App, Badge, Button, Divider, Typography, Empty, Popconfirm, Spin } from "antd";
import { BellOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  deleteNotification,
  listNotifications,
  markAsRead,
} from "../../api/notifications";

const { Text } = Typography;

const NotificationsList = () => {
  const { message } = App.useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await listNotifications();
      const data =
        response?.data?.notifications || response?.data?.data || response?.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(error?.response?.data?.message || error.message || "Erreur lors du chargement");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, lu: true } : item))
      );
    } catch (error) {
      message.error(error?.response?.data?.message || error.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      message.success("Notification supprimée");
      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      message.error(error?.response?.data?.message || error.message || "Erreur");
    }
  };

  const unreadCount = notifications.filter((n) => !n.lu).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h3 style={{ margin: 0 }}>Notifications</h3>
        {unreadCount > 0 && (
          <Badge count={unreadCount} style={{ backgroundColor: "#f7078b" }} />
        )}
      </div>

      <Divider />

      {notifications.length === 0 ? (
        <Empty description="Aucune notification" />
      ) : (
        <Spin spinning={loading}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notifications.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: item.lu ? "#fff" : "#fff0f6",
                  borderRadius: 10,
                  padding: "12px 16px",
                  border: item.lu ? "1px solid #f0f0f0" : "1px solid #f7d7e5",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: item.lu ? "#f0f0f0" : "#f7078b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BellOutlined style={{ color: item.lu ? "#999" : "#fff", fontSize: 16 }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong={!item.lu} style={{ color: item.lu ? "#666" : "#1f1f1f", display: "block" }}>
                    {item.message || item.titre || "-"}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.createdAt || item.dateEnvoi || item.date
                      ? new Date(item.createdAt || item.dateEnvoi || item.date).toLocaleString("fr-FR")
                      : "-"}
                  </Text>
                </div>

                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {!item.lu && (
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      size="small"
                      onClick={() => handleMarkAsRead(item._id)}
                      style={{ color: "#f7078b" }}
                    >
                      Lue
                    </Button>
                  )}
                  <Popconfirm
                    title="Supprimer cette notification ?"
                    onConfirm={() => handleDelete(item._id)}
                    okText="Oui"
                    cancelText="Non"
                  >
                    <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        </Spin>
      )}
    </div>
  );
};

export default NotificationsList;