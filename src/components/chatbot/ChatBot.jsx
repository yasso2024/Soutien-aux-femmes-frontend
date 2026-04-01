import React, { useState } from "react";
import ChatWidget from "./ChatWidget";

const PINK = "#EC7FA7";

const ChatBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatWidget onClose={() => setOpen(false)} />}

      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        title="Discuter avec l'assistant Courage Rose"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg, #d4537e, #b03060)"
            : `linear-gradient(135deg, ${PINK}, #d4537e)`,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 28px rgba(236,127,167,0.55), 0 2px 8px rgba(0,0,0,0.15)`,
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: open ? "scale(0.92) rotate(10deg)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.transform = "scale(1.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = open ? "scale(0.92) rotate(10deg)" : "scale(1)";
        }}
      >
        <span
          style={{
            fontSize: 26,
            lineHeight: 1,
            transition: "transform 0.3s ease",
            display: "block",
          }}
        >
          {open ? "✕" : "🌸"}
        </span>

        {/* Ping animation when closed */}
        {!open && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#4ade80",
              border: "2px solid #fff",
              animation: "chatPing 2s ease-in-out infinite",
            }}
          />
        )}
      </button>

      <style>{`
        @keyframes chatPing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
