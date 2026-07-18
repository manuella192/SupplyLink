import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, TrendingUp, AlertTriangle, ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./admin.css";

const fmt = (n) => Number(n || 0).toLocaleString("fr-MA");

const STATUT_LABEL = {
  en_attente:     "En attente",
  en_preparation: "En préparation",
  expedie:        "Expédié",
  livre:          "Livré",
  retourné:       "Retourné",
};
const STATUT_COLOR = {
  en_attente:     "#f59e0b",
  en_preparation: "#3b82f6",
  expedie:        "#8b5cf6",
  livre:          "#10b981",
  retourné:       "#ef4444",
};
const STATUT_CLS = {
  en_attente:     "badge-pending",
  en_preparation: "badge-process",
  expedie:        "badge-shipped",
  livre:          "badge-delivered",
  retourné:       "badge-blocked",
};

const DAY_FR = { Mon:"Lun", Tue:"Mar", Wed:"Mer", Thu:"Jeu", Fri:"Ven", Sat:"Sam", Sun:"Dim" };

const fmtBar = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  return String(Math.round(n));
};

const BarChart = ({ data }) => {
  if (!data?.length) return null;
  const vals  = data.map((d) => parseFloat(d.val));
  const max   = Math.max(...vals, 1);
  const H     = 110;
  const BAR_W = 32;
  const GAP   = 10;
  const LABEL_H = 18;
  const VAL_H   = 16;
  const TOP_PAD = 20;
  const W = data.length * (BAR_W + GAP) - GAP;
  const TOTAL_H = TOP_PAD + H + LABEL_H;

  return (
    <svg viewBox={`0 0 ${W} ${TOTAL_H}`} width={W}
      style={{ maxWidth: "100%", height: "auto", display: "block", overflow: "visible" }}>
      {data.map((d, i) => {
        const val  = parseFloat(d.val);
        const barH = val > 0 ? Math.max(8, (val / max) * H) : 3;
        const x    = i * (BAR_W + GAP);
        const y    = TOP_PAD + H - barH;
        const label = DAY_FR[d.day] || d.day;
        const isToday = i === data.length - 1;
        return (
          <g key={i}>
            {/* barre */}
            <rect x={x} y={y} width={BAR_W} height={barH} rx="5"
              fill="var(--color-primary)" fillOpacity={isToday ? 1 : (val > 0 ? 0.45 : 0.15)} />
            {/* montant au-dessus si > 0 */}
            {val > 0 && (
              <text x={x + BAR_W / 2} y={y - 5} textAnchor="middle" fontSize="9"
                fill={isToday ? "var(--color-primary)" : "var(--color-text-3)"}
                fontWeight={isToday ? "700" : "500"} fontFamily="inherit">
                {fmtBar(val)}
              </text>
            )}
            {/* label jour */}
            <text x={x + BAR_W / 2} y={TOP_PAD + H + LABEL_H - 2} textAnchor="middle"
              fontSize="10" fill={isToday ? "var(--color-primary)" : "var(--color-text-3)"}
              fontWeight={isToday ? "700" : "400"} fontFamily="inherit">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const DashboardAdmin = () => {
  const navigate       = useNavigate();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="ad-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "var(--color-primary)" }} />
    </div>
  );

  if (!stats) return (
    <div className="ad-page">
      <p style={{ color: "var(--color-text-3)", fontSize: 14 }}>Impossible de charger les statistiques.</p>
    </div>
  );

  const { users, commandes, ca, litiges, retournes, repartition, weekly, recentCmds } = stats;

  const caEvolLabel = ca.evolPct !== null
    ? (ca.evolPct >= 0 ? `+${ca.evolPct}% ce mois` : `${ca.evolPct}% ce mois`)
    : "Premier mois";

  const KPIS = [
    {
      label: "Utilisateurs",
      value: fmt(users.total),
      delta: `+${users.deltaWeek} cette semaine`,
      icon:  Users,
      color: "var(--color-primary)",
    },
    {
      label: "Commandes",
      value: fmt(commandes.total),
      delta: commandes.deltaToday > 0 ? `+${commandes.deltaToday} aujourd'hui` : "Aucune aujourd'hui",
      icon:  ShoppingBag,
      color: "var(--color-green)",
    },
    {
      label: "Chiffre d'aff.",
      value: fmt(ca.total) + " dh",
      delta: caEvolLabel,
      icon:  TrendingUp,
      color: "#8b5cf6",
    },
    {
      label: "Litiges actifs",
      value: String(litiges.ouverts),
      delta: litiges.urgents > 0 ? `${litiges.urgents} urgent(s) (+3j)` : "Aucun urgent",
      icon:  AlertTriangle,
      color: "var(--color-amber)",
    },
    {
      label: "Retours",
      value: String(retournes ?? 0),
      delta: (retournes ?? 0) > 0 ? "Commandes retournées" : "Aucun retour",
      icon:  RotateCcw,
      color: "var(--color-red)",
    },
  ];

  const weeklyTotal = weekly.reduce((s, d) => s + parseFloat(d.val), 0);

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Tableau de bord</h1>

      {/* KPIs */}
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
            <h2>Ventes - 7 derniers jours</h2>
            <span style={{ fontSize: 12, color: "var(--color-text-3)", fontWeight: 600 }}>
              {fmt(weeklyTotal)} dh
            </span>
          </div>
          <div style={{ padding: "20px 20px 8px" }}>
            {weekly.length > 0
              ? <BarChart data={weekly} />
              : <p style={{ fontSize: 13, color: "var(--color-text-3)" }}>Aucune vente cette semaine.</p>
            }
          </div>
        </div>

        {/* Répartition statuts */}
        <div className="ad-section">
          <div className="ad-section-head"><h2>Répartition commandes</h2></div>
          <div style={{ padding: "20px" }}>
            {repartition.length === 0
              ? <p style={{ fontSize: 13, color: "var(--color-text-3)" }}>Aucune commande.</p>
              : repartition.map(({ statut, pct }) => (
                <div key={statut} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                    <span style={{ color: "var(--color-text-2)", fontWeight: 500 }}>
                      {STATUT_LABEL[statut] || statut}
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--color-text-1)" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--color-border-lt)", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, transition: "width .6s",
                      background: STATUT_COLOR[statut] || "var(--color-primary)" }} />
                  </div>
                </div>
              ))
            }
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
        {recentCmds.length === 0
          ? <p style={{ padding: "20px", fontSize: 13, color: "var(--color-text-3)" }}>Aucune commande pour le moment.</p>
          : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>{["Réf","Client","Montant","Date","Statut"].map((h) => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {recentCmds.map((o) => (
                    <tr key={o.id}>
                      <td className="ad-td-bold">{o.ref}</td>
                      <td>{o.prenom_livr} {o.nom_livr}</td>
                      <td className="ad-td-price">{fmt(o.total)} dh</td>
                      <td className="ad-td-muted">{new Date(o.created_at).toLocaleDateString("fr-MA")}</td>
                      <td>
                        <span className={`badge ${STATUT_CLS[o.statut] || "badge-pending"}`}>
                          {STATUT_LABEL[o.statut] || o.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default DashboardAdmin;
