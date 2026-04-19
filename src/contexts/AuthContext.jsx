import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { savePlayerID } from "../api/users";

export const AuthContext = createContext();

async function registerOneSignal(userId) {
  if (!userId) return;

  const registerHandler = async (OneSignal) => {
    try {
      if (!OneSignal || typeof OneSignal.setExternalUserId !== "function") {
        console.warn("[OneSignal] SDK not loaded or setExternalUserId unavailable");
        return;
      }

      await OneSignal.setExternalUserId(String(userId));
      const subscriptionId = typeof OneSignal.getUserId === "function"
        ? await OneSignal.getUserId()
        : OneSignal.User?.PushSubscription?.id;

      console.log("[OneSignal] external user set:", userId, "| subscription id:", subscriptionId);

      if (subscriptionId) {
        await savePlayerID(subscriptionId);
        console.log("[OneSignal] player id saved to backend:", subscriptionId);
      } else {
        console.warn("[OneSignal] no subscription id after setting external user — user may not have opted in yet");
      }
    } catch (err) {
      console.warn("OneSignal registration failed:", err?.message || err);
      // Don't throw error - let the app continue without OneSignal
    }
  };

  // Only push to deferred if OneSignalDeferred exists
  if (window.OneSignalDeferred) {
    window.OneSignalDeferred.push(registerHandler);
  } else {
    console.warn("[OneSignal] OneSignalDeferred not available, skipping registration");
  }
}

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
    try {
      if (window.OneSignal?.logout) {
        window.OneSignal.logout();
      }
    } catch (err) {
      console.warn("OneSignal logout failed:", err?.message || err);
    }
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

  // Register user with OneSignal whenever the user object is set
  useEffect(() => {
    if (user?._id) {
      registerOneSignal(user._id);
    }
  }, [user?._id]);

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