import React, { useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Mobilia Design", type: "Fournisseur", status: "Actif", lastActive: "Il y a 2h" },
    { id: 2, name: "Ahmed Benali", type: "Acheteur", status: "Actif", lastActive: "Hier" },
    { id: 3, name: "TechSolutions", type: "Fournisseur", status: "Bloqué", lastActive: "Il y a 5 jours" },
    { id: 4, name: "Bureau Moderne", type: "Fournisseur", status: "Actif", lastActive: "Il y a 1h" },
    { id: 5, name: "Sara Laraki", type: "Acheteur", status: "Actif", lastActive: "Aujourd'hui" },
    { id: 6, name: "Logistique Plus", type: "Fournisseur", status: "Actif", lastActive: "Il y a 3h" },
    { id: 7, name: "Karim Mansouri", type: "Acheteur", status: "Bloqué", lastActive: "Il y a 10 jours" },
    { id: 8, name: "Global Supply", type: "Fournisseur", status: "Actif", lastActive: "Il y a 30 min" },
    { id: 9, name: "Fatima Zahra", type: "Acheteur", status: "Actif", lastActive: "Hier" },
    { id: 10, name: "Smart Office", type: "Fournisseur", status: "Actif", lastActive: "Il y a 5h" },
    { id: 11, name: "Eco Matériaux", type: "Fournisseur", status: "Bloqué", lastActive: "Il y a 2 jours" },
    { id: 12, name: "Omar Fassi", type: "Acheteur", status: "Actif", lastActive: "Il y a 1h" },
    { id: 13, name: "Fast Livraisons", type: "Fournisseur", status: "Actif", lastActive: "Il y a 4h" },
    { id: 14, name: "Nadia Belhaj", type: "Acheteur", status: "Actif", lastActive: "Hier" },
    { id: 15, name: "Qualité Pro", type: "Fournisseur", status: "Actif", lastActive: "Il y a 6h" },
    { id: 16, name: "Youssef Alaoui", type: "Acheteur", status: "Bloqué", lastActive: "Il y a 8 jours" },
    { id: 17, name: "Direct Import", type: "Fournisseur", status: "Actif", lastActive: "Il y a 20 min" },
    { id: 18, name: "Laila Bennani", type: "Acheteur", status: "Actif", lastActive: "Aujourd'hui" },
    { id: 19, name: "Industrie Maroc", type: "Fournisseur", status: "Actif", lastActive: "Il y a 7h" },
    { id: 20, name: "Hassan Idrissi", type: "Acheteur", status: "Actif", lastActive: "Hier" },
    { id: 21, name: "Mobilier Confort", type: "Fournisseur", status: "Bloqué", lastActive: "Il y a 15 jours" },
    { id: 22, name: "Zineb Amrani", type: "Acheteur", status: "Actif", lastActive: "Il y a 3h" },
    { id: 23, name: "Tech Solutions 2", type: "Fournisseur", status: "Actif", lastActive: "Il y a 45 min" },
    { id: 24, name: "Amine Radi", type: "Acheteur", status: "Actif", lastActive: "Hier" },
    { id: 25, name: "Fournitures Atlas", type: "Fournisseur", status: "Actif", lastActive: "Il y a 2h" },
    { id: 26, name: "Meryem Tazi", type: "Acheteur", status: "Actif", lastActive: "Aujourd'hui" },
    { id: 27, name: "Alpha Services", type: "Fournisseur", status: "Bloqué", lastActive: "Il y a 4 jours" },
    { id: 28, name: "Driss El Amri", type: "Acheteur", status: "Actif", lastActive: "Il y a 1h" },
    { id: 29, name: "BTP Solutions", type: "Fournisseur", status: "Actif", lastActive: "Il y a 5h" },
    { id: 30, name: "Sofia Rahali", type: "Acheteur", status: "Actif", lastActive: "Hier" },
    { id: 31, name: "Express Maroc", type: "Fournisseur", status: "Actif", lastActive: "Il y a 2h" },
    { id: 32, name: "Mehdi Salmi", type: "Acheteur", status: "Bloqué", lastActive: "Il y a 20 jours" },
    { id: 33, name: "Design Plus", type: "Fournisseur", status: "Actif", lastActive: "Il y a 3h" },
    { id: 34, name: "Imane Kadiri", type: "Acheteur", status: "Actif", lastActive: "Hier" },
    { id: 35, name: "Solution Durable", type: "Fournisseur", status: "Actif", lastActive: "Il y a 6h" },
    { id: 36, name: "Zakaria Zaki", type: "Acheteur", status: "Actif", lastActive: "Aujourd'hui" },
    { id: 37, name: "Pro Déco", type: "Fournisseur", status: "Bloqué", lastActive: "Il y a 6 jours" },
    { id: 38, name: "Salma Fikri", type: "Acheteur", status: "Actif", lastActive: "Il y a 2h" },
    { id: 39, name: "Nord Import", type: "Fournisseur", status: "Actif", lastActive: "Il y a 4h" },
    { id: 40, name: "Yassine Slaoui", type: "Acheteur", status: "Actif", lastActive: "Hier" },
    { id: 41, name: "Office Express", type: "Fournisseur", status: "Actif", lastActive: "Il y a 30 min" },
    { id: 42, name: "Khadija Moudni", type: "Acheteur", status: "Actif", lastActive: "Aujourd'hui" },
    { id: 43, name: "Sud Logistique", type: "Fournisseur", status: "Actif", lastActive: "Il y a 5h" }
  ]);

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Actif" ? "Bloqué" : "Actif" } : u));
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Inter', sans-serif", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
      {/* Header de section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "#0f172a", margin: "0" }}>Gestion des comptes</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0" }}>Gérez les accès et les statuts des partenaires</p>
        </div>
        <div style={{ background: "#f1f5f9", padding: "8px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "600" }}>
          {users.length} Utilisateurs
        </div>
      </div>
      
      {/* Tableau élégant */}
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
        <thead>
          <tr style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Utilisateur</th>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Type</th>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Dernière activité</th>
            <th style={{ padding: "12px 20px", textAlign: "left" }}>Statut</th>
            <th style={{ padding: "12px 20px", textAlign: "right" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ 
              backgroundColor: "#f8fafc", 
              transition: "transform 0.2s, background 0.2s",
              cursor: "default"
            }} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
            >
              <td style={{ padding: "16px 20px", borderRadius: "12px 0 0 12px", fontWeight: "600", color: "#0f172a" }}>{u.name}</td>
              <td style={{ padding: "16px 20px", color: "#64748b" }}>{u.type}</td>
              <td style={{ padding: "16px 20px", color: "#64748b", fontSize: "14px" }}>{u.lastActive}</td>
              <td style={{ padding: "16px 20px" }}>
                <div style={{ 
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                  backgroundColor: u.status === "Actif" ? "#dcfce7" : "#fee2e2",
                  color: u.status === "Actif" ? "#166534" : "#991b1b"
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: u.status === "Actif" ? "#22c55e" : "#ef4444" }}></div>
                  {u.status}
                </div>
              </td>
              <td style={{ padding: "16px 20px", textAlign: "right", borderRadius: "0 12px 12px 0" }}>
                <button 
                  onClick={() => toggleStatus(u.id)}
                  style={{ 
                    padding: "8px 20px", cursor: "pointer", border: "1px solid #e2e8f0",
                    borderRadius: "10px", fontWeight: "600", fontSize: "12px",
                    backgroundColor: "#fff", color: "#475569", transition: "0.2s"
                  }}
                  onMouseOver={(e) => { e.target.style.borderColor = "#94a3b8"; e.target.style.color = "#000"; }}
                  onMouseOut={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.color = "#475569"; }}
                >
                  {u.status === "Actif" ? "Bloquer" : "Débloquer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;