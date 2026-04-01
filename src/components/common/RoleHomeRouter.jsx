import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const RoleHomeRouter = () => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "ADMINISTRATEUR":
      return <Navigate to="/admin/dashboard" replace />;
    case "FEMME MALADE":
      return <Navigate to="/femme/dashboard" replace />;
    case "ASSOCIATION":
      return <Navigate to="/association/dashboard" replace />;
    case "BENEVOLE":
      return <Navigate to="/benevole/dashboard" replace />;
    case "DONTEUR":
    case "DONATEUR":
      return <Navigate to="/donateur/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default RoleHomeRouter;