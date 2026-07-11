import React from "react";
import { TrendingUp, Eye, ShoppingBag, Star, ArrowUp } from "lucide-react";
import "./Fournisseur.css";

const KPIS = [
  { label:"Ventes ce mois",   value:"18 400 dh", icon:TrendingUp, delta:"+12%", color:"var(--color-primary)"  },
  { label:"Visiteurs",        value:"2 341",     icon:Eye,        delta:"+8%",  color:"var(--color-green)"    },
  { label:"Commandes",        value:"14",        icon:ShoppingBag,delta:"+3",   color:"var(--color-amber)"    },
  { label:"Note moyenne",     value:"4.6 / 5",   icon:Star,       delta:"+0.2", color:"#8b5cf6"               },
];

const RECENT_ORDERS = [
  { id:"CMD-001", article:"Lampe de chevet",    statut:"En attente",   total:"248 dh",  date:"09/07/2026" },
  { id:"CMD-002", article:"Table Ronde",        statut:"En préparation",total:"1 899 dh",date:"08/07/2026" },
  { id:"CMD-003", article:"Canapé Droit",       statut:"Expédié",      total:"2 319 dh",date:"07/07/2026" },
];

const STATUS_CL = { "En attente":"badge-pending","En préparation":"badge-process","Expédié":"badge-shipped","Livré":"badge-delivered" };

const DashboardFournisseur = () => (
  <div className="fn-page">
    <h1 className="fn-page-title">Tableau de bord</h1>

    {/* KPIs */}
    <div className="fn-kpis">
      {KPIS.map(({ label, value, icon: Icon, delta, color }) => (
        <div key={label} className="fn-kpi-card">
          <div className="fn-kpi-icon" style={{ backgroundColor: color + "1a", color }}>
            <Icon size={20} />
          </div>
          <div className="fn-kpi-body">
            <span className="fn-kpi-label">{label}</span>
            <span className="fn-kpi-value">{value}</span>
          </div>
          <span className="fn-kpi-delta"><ArrowUp size={12} />{delta}</span>
        </div>
      ))}
    </div>

    {/* Commandes récentes */}
    <div className="fn-section">
      <div className="fn-section-head">
        <h2>Commandes récentes</h2>
      </div>
      <div className="fn-table-wrap">
        <table className="fn-table">
          <thead>
            <tr>
              {["ID","Article","Date","Statut","Montant"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((o) => (
              <tr key={o.id}>
                <td className="fn-td-bold">{o.id}</td>
                <td>{o.article}</td>
                <td className="fn-td-muted">{o.date}</td>
                <td><span className={`badge ${STATUS_CL[o.statut] || "badge-pending"}`}>{o.statut}</span></td>
                <td className="fn-td-price">{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DashboardFournisseur;
