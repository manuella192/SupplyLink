import React, { useState, useRef, useEffect, useCallback } from "react";
import api from "../../services/api";
import "./Chatbot.css";

const LOGO_SVG = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const ICON_CHAT = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const ICON_CLOSE = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ICON_SEND = (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const WELCOME = "Bonjour ! Je suis l'assistant SupplyLink. Comment puis-je vous aider ?";

const SUGGESTIONS = [
  "Comment passer une commande ?",
  "Modes de paiement acceptés",
  "Délai et zones de livraison",
  "Contacter le service client",
];

const Chatbot = () => {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg  = { role: "user", content };
    const history  = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chatbot", {
        message: content,
        history: messages.slice(-6),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Service momentanément indisponible. Contactez-nous à contact@supplylink.ma" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <>
      {/* ── Fenêtre chat ── */}
      {open && (
        <div className="cb-window" role="dialog" aria-label="Assistant SupplyLink">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-header-avatar">{LOGO_SVG}</div>
              <div>
                <p className="cb-header-name">Assistant SupplyLink</p>
                <p className="cb-header-status">
                  <span className="cb-dot" />En ligne
                </p>
              </div>
            </div>
            <button className="cb-close-btn" onClick={() => setOpen(false)} aria-label="Fermer">
              {ICON_CLOSE}
            </button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((m, i) => (
              <div key={i} className={`cb-row cb-row--${m.role}`}>
                {m.role === "assistant" && (
                  <div className="cb-avatar cb-avatar--bot">{LOGO_SVG}</div>
                )}
                <div className={`cb-bubble cb-bubble--${m.role}`}>{m.content}</div>
              </div>
            ))}

            {loading && (
              <div className="cb-row cb-row--assistant">
                <div className="cb-avatar cb-avatar--bot">{LOGO_SVG}</div>
                <div className="cb-bubble cb-bubble--assistant cb-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="cb-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="cb-chip" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form className="cb-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="cb-input"
              placeholder="Posez votre question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              maxLength={400}
              autoComplete="off"
            />
            <button
              type="submit"
              className="cb-send"
              disabled={!input.trim() || loading}
              aria-label="Envoyer"
            >
              {ICON_SEND}
            </button>
          </form>
        </div>
      )}

      {/* ── Bouton flottant ── */}
      <button
        className={`cb-fab ${open ? "cb-fab--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant SupplyLink"}
      >
        <span className="cb-fab-icon cb-fab-icon--chat">{ICON_CHAT}</span>
        <span className="cb-fab-icon cb-fab-icon--close">{ICON_CLOSE}</span>
      </button>
    </>
  );
};

export default Chatbot;
