import React, { useContext } from "react";
import { Avatar, Button, Card, Descriptions, Divider, Tag } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const ROLE_COLORS = {
  ADMINISTRATEUR: "geekblue",
  ASSOCIATION: "cyan",
  BENEVOLE: "green",
  DONTEUR: "gold",
  "FEMME MALADE": "magenta",
};

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h4>My Profile</h4>
      <Divider />

      <Card style={{ maxWidth: 600 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Avatar
            src={
              user?.avatar
                ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}/uploads/${user.avatar}`
                : undefined
            }
            icon={!user?.avatar && <UserOutlined />}
            size={80}
          />

          <div>
            <h3 style={{ marginBottom: 8 }}>
              {user?.firstName || "-"} {user?.lastName || ""}
            </h3>

            <Tag color={ROLE_COLORS[user?.role] || "default"}>
              {user?.role || "-"}
            </Tag>
          </div>
        </div>

        <Descriptions column={1} bordered>
          <Descriptions.Item label="Email">
            {user?.email || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="First Name">
            {user?.firstName || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Last Name">
            {user?.lastName || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Date of Birth">
            {user?.dob ? new Date(user.dob).toLocaleDateString("fr-FR") : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Role">
            <Tag color={ROLE_COLORS[user?.role] || "default"}>
              {user?.role || "-"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Creation Date">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("fr-FR")
              : "-"}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 16 }}>
          <Link to="/change-password">
            <Button icon={<LockOutlined />}>Change Password</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Profile;