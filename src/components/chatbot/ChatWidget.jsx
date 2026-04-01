import React, { useEffect, useRef, useState } from "react";
import { sendChatMessage, getChatMessages } from "../../api/chatbot";

const PINK = "#EC7FA7";
const PINK_DARK = "#d4537e";
const PINK_DEEP = "#b03060";

const QUICK_REPLIES = [
  { label: "💬 Déposer une demande", text: "Comment déposer une demande d'aide ?" },
  { label: "💝 Faire un don", text: "Comment faire un don ?" },
  { label: "🤝 Trouver un bénévole", text: "Comment trouver un bénévole ?" },
  { label: "🏥 Traitements", text: "Quelles informations sur les traitements du cancer du sein ?" },
];

export default function ChatWidget({ onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant virtuel de Courage Rose 🌸\n\nJe suis ici pour vous aider avec vos questions sur :\n• Les demandes d'aide\n• Les dons et financement\n• Les actions solidaires\n• Les traitements du cancer du sein\n\nComment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // ── Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Load history from API
  useEffect(() => {
    if (initialized) return;
    async function loadMessages() {
      try {
        const res = await getChatMessages();
        const apiMessages = res?.data?.messages || [];
        if (apiMessages.length > 0) {
          const formatted = apiMessages.map((msg, index) => ({
            id: msg._id || index + 1,
            text: msg.message || msg.content || "",
            isUser: msg.sender === "user",
            timestamp: msg.createdAt ? new Date(msg.createdAt) : new Date(),
          }));
          setMessages(formatted);
        }
      } catch {
        // keep default welcome message on error
      } finally {
        setInitialized(true);
      }
    }
    loadMessages();
  }, [initialized]);

  // ── Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  // ── Send message
  const handleSend = async (e) => {
    e?.preventDefault();
    const content = inputValue.trim();
    if (!content || loading) return;

    const userMsg = {
      id: Date.now(),
      text: content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await sendChatMessage(content);
      const replyText =
        res?.data?.reply ||
        res?.data?.message ||
        "Merci pour votre message. Notre équipe vous répondra bientôt.";

      // Simulate typing delay for realism
      await new Promise((r) => setTimeout(r, 600));

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: String(replyText),
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Désolée, une erreur est survenue. Veuillez réessayer dans quelques instants.",
          isUser: false,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // ── Quick reply click
  const handleQuickReply = (text) => {
    setInputValue(text);
    setTimeout(() => {
      inputRef.current?.focus();
      // Auto-send
      const userMsg = {
        id: Date.now(),
        text,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setLoading(true);
      setIsTyping(true);

      sendChatMessage(text)
        .then((res) => {
          const replyText =
            res?.data?.reply ||
            res?.data?.message ||
            "Merci pour votre question !";
          return new Promise((r) => setTimeout(() => r(replyText), 600));
        })
        .then((replyText) => {
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, text: String(replyText), isUser: false, timestamp: new Date() },
          ]);
        })
        .catch(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              text: "Désolée, une erreur est survenue.",
              isUser: false,
              timestamp: new Date(),
              isError: true,
            },
          ]);
        })
        .finally(() => {
          setLoading(false);
          setIsTyping(false);
        });
    }, 50);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const showQuickReplies = messages.length <= 2 && !loading;

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "transparent",
          display: "none",
        }}
        className="chat-backdrop"
      />

      <div
        ref={containerRef}
        style={{
          position: "fixed",
          bottom: 96,
          right: 24,
          width: 390,
          maxWidth: "calc(100vw - 32px)",
          height: 560,
          maxHeight: "calc(100vh - 120px)",
          background: "#fff",
          borderRadius: 24,
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.2), 0 4px 16px rgba(236,127,167,0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 999,
          border: "1px solid rgba(236,127,167,0.15)",
          animation: "chatSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* ── Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${PINK} 0%, ${PINK_DARK} 60%, ${PINK_DEEP} 100%)`,
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar with pulse */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              >
                🌸
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#4ade80",
                  border: "2px solid rgba(255,255,255,0.9)",
                }}
              />
            </div>

            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                Assistant Courage Rose
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4ade80",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>
                  {isTyping ? "en train d'écrire..." : "En ligne"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              cursor: "pointer",
              color: "#fff",
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
          >
            ✕
          </button>
        </div>

        {/* ── Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 14px",
            background: "linear-gradient(180deg, #fafafa 0%, #fff5f8 100%)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            scrollbarWidth: "thin",
            scrollbarColor: `${PINK}30 transparent`,
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.isUser ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 8,
                animation: "msgFadeIn 0.25s ease-out",
              }}
            >
              {/* Bot avatar */}
              {!msg.isUser && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: PINK + "22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    flexShrink: 0,
                    border: `1px solid ${PINK}30`,
                  }}
                >
                  🌸
                </div>
              )}

              <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 2 }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: msg.isUser
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    background: msg.isUser
                      ? `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`
                      : msg.isError
                      ? "#fff5f5"
                      : "#fff",
                    color: msg.isUser ? "#fff" : msg.isError ? "#ef4444" : "#2d2d2d",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    boxShadow: msg.isUser
                      ? `0 4px 14px ${PINK}45`
                      : "0 2px 10px rgba(0,0,0,0.07)",
                    border: msg.isUser
                      ? "none"
                      : msg.isError
                      ? "1px solid #fecaca"
                      : "1px solid #f0f0f0",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#bbb",
                    textAlign: msg.isUser ? "right" : "left",
                    paddingLeft: msg.isUser ? 0 : 4,
                    paddingRight: msg.isUser ? 4 : 0,
                  }}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                animation: "msgFadeIn 0.25s ease-out",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: PINK + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  border: `1px solid ${PINK}30`,
                }}
              >
                🌸
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 16px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                  border: "1px solid #f0f0f0",
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: PINK,
                      animation: `typingBounce 1.2s ease-in-out ${i * 0.18}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick replies */}
        {showQuickReplies && (
          <div
            style={{
              padding: "10px 12px 6px",
              background: "#fff",
              borderTop: `1px solid ${PINK}20`,
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            {QUICK_REPLIES.map((qr, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(qr.text)}
                style={{
                  background: PINK + "10",
                  border: `1px solid ${PINK}35`,
                  borderRadius: 20,
                  padding: "5px 11px",
                  fontSize: 11.5,
                  color: PINK_DARK,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = PINK + "25";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = PINK + "10";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {qr.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Input area */}
        <form
          onSubmit={handleSend}
          style={{
            padding: "12px 14px",
            background: "#fff",
            borderTop: `1px solid ${PINK}15`,
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "#f7f7f7",
              borderRadius: 24,
              border: `1.5px solid ${inputValue ? PINK + "60" : "#ececec"}`,
              padding: "0 14px",
              transition: "border-color 0.2s",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Écrivez votre message…"
              disabled={loading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 13.5,
                color: "#2d2d2d",
                padding: "10px 0",
                fontFamily: "inherit",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSend(e);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background:
                inputValue.trim() && !loading
                  ? `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`
                  : "#e8e8e8",
              border: "none",
              cursor: inputValue.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              color: inputValue.trim() && !loading ? "#fff" : "#bbb",
              transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              flexShrink: 0,
              boxShadow:
                inputValue.trim() && !loading
                  ? `0 4px 14px ${PINK}55`
                  : "none",
              transform: inputValue.trim() && !loading ? "scale(1)" : "scale(0.95)",
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim() && !loading)
                e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                inputValue.trim() && !loading ? "scale(1)" : "scale(0.95)";
            }}
          >
            ➤
          </button>
        </form>
      </div>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-7px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
