import React from "react";
import { Users, ShoppingBag, TrendingUp, AlertTriangle, ArrowUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const KPIS = [
  { label: "Utilisateurs",   value: "1 284", delta: "+23 cette semaine", icon: Users,       color: "var(--color-primary)" },
  { label: "Commandes",      value: "342",   delta: "+14 aujourd'hui",   icon: ShoppingBag, color: "var(--color-green)"   },
  { label: "Chiffre d'aff.", value: "94 200 dh", delta: "+8% ce mois",  icon: TrendingUp,  color: "#8b5cf6"              },
  { label: "Litiges ouverts",value: "7",     delta: "2 urgents",         icon: AlertTriangle,color: "var(--color-amber)"  },
];

const RECENT_ORDERS = [
  { id: "CMD-101", client: "Hamza Berrada",  montant: "496 dh",   statut: "En attente",    date: "09/07/2026" },
  { id: "CMD-102", client: "Sara Alaoui",   montant: "1 899 dh", statut: "En préparation",date: "08/07/2026" },
  { id: "CMD-103", client: "Youssef Tazi",  montant: "2 319 dh", statut: "Expédié",       date: "07/07/2026" },
  { id: "CMD-104", client: "Nadia El Fassi",montant: "255 dh",   statut: "Livré",         date: "05/07/2026" },
];

const STATUS_CL = { "En attente":"badge-pending","En préparation":"badge-process","Expédié":"badge-shipped","Livré":"badge-delivered" };

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Tableau de bord</h1>

      <div className="ad-kpis">
        {KPIS.map(({ label, value, delta, icon: Icon, color }) => (
          <div key={label} className="ad-kpi">
            <div className="ad-kpi-icon" style={{ backgroundColor: color + "1a", color }}>
              <Icon size={20} />
            </div>
            <div className="ad-kpi-body">
              <div className="ad-kpi-label">{label}</div>
              <div className="ad-kpi-value">{value}</div>
              <div className="ad-kpi-delta"><ArrowUp size={10} style={{ display: "inline" }} /> {delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ad-section">
        <div className="ad-section-head">
          <h2>Dernières commandes</h2>
          <button className="btn btn-ghost" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}
            onClick={() => navigate("/admin/commandes")}>
            Tout voir <ArrowRight size={14} />
          </button>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>{["ID","Client","Montant","Date","Statut"].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((o) => (
                <tr key={o.id}>
                  <td className="ad-td-bold">{o.id}</td>
                  <td>{o.client}</td>
                  <td className="ad-td-price">{o.montant}</td>
                  <td className="ad-td-muted">{o.date}</td>
                  <td><span className={`badge ${STATUS_CL[o.statut] || "badge-pending"}`}>{o.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
