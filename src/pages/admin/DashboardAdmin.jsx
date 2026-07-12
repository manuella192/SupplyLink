import React from "react";
import { Users, ShoppingBag, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const KPIS = [
  { label: "Utilisateurs",    value: "1 284", delta: "+23 cette semaine", icon: Users,        color: "var(--color-primary)" },
  { label: "Commandes",       value: "342",   delta: "+14 aujourd'hui",   icon: ShoppingBag,  color: "var(--color-green)"   },
  { label: "Chiffre d'aff.", value: "94 200 dh", delta: "+8% ce mois",  icon: TrendingUp,   color: "#8b5cf6"              },
  { label: "Litiges ouverts", value: "7",     delta: "2 urgents",         icon: AlertTriangle,color: "var(--color-amber)"  },
];

const RECENT_ORDERS = [
  { id: "CMD-101", client: "Hamza Berrada",   montant: "496 dh",    statut: "En attente",    date: "09/07/2026" },
  { id: "CMD-102", client: "Sara Alaoui",     montant: "1 899 dh",  statut: "En préparation",date: "08/07/2026" },
  { id: "CMD-103", client: "Youssef Tazi",    montant: "2 319 dh",  statut: "Expédié",       date: "07/07/2026" },
  { id: "CMD-104", client: "Nadia El Fassi",  montant: "255 dh",    statut: "Livré",         date: "05/07/2026" },
];

const STATUS_CL = {
  "En attente":    "badge-pending",
  "En préparation":"badge-process",
  "Expédié":       "badge-shipped",
  "Livré":         "badge-delivered",
};

const WEEKLY = [
  { day: "Lun", val: 4800  },
  { day: "Mar", val: 7200  },
  { day: "Mer", val: 6100  },
  { day: "Jeu", val: 9400  },
  { day: "Ven", val: 8700  },
  { day: "Sam", val: 12300 },
  { day: "Dim", val: 5600  },
];

const BarChart = ({ data }) => {
  const max   = Math.max(...data.map((d) => d.val));
  const H     = 120;
  const BAR_W = 28;
  const GAP   = 12;
  const W     = data.length * (BAR_W + GAP) - GAP;

  return (
    <svg viewBox={`0 0 ${W} ${H + 32}`} style={{ width: "100%", maxWidth: 360, height: "auto" }}>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.val / max) * H);
        const x    = i * (BAR_W + GAP);
        const y    = H - barH;
        const isToday = i === 5;
        return (
          <g key={d.day}>
            <rect x={x} y={y} width={BAR_W} height={barH} rx="5"
              fill={isToday ? "var(--color-primary)" : "var(--color-primary)"} fillOpacity={isToday ? 1 : 0.35} />
            <text x={x + BAR_W / 2} y={H + 18} textAnchor="middle" fontSize="10" fill="var(--color-text-3)"
              fontFamily="inherit">{d.day}</text>
            {isToday && (
              <text x={x + BAR_W / 2} y={y - 6} textAnchor="middle" fontSize="9" fill="var(--color-primary)"
                fontWeight="700" fontFamily="inherit">{(d.val / 1000).toFixed(1)}k</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

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
              <div className="ad-kpi-delta">{delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Bar chart */}
        <div className="ad-section">
          <div className="ad-section-head">
            <h2>Ventes de la semaine</h2>
            <span style={{ fontSize: 12, color: "var(--color-text-3)", fontWeight: 600 }}>Samedi = aujourd'hui</span>
          </div>
          <div style={{ padding: "20px 20px 8px" }}>
            <BarChart data={WEEKLY} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12 }}>
              <span style={{ color: "var(--color-text-3)" }}>Total semaine</span>
              <strong style={{ color: "var(--color-text-1)" }}>
                {WEEKLY.reduce((s, d) => s + d.val, 0).toLocaleString()} dh
              </strong>
            </div>
          </div>
        </div>

        {/* Répartition statuts */}
        <div className="ad-section">
          <div className="ad-section-head"><h2>Répartition commandes</h2></div>
          <div style={{ padding: "20px" }}>
            {[
              { label: "En attente",     pct: 22, cls: "badge-pending",   color: "#f59e0b" },
              { label: "En préparation", pct: 35, cls: "badge-process",   color: "#3b82f6" },
              { label: "Expédiées",      pct: 28, cls: "badge-shipped",   color: "#8b5cf6" },
              { label: "Livrées",        pct: 15, cls: "badge-delivered", color: "#10b981" },
            ].map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                  <span style={{ color: "var(--color-text-2)", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 700, color: "var(--color-text-1)" }}>{pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "var(--color-border-lt)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width .6s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commandes récentes */}
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
