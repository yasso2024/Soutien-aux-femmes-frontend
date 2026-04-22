import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthContextProvider from "./contexts/AuthContext";

// Only initialise OneSignal when running on the configured port (5173)
const ONESIGNAL_PORT = "5173";

if (window.location.port === ONESIGNAL_PORT) {
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async function (OneSignal) {
    try {
      await OneSignal.init({
        appId: "6eebf422-2b44-4bd6-8521-35f6d57df588",
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: true,
      });

      const permission = OneSignal.Notifications.permissionNative;
      const isSubscribed = OneSignal.User?.PushSubscription?.optedIn;

      if (!isSubscribed) {
        if (permission === "default") {
          await OneSignal.Notifications.requestPermission();
        } else if (permission === "granted") {
          await OneSignal.User.PushSubscription.optIn();
        }
      }
    } catch (err) {
      // Silent — init errors are non-fatal
    }
  });

  // Load the OneSignal SDK script dynamically
  const script = document.createElement("script");
  script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
  script.defer = true;
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);