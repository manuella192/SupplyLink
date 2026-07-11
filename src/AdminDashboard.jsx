import React, { useState } from "react";
import AdminStats from "./pages/AdminStats";
import AdminUsers from "./pages/AdminUsers";
import AdminPromotions from "./pages/AdminPromotions";
import AdminOrders from "./pages/AdminOrders";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");

  const menuItems = [
    { id: "stats", label: "Tableau de bord", icon: "📊" },
    { id: "users", label: "Gestion Utilisateurs", icon: "👥" },
    { id: "promos", label: "Validations Promos", icon: "🏷️" },
    { id: "orders", label: "Toutes les Commandes", icon: "📦" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar : Bleu nuit élégant */}
      <nav style={{ width: "280px", backgroundColor: "#0f172a", color: "#fff", padding: "24px" }}>
        <div style={{ padding: "0 16px 30px 16px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", margin: 0 }}>SupplyLink <span style={{ color: "#009fe3" }}>Admin</span></h2>
        </div>
        
        {menuItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{ 
              display: "flex", 
              alignItems: "center",
              gap: "12px",
              width: "100%", 
              padding: "14px 16px", 
              marginBottom: "8px",
              // Couleur active : Bleu SupplyLink
              backgroundColor: activeTab === item.id ? "#009fe3" : "transparent",
              color: activeTab === item.id ? "#fff" : "#94a3b8", 
              border: "none", 
              borderRadius: "10px", 
              cursor: "pointer", 
              textAlign: "left",
              fontWeight: activeTab === item.id ? "600" : "500",
              transition: "all 0.2s ease"
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Contenu : Clair et aéré */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {activeTab === "stats" && <AdminStats />}
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "promos" && <AdminPromotions />}
          {activeTab === "orders" && <AdminOrders />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;