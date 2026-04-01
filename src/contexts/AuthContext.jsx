import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [token, setTokenState] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function setToken(newToken) {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
      setUser(null);
    }
  }

  async function fetchCurrentUser() {
    try {
      if (!localStorage.getItem("token")) {
        setUser(null);
        return null;
      }

      const response = await getCurrentUser();
      const currentUser = response?.data?.user || response?.data || null;
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);
      return null;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setTokenState(null);
    setUser(null);
  }

  useEffect(() => {
    async function initAuth() {
      try {
        if (token) {
          await fetchCurrentUser();
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        loading,
        fetchCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;