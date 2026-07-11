import React, { useState } from "react";

const AdminStats = () => {
  const [page, setPage] = useState("dashboard");
  

  const kpis = [
    { title: "Ventes Totales", val: "124 500 DH", icon: "💰", color: "#009fe3" },
    { title: "Comptes Actifs", val: "42", icon: "🏢", color: "#2ec4b6" },
    { title: "Commandes", val: "18", icon: "📦", color: "#f1c40f" },
    { title: "Promos en cours", val: "07", icon: "🏷️", color: "#ff4d4d" }
  ];
  const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "20px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.2s ease"
};
 const contentMap = {
  "Comptes Actifs": (
    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
      <thead>
        <tr style={{ textAlign: "left" }}>
          {["Nom", "Type", "Rôle", "Statut"].map((h) => <th key={h} style={{ padding: "12px", color: "#64748b", fontSize: "11px", textTransform: "uppercase" }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {[
          { n: "Mobilia Design", t: "Fournisseur", r: "Administrateur", s: "Actif" },
          { n: "Ahmed Benali", t: "Acheteur", r: "Client Pro", s: "Actif" },
          { n: "TechSolutions", t: "Fournisseur", r: "Éditeur", s: "Suspendu" },
          { n: "Bureau Moderne", t: "Fournisseur", r: "Client", s: "Actif" },
          { n: "Sara Laraki", t: "Acheteur", r: "Client VIP", s: "Actif" }
        ].map((row, i) => (
          <tr key={i} style={{ background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.03)" }}>
            <td style={{ padding: "16px", borderRadius: "8px 0 0 8px", fontWeight: "600" }}>{row.n}</td>
            <td style={{ padding: "16px" }}>{row.t}</td>
            <td style={{ padding: "16px" }}>{row.r}</td>
            <td style={{ padding: "16px", borderRadius: "0 8px 8px 0" }}>
              <span style={{ background: row.s === "Actif" ? "#dcfce7" : "#fee2e2", color: row.s === "Actif" ? "#166534" : "#991b1b", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>{row.s}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  "Commandes": (
    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
      <thead>
        <tr style={{ textAlign: "left" }}>
          {["ID", "Date", "Montant", "Livraison", "État"].map((h) => <th key={h} style={{ padding: "12px", color: "#64748b", fontSize: "11px", textTransform: "uppercase" }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {[
          { id: "#CMD-077", d: "07/07/2026", m: "12 500 DH", l: "12/07/2026", e: "En préparation" },
          { id: "#CMD-078", d: "08/07/2026", m: "8 200 DH", l: "15/07/2026", e: "Expédié" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" },
          { id: "#CMD-079", d: "09/07/2026", m: "45 000 DH", l: "20/07/2026", e: "En attente" }
        ].map((row, i) => (
          <tr key={i} style={{ background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.03)" }}>
            <td style={{ padding: "16px", borderRadius: "8px 0 0 8px", fontWeight: "600" }}>{row.id}</td>
            <td style={{ padding: "16px" }}>{row.d}</td>
            <td style={{ padding: "16px" }}>{row.m}</td>
            <td style={{ padding: "16px" }}>{row.l}</td>
            <td style={{ padding: "16px", borderRadius: "0 8px 8px 0", color: "#009fe3", fontWeight: "600" }}>{row.e}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  "Promos en cours": (
    <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
      {[ 
        { art: "Chaise Ergonomique", p: "Mobilia Design", d: "Fin: 30 Juillet" }, 
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Lampe Bureau LED", p: "Lumi-Light", d: "Fin: 01 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" },
        { art: "Bureau Tech-Pro", p: "TechSolutions", d: "Fin: 15 Août" }
      ].map((item, i) => (
        <div key={i} style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>🏷️</div>
          <strong style={{ display: "block", color: "#0f172a", fontSize: "16px" }}>{item.art}</strong>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "5px 0" }}>Fournisseur : {item.p}</p>
          <span style={{ color: "#ff4d4d", fontSize: "12px", fontWeight: "bold" }}>{item.d}</span>
        </div>
      ))}
    </div>
  ),
  "Ventes Totales": (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginBottom: "20px" }}>
        {[ { t: "Total CA", v: "124 500 DH" }, { t: "Commandes", v: "42" }, { t: "Moyenne", v: "2 964 DH" } ].map((stat, i) => (
          <div key={i} style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: "12px", margin: "0" }}>{stat.t}</p>
            <h4 style={{ margin: "5px 0 0", fontSize: "18px" }}>{stat.v}</h4>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <p>Historique détaillé disponible dans le fichier export CSV.</p>
      </div>
    </div>
  )
};

  // DONNÉES À AFFICHER DANS LES NOUVELLES VUES
  const renderDetail = () => {
    return contentMap[page] || null;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "25px", color: "#1e293b" }}>Tableau de bord : Pilotage SupplyLink</h2>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
  {kpis.map((kpi, i) => (
    <div key={i} onClick={() => setPage(kpi.title)} style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", cursor: "pointer" }}>
      <div style={{ fontSize: "20px", marginBottom: "10px" }}>{kpi.icon}</div>
      <h4 style={{ margin: "0", fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>{kpi.title}</h4>
      <p style={{ fontSize: "20px", fontWeight: "700", margin: "5px 0 0" }}>{kpi.val}</p>
    </div>
  ))}
</div>
    
      
      {/* Graphs Section */}
     {page === "dashboard" && ( 
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        
        {/* Ventes par mois - CORRIGÉ */}
<div style={{ background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
  <h3 style={{ fontSize: "16px", marginBottom: "25px" }}>Volume de ventes mensuel (en kDH)</h3>
  
  <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "15px", paddingBottom: "20px", borderBottom: "1px solid #e2e8f0" }}>
    {[
      {m: "Fév", v: 40}, {m: "Mar", v: 60}, {m: "Avr", v: 55}, 
      {m: "Mai", v: 85}, {m: "Juin", v: 70}, {m: "Juil", v: 95}
    ].map((data, i) => (
      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
        
        {/* Valeur numérique au-dessus de la barre */}
        <span style={{ fontSize: "11px", fontWeight: "bold", color: "#334155", marginBottom: "8px" }}>{data.v}</span>
        
        {/* Barre avec effet de survol */}
        <div 
          style={{ 
            width: "100%", 
            background: "#009fe3", 
            borderRadius: "6px 6px 0 0", 
            height: `${data.v}%`,
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#0284c7";
            e.target.style.filter = "brightness(1.2)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#009fe3";
            e.target.style.filter = "brightness(1)";
          }}
        ></div>
        
        {/* Label du mois */}
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginTop: "10px" }}>{data.m}</span>
      </div>
    ))}
  </div>
</div>

        {/* Top 3 Catégories */}
        <div style={{ background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Top 3 Catégories les plus vendues</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[ { label: "Équipement Industriel", val: "55%" }, { label: "Fournitures de bureau", val: "30%" }, { label: "Mobilier Ergonomique", val: "15%" } ].map((item, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>{item.label}</span>
                  <span style={{ fontSize: "14px", color: "#009fe3" }}>{item.val}</span>
                </div>
                <div style={{ height: "12px", background: "#f1f5f9", borderRadius: "6px" }}>
                  <div style={{ width: item.val, height: "100%", background: i === 0 ? "#009fe3" : i === 1 ? "#2ec4b6" : "#cbd5e1", borderRadius: "6px" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        

{/* Section Statistiques Avancées */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginTop: "25px" }}>

  {/* Bloc 1: Taux de réactivité des fournisseurs */}
  <div style={{ background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
    <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Taux de réactivité Fournisseurs</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {[
        { name: "Mobilia Design", rate: 92 },
        { name: "TechSolutions", rate: 78 },
        { name: "Bureau Moderne", rate: 85 }
      ].map((f, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px" }}>
            <span>{f.name}</span>
            <span style={{ fontWeight: "bold" }}>{f.rate}%</span>
          </div>
          <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px" }}>
            <div style={{ height: "100%", width: `${f.rate}%`, background: "#2ec4b6", borderRadius: "4px" }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Bloc 2: Répartition Revenus (Net vs Taxes) */}
  <div style={{ background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
    <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Synthèse Revenus</h3>
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      {/* Cercle simplifié représentant le revenu */}
      <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "conic-gradient(#009fe3 70%, #e2e8f0 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold" }}>70%</div>
      </div>
      <div style={{ fontSize: "14px", color: "#64748b" }}>
        <p><strong>85 000 DH</strong> : Revenu Net</p>
        <p><strong>39 500 DH</strong> : Taxes & Commissions</p>
      </div>
    </div>
  </div>
</div>

        {/* Commandes par statut (Nouveau Graphique) */}
        <div style={{ background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", gridColumn: "span 2" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>État des commandes</h3>
          <div style={{ display: "flex", gap: "20px" }}>
            {[ { l: "Validées", v: "En attente", c: "#f1c40f" }, { l: "En cours", v: "En préparation", c: "#009fe3" }, { l: "Terminées", v: "Expédié", c: "#10b981" } ].map((stat, i) => (
              <div key={i} style={{ flex: 1, padding: "15px", borderRadius: "12px", background: "#f8fafc", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: stat.c }}>{Math.floor(Math.random() * 20) + 5}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* AFFICHAGE DES DÉTAILS SI ON A CLIQUÉ SUR UNE CARTE */}
      {page !== "dashboard" && (
        <div style={{ background: "#fff", padding: "25px", borderRadius: "16px", marginTop: "25px" }}>
         <button 
  onClick={() => setPage("dashboard")} 
  style={{ 
    marginBottom: "20px", 
    padding: "10px 20px", 
    cursor: "pointer", 
    background: "#009fe3", // Bleu SupplyLink
    color: "#fff", 
    border: "none", 
    borderRadius: "8px", 
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.3s ease"
  }}
  onMouseOver={(e) => e.target.style.background = "#0284c7"} // Bleu plus foncé au survol
  onMouseOut={(e) => e.target.style.background = "#009fe3"}
>
  <span>←</span> Retour au Dashboard
</button>
          {renderDetail()}
        </div>
      )}
    </div>
    
  );
};

export default AdminStats;