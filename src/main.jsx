import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthContextProvider from "./contexts/AuthContext";

// Initialise OneSignal Web SDK
window.OneSignalDeferred = window.OneSignalDeferred || [];
window.OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: "6eebf422-2b44-4bd6-8521-35f6d57df588",
    notifyButton: { enable: false },
    allowLocalhostAsSecureOrigin: true,
  });

  const permission = OneSignal.Notifications.permissionNative;
  const isSubscribed = OneSignal.User?.PushSubscription?.optedIn;

  console.log("[OneSignal] permission:", permission);
  console.log("[OneSignal] already subscribed:", isSubscribed);
  console.log("[OneSignal] subscription id:", OneSignal.User?.PushSubscription?.id);

  if (!isSubscribed) {
    if (permission === "default") {
      // First visit: show the browser permission popup
      await OneSignal.Notifications.requestPermission();
    } else if (permission === "granted") {
      // Already allowed: activate subscription silently
      await OneSignal.User.PushSubscription.optIn();
    }
  }

  // Log the final subscription id after opt-in
  console.log("[OneSignal] final subscription id:", OneSignal.User?.PushSubscription?.id);
});

// Load the OneSignal SDK script dynamically
const script = document.createElement("script");
script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
script.defer = true;
document.head.appendChild(script);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);