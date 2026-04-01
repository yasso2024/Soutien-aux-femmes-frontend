import React from "react";

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: 16,
          background: isUser ? "#1677ff" : "#f0f0f0",
          color: isUser ? "#fff" : "#000",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;