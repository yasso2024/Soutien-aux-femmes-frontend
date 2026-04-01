import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { AuthContext } from "../../contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { token, user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;