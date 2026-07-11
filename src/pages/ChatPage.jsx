import React, { useState } from "react";
import "./ChatPage.css"; 

const ChatPage = ({ product, onBack }) => {
  // 1. État pour gérer le texte saisi
  const [inputValue, setInputValue] = useState("");
  // 2. État pour gérer la liste des messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour ! Cet article est bien disponible. Souhaitez-vous des précisions ?", sender: "received", time: "16:20" },
    { id: 2, text: "Bonjour, je suis intéressé par cet article. Est-il disponible ?", sender: "sent", time: "16:22" }
  ]);

  // Fonction pour envoyer le message
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return; // Empêche l'envoi de messages vides

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "sent",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue(""); // Vide la barre de saisie
  };

  if (!product) {
    return <div className="chat-container-error"><p>Erreur : Aucune information produit trouvée.</p><button onClick={onBack}>Retour</button></div>;
  }

  return (
    <div className="chat-page-wrapper">
      <header className="chat-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <div className="product-mini">
          {product.image && <img src={product.image} alt={product.name} />}
          <div className="info">
            <h4>{product.name}</h4>
            <span className="status">● Vendeur actif</span>
          </div>
        </div>
      </header>

      <div className="chat-viewport">
        <div className="date-divider">Aujourd'hui</div>
        {messages.map((msg) => (
          <div key={msg.id} className={`msg ${msg.sender}`}>
            <p>{msg.text}</p>
            <span className="time">{msg.time}</span>
          </div>
        ))}
      </div>

      <footer className="chat-controls">
        <button className="plus-btn">+</button>
        <input 
          type="text" 
          placeholder="Écrire un message..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Mise à jour du texte
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Envoi avec la touche Entrée
        />
        <button className="send-btn" onClick={handleSendMessage}>➤</button>
      </footer>
    </div>
  );
};

export default ChatPage;