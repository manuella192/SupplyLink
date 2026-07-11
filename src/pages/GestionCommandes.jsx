import React, { useState } from "react";

const GestionCommandes = () => {
  
  const [selectedCmd, setSelectedCmd] = useState(null);

  const updateStatus = (id, newStatus) => {
    setCommandes(commandes.map(cmd => cmd.id === id ? { ...cmd, statut: newStatus } : cmd));
    setSelectedCmd(null);
  };
  const [commandes, setCommandes] = useState([
  { 
    id: "CMD-001", 
    client: "Alice D.", 
    article: "Lampe de chevet", 
    statut: "En attente", 
    date: "06/07/2026", 
    // Ajoutez ces champs ici
    image: "/assets/lampe.jpg", 
    quantite: "1", 
    adresse: "Rabat" 
  },
  { 
    id: "CMD-002", 
    client: "Marc M.", 
    article: "Table Ronde", 
    statut: "En préparation", 
    date: "05/07/2026", 
    // Ajoutez ces champs ici
    image: "/assets/table.jpg", 
    quantite: "2", 
    adresse: "Casablanca" 
  },
]);

  const getStatusStyle = (statut) => {
    const styles = {
      "En attente": { bg: "#FFFBEB", text: "#B45309", icon: "⏳" },
      "En préparation": { bg: "#EFF6FF", text: "#1D4ED8", icon: "📦" },
      "Expédié": { bg: "#ECFDF5", text: "#065F46", icon: "🚀" }
    };
    return styles[statut] || { bg: "#F3F4F6", text: "#374151", icon: "📌" };
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Inter', sans-serif", backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", color: "#111827", marginBottom: "25px" }}>Gestion des Commandes</h2>
        
        <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                {["ID", "Client", "Article", "Statut", "Action"].map(h => (
                  <th key={h} style={{ padding: "16px", textAlign: "left", color: "#6B7280", fontSize: "12px", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commandes.map((cmd) => {
                const style = getStatusStyle(cmd.statut);
                return (
                  <tr key={cmd.id} style={{ borderBottom: "1px solid #F3F4F6", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <td style={{ padding: "16px", fontWeight: "600" }}>{cmd.id}</td>
                    <td style={{ padding: "16px" }}>{cmd.client}</td>
                    <td style={{ padding: "16px", color: "#4B5563" }}>{cmd.article}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", backgroundColor: style.bg, color: style.text }}>
                        {style.icon} {cmd.statut}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <button onClick={() => setSelectedCmd(cmd)} style={{ backgroundColor: "#F3F4F6", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>Détails</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

       {selectedCmd && (
  <div style={{ 
    marginTop: "24px", 
    padding: "24px", 
    backgroundColor: "#fff", 
    borderRadius: "16px", 
    border: "1px solid #E5E7EB", 
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" 
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
      <h3 style={{ margin: 0, color: "#111827" }}>Commande {selectedCmd.id}</h3>
      <button onClick={() => setSelectedCmd(null)} style={{ border: "none", background: "#F3F4F6", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer" }}>✕</button>
    </div>

    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      {/* Image de l'article */}
      <div style={{ width: "120px", height: "120px", borderRadius: "12px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
        <img src={selectedCmd.image || "/assets/default-product.jpg"} alt={selectedCmd.article} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Informations article */}
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{selectedCmd.article}</h4>
        <div style={{ display: "flex", gap: "20px", color: "#6B7280" }}>
          <p style={{ margin: 0 }}><strong>Quantité :</strong> {selectedCmd.quantite || "1"}</p>
          <p style={{ margin: 0 }}><strong>Date :</strong> {selectedCmd.date}</p>
        </div>
        <p style={{ marginTop: "8px", color: "#4B5563" }}><strong>Adresse :</strong> {selectedCmd.adresse}</p>
      </div>
    </div>

    <hr style={{ border: "0", borderTop: "1px solid #F3F4F6", margin: "20px 0" }} />

    {/* Actions */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: "600" }}>Statut actuel : {selectedCmd.statut}</span>
      <div style={{ display: "flex", gap: "10px" }}>
        {selectedCmd.statut === "En attente" && (
          <button onClick={() => updateStatus(selectedCmd.id, "En préparation")} style={{ backgroundColor: "#2563EB", color: "white", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
            Valider la commande
          </button>
        )}
        {selectedCmd.statut === "En préparation" && (
          <button onClick={() => updateStatus(selectedCmd.id, "Expédié")} style={{ backgroundColor: "#059669", color: "white", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
            Marquer comme Expédié
          </button>
        )}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default GestionCommandes;