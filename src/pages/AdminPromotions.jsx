import React, { useState } from "react";

const AdminPromotions = () => {
  const [promos, setPromos] = useState([
   { id: 1, shop: "Mobilia Design", product: "Armoire Noir", type: "Top Search", val: "Boost x3", status: "En attente" },
    { id: 2, shop: "TechSolutions", product: "Bureau Pro", type: "Flash Banner", val: "24h Home", status: "En attente" },
    { id: 3, shop: "Lumi-Light", product: "Lampe LED", type: "Gold Badge", val: "7 jours", status: "Validé" },
    { id: 4, shop: "Bureau Moderne", product: "Chaise Ergonomique", type: "Top Search", val: "Boost x5", status: "En attente" },
    { id: 5, shop: "Eco Matériaux", product: "Dalle Béton", type: "Flash Banner", val: "48h Home", status: "En attente" },
    { id: 6, shop: "Design Plus", product: "Table Basse", type: "Gold Badge", val: "15 jours", status: "Validé" },
    { id: 7, shop: "Sud Logistique", product: "Étagère Métal", type: "Top Search", val: "Boost x2", status: "En attente" }
  ]);

  const handleAction = (id, newStatus) => {
    setPromos(promos.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  // Fonction pour styliser le type de booster
  const getBoosterStyle = (type) => {
    switch(type) {
      case "Top Search": return { bg: "#e0f2fe", color: "#0369a1" };
      case "Flash Banner": return { bg: "#fef3c7", color: "#92400e" };
      case "Gold Badge": return { bg: "#fef3c7", color: "#b45309" }; // Doré
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ fontSize: "20px", color: "#0f172a", margin: "0" }}>Boosters de Visibilité</h3>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Validation des options de mise en avant pour les fournisseurs</p>
      </div>
      
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
        <thead>
          <tr style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Boutique</th>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Produit</th>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Type de Booster</th>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Durée / Impact</th>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Statut</th>
            <th style={{ padding: "12px 20px", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((p) => {
            const style = getBoosterStyle(p.type);
            return (
              <tr key={p.id} style={{ backgroundColor: "#f8fafc", borderRadius: "12px" }}>
                <td style={{ padding: "16px 20px", borderRadius: "12px 0 0 12px", fontWeight: "600" }}>{p.shop}</td>
                <td style={{ padding: "16px 20px", color: "#475569" }}>{p.product}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", backgroundColor: style.bg, color: style.color }}>
                    {p.type}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0f172a" }}>{p.val}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                    backgroundColor: p.status === "En attente" ? "#fef3c7" : p.status === "Validé" ? "#dcfce7" : "#fee2e2",
                    color: p.status === "En attente" ? "#92400e" : p.status === "Validé" ? "#166534" : "#991b1b"
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", textAlign: "right", borderRadius: "0 12px 12px 0" }}>
                  {p.status === "En attente" ? (
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => handleAction(p.id, "Validé")} style={{ padding: "6px 12px", border: "none", borderRadius: "8px", background: "#10b981", color: "#fff", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>Activer</button>
                      <button onClick={() => handleAction(p.id, "Rejeté")} style={{ padding: "6px 12px", border: "none", borderRadius: "8px", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>Rejeter</button>
                    </div>
                  ) : (
                    <span style={{ color: "#64748b", fontSize: "12px", fontStyle: "italic" }}>Traitée</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPromotions;