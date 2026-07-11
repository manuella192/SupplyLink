import React, { useState } from "react";
import "./ChatWindoww.css"; // N'oublie pas de créer ce fichier CSS

const ChatWindow = ({ product, onClose }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="chat-window-overlay">
      <div className="chat-window">
        {/* En-tête avec retour */}
        <div className="chat-header">
          <button className="back-btn" onClick={onClose}>‹</button>
          <div className="chat-header-info">
            <p className="chat-status">Discussion en cours avec un acheteur</p>
            <h4 className="chat-product-name">{product.name}</h4>
          </div>
        </div>

        {/* Zone des messages (vide pour l'instant) */}
        <div className="chat-messages">
          <div className="message-placeholder">
            Posez votre question sur cet article...
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="chat-input-area">
          <button className="icon-btn">📷</button>
          <button className="icon-btn">🖼️</button>
          <input 
            type="text" 
            placeholder="Écrire un message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="send-btn">🎤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;