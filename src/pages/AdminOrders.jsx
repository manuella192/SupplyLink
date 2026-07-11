import React, { useState } from "react";

const AdminOrders = () => {
  const [expandedId, setExpandedId] = useState(null);

  const orders = [
    { 
      id: "CMD-99", user: "Mobilia Design", total: "12 500 DH", date: "07/07/2026", deliveryDate: "09/07/2026", status: "Livré", supplier: "Fourniture Pro",
      items: [
        { name: "Armoire Noir", img: "/assets/armoire.jpg" },
        { name: "Chaise Bureau", img: "/assets/canape.jpg" }
      ]
    },
    { 
      id: "CMD-98", user: "Ahmed Benali", total: "2 400 DH", date: "08/07/2026", deliveryDate: null, status: "En cours", supplier: "TechSolutions",
      items: [{ name: "Bureau Pro", img: "/assets/bureau.jpg" }]
    }
  ];

  return (
    <div style={{ padding: "30px", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "25px" }}>Historique des Commandes</h3>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
        <thead>
          <tr style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase" }}>
            <th style={{ padding: "12px 20px" }}>ID</th>
            <th style={{ padding: "12px 20px" }}>Client</th>
            <th style={{ padding: "12px 20px" }}>Fournisseur</th>
            <th style={{ padding: "12px 20px" }}>Dates</th>
            <th style={{ padding: "12px 20px" }}>Statut</th>
            <th style={{ padding: "12px 20px" }}>Total</th>
            <th style={{ padding: "12px 20px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <React.Fragment key={o.id}>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <td style={{ padding: "16px 20px", borderRadius: "12px 0 0 12px", fontWeight: "600" }}>{o.id}</td>
                <td style={{ padding: "16px 20px" }}>{o.user}</td>
                <td style={{ padding: "16px 20px", color: "#64748b" }}>{o.supplier}</td>
                <td style={{ padding: "16px 20px", fontSize: "12px" }}>
                  <div>Comm: <b>{o.date}</b></div>
                  <div style={{ color: o.deliveryDate ? "#166534" : "#94a3b8" }}>
                    Liv: <b>{o.deliveryDate || "En attente"}</b>
                  </div>
                </td>
                {/* Correction du Statut avec badge */}
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                    backgroundColor: o.status === "Livré" ? "#dcfce7" : "#dbeafe",
                    color: o.status === "Livré" ? "#166534" : "#1e40af"
                  }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", fontWeight: "700" }}>{o.total}</td>
                <td style={{ padding: "16px 20px", textAlign: "right", borderRadius: "0 12px 12px 0" }}>
                  <button onClick={() => setExpandedId(expandedId === o.id ? null : o.id)} style={{ cursor: "pointer", padding: "8px 12px", borderRadius: "8px", border: "none", background: "#009fe3", color: "#fff" }}>
                    {expandedId === o.id ? "Masquer" : "Voir articles"}
                  </button>
                </td>
              </tr>
              {expandedId === o.id && (
                <tr>
                  <td colSpan="7" style={{ padding: "20px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                      {o.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f1f5f9", padding: "10px", borderRadius: "12px" }}>
                          <img src={item.img} alt={item.name} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;