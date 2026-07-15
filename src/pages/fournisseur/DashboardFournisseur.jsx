import React, { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Package, Star, ArrowUp, Loader } from "lucide-react";
import { getFournisseurStats, getFournisseurCommandes } from "../../services/commandes.service";
import "./Fournisseur.css";

const STATUS_CL = {
  en_attente:     "badge-pending",
  en_preparation: "badge-process",
  expedie:        "badge-shipped",
  livre:          "badge-delivered",
};
const STATUS_LBL = {
  en_attente:     "En attente",
  en_preparation: "En préparation",
  expedie:        "Expédié",
  livre:          "Livré",
};

const DashboardFournisseur = () => {
  const [stats,   setStats]   = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: s }, { data: o }] = await Promise.all([
          getFournisseurStats(),
          getFournisseurCommandes(),
        ]);
        setStats(s);
        setOrders(o.slice(0, 5));
      } catch { /* état vide */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
      <Loader size={28} className="spin" style={{ color: "var(--color-primary)" }} />
    </div>
  );

  const KPIS = [
    { label: "Chiffre d'affaires", value: stats ? `${Number(stats.ca_total).toLocaleString()} dh` : "—", icon: TrendingUp, color: "var(--color-primary)" },
    { label: "Commandes totales",  value: stats ? String(stats.nb_commandes) : "—",                      icon: ShoppingBag, color: "var(--color-green)"   },
    { label: "Articles actifs",    value: stats ? String(stats.nb_articles) : "—",                        icon: Package,     color: "var(--color-amber)"   },
    { label: "Note moyenne",       value: stats ? `${stats.note_moy} / 5` : "—",                          icon: Star,        color: "#8b5cf6"              },
  ];

  return (
    <div className="fn-page">
      <h1 className="fn-page-title">Tableau de bord</h1>

      <div className="fn-kpis">
        {KPIS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="fn-kpi-card">
            <div className="fn-kpi-icon" style={{ backgroundColor: color + "1a", color }}>
              <Icon size={20} />
            </div>
            <div className="fn-kpi-body">
              <span className="fn-kpi-label">{label}</span>
              <span className="fn-kpi-value">{value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="fn-section">
        <div className="fn-section-head">
          <h2>Dernières commandes</h2>
          <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>5 plus récentes</span>
        </div>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>
            <ShoppingBag size={36} strokeWidth={1.2} />
            <p style={{ marginTop: 8, fontSize: 14 }}>Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="fn-table-wrap">
            <table className="fn-table">
              <thead>
                <tr>{["Réf.", "Client", "Date", "Statut", "Total"].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="fn-td-bold">{o.ref}</td>
                    <td>{o.client_nom}</td>
                    <td className="fn-td-muted">{new Date(o.created_at).toLocaleDateString("fr-MA")}</td>
                    <td><span className={`badge ${STATUS_CL[o.statut] || "badge-pending"}`}>{STATUS_LBL[o.statut] || o.statut}</span></td>
                    <td className="fn-td-price">{Number(o.total).toLocaleString()} dh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFournisseur;
