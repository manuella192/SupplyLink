import React, { useState } from "react";

const DiscussionFournisseur = () => {
  // État pour savoir quelle discussion est ouverte
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState("");

  // Liste des discussions avec les images des produits associées
  const discussionsList = [
    { 
      id: 1, 
      buyerName: "Alice Dupont", 
      lastMessage: "Cet article peut être personnalisé ?", 
      time: "10:30", 
      product: "Lampe de chevet", 
      productImage: "/assets/lampe.jpg" 
    },
    { 
      id: 2, 
      buyerName: "Marc Martin", 
      lastMessage: "La couleur de l'article peut-etre personaliser ?", 
      time: "Hier", 
      product: "Table Ronde", 
      productImage: "/assets/table.jpg" 
    },
  ];

  return (
    <div style={{ display: "flex", height: "calc(100vh - 100px)", padding: "20px", gap: "20px", backgroundColor: "#f9f9f9", fontFamily: "sans-serif" }}>
      
      {/* COLONNE GAUCHE : Liste des messages */}
      <div style={{ width: "350px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflowY: "auto" }}>
        <h2 style={{ padding: "20px", margin: 0, fontSize: "1.2rem", color: "#333" }}>Messages</h2>
        {discussionsList.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => setSelectedChat(chat)}
            style={{ 
              padding: "15px", 
              borderBottom: "1px solid #f0f0f0", 
              cursor: "pointer",
              backgroundColor: selectedChat?.id === chat.id ? "#f0f9ff" : "transparent",
              transition: "0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#009fe3", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                {chat.buyerName[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "0.9rem" }}>{chat.buyerName}</strong>
                  <span style={{ fontSize: "0.7rem", color: "#999" }}>{chat.time}</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{chat.product}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COLONNE DROITE : Zone de discussion */}
      <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            {/* Header avec Image du produit */}
            <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "15px" }}>
              <img 
                src={selectedChat.productImage} 
                alt={selectedChat.product} 
                style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover", border: "1px solid #eee" }} 
              />
              <div>
                <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>{selectedChat.product}</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>Discussion avec {selectedChat.buyerName}</div>
              </div>
            </div>

            {/* Zone des messages */}
            <div style={{ flex: 1, padding: "20px", backgroundColor: "#fafafa", overflowY: "auto" }}>
              <div style={{ backgroundColor: "#fff", padding: "12px 16px", borderRadius: "15px", width: "fit-content", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", fontSize: "0.9rem" }}>
                {selectedChat.lastMessage}
              </div>
            </div>

            {/* Barre de saisie */}
            <div style={{ padding: "20px", borderTop: "1px solid #eee" }}>
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ width: "100%", padding: "12px 20px", borderRadius: "25px", border: "1px solid #ddd", outline: "none" }} 
                placeholder="Écrire un message..." 
              />
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
            Sélectionnez une discussion pour commencer
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionFournisseur;