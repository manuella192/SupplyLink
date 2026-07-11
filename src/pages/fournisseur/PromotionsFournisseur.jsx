import React, { useState } from "react";
import { Zap, CreditCard, CheckCircle, TrendingUp, Eye } from "lucide-react";
import "./Fournisseur.css";

const PACKS = [
  {
    id: "starter",
    label: "Starter",
    prix: 199,
    boost: "×2 visiteurs",
    duree: "7 jours",
    description: "Idéal pour tester la visibilité de vos articles.",
    color: "var(--color-primary)",
  },
  {
    id: "pro",
    label: "Pro",
    prix: 349,
    boost: "×4 visiteurs",
    duree: "15 jours",
    description: "Maximum de visibilité pour les nouvelles collections.",
    color: "#8b5cf6",
    popular: true,
  },
  {
    id: "elite",
    label: "Elite",
    prix: 599,
    boost: "×8 visiteurs",
    duree: "30 jours",
    description: "Placement prioritaire + badge Sponsorisé permanent.",
    color: "var(--color-amber)",
  },
];

const HISTORY = [
  { id: 1, pack: "Pro",     article: "Canapé Droit",  debut: "01/07/2026", fin: "16/07/2026", statut: "Actif",   vues: 1241 },
  { id: 2, pack: "Starter", article: "Table Ronde",   debut: "20/06/2026", fin: "27/06/2026", statut: "Expiré",  vues: 412  },
];

const PromotionsFournisseur = () => {
  const [step, setStep]   = useState("list"); // "list" | "choose" | "confirm" | "success"
  const [pack, setPack]   = useState(null);

  const handleChoose = (p) => { setPack(p); setStep("confirm"); };
  const handlePay    = ()  => setStep("success");
  const handleReset  = ()  => { setStep("list"); setPack(null); };

  return (
    <div className="fn-page">
      <h1 className="fn-page-title">Promotions & visibilité</h1>

      {step === "list" && (
        <>
          {/* KPI row */}
          <div className="fn-kpis" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {[
              { label: "Vues ce mois",    value: "1 653",  icon: Eye,          color: "var(--color-primary)" },
              { label: "Articles sponsorisés", value: "1", icon: Zap,          color: "#8b5cf6" },
              { label: "Boost actif",     value: "×4",     icon: TrendingUp,   color: "var(--color-green)" },
            ].map(({ label, value, icon: Icon, color }) => (
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

          {/* Historique promos */}
          <div className="fn-section">
            <div className="fn-section-head">
              <h2>Mes promotions</h2>
              <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px" }}
                onClick={() => setStep("choose")}>
                <Zap size={15} /> Acheter une promo
              </button>
            </div>
            <div className="fn-table-wrap">
              <table className="fn-table">
                <thead>
                  <tr>
                    {["Pack", "Article", "Début", "Fin", "Vues", "Statut"].map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {HISTORY.map((h) => (
                    <tr key={h.id}>
                      <td className="fn-td-bold">{h.pack}</td>
                      <td>{h.article}</td>
                      <td className="fn-td-muted">{h.debut}</td>
                      <td className="fn-td-muted">{h.fin}</td>
                      <td>{h.vues.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${h.statut === "Actif" ? "badge-active" : "badge-blocked"}`}>
                          {h.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Choix du pack ── */}
      {step === "choose" && (
        <>
          <button className="btn btn-ghost" style={{ alignSelf: "flex-start", marginBottom: -10 }} onClick={handleReset}>
            ‹ Retour
          </button>
          <p style={{ color: "var(--color-text-2)", fontSize: 14 }}>
            Choisissez un pack pour booster la visibilité de vos articles.
          </p>
          <div className="fn-promo-options" style={{ maxWidth: 460 }}>
            {PACKS.map((p) => (
              <button key={p.id} className="fn-promo-option" style={{ position: "relative" }} onClick={() => handleChoose(p)}>
                {p.popular && (
                  <span className="badge badge-active" style={{ position: "absolute", top: 10, right: 14, fontSize: 10 }}>
                    Populaire
                  </span>
                )}
                <span style={{ color: p.color, fontSize: 16 }}>
                  {p.label} — <strong>{p.prix} dh</strong>
                </span>
                <small style={{ color: "var(--color-text-2)" }}>{p.boost} · {p.duree}</small>
                <small>{p.description}</small>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Confirmation ── */}
      {step === "confirm" && pack && (
        <div className="fn-promo-overlay" onClick={handleReset}>
          <div className="fn-promo-modal" onClick={(e) => e.stopPropagation()}>
            <Zap size={36} style={{ color: pack.color, margin: "0 auto" }} />
            <h2>Pack {pack.label}</h2>
            <p>
              {pack.boost} pendant <strong>{pack.duree}</strong>.<br/>
              {pack.description}
            </p>

            <div style={{ background: "var(--color-bg)", borderRadius: "var(--radius-lg)", padding: "12px 16px", fontSize: 14, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Pack {pack.label}</span>
                <strong>{pack.prix} dh</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "var(--color-text-3)" }}>
                <span>Paiement sécurisé via Stripe</span>
                <CreditCard size={14} />
              </div>
            </div>

            <div className="fn-promo-modal-actions">
              <button className="btn btn-outline" onClick={handleReset}>Annuler</button>
              <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={handlePay}>
                <CreditCard size={15} /> Payer {pack.prix} dh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Succès ── */}
      {step === "success" && (
        <div className="fn-promo-overlay" onClick={handleReset}>
          <div className="fn-promo-modal" onClick={(e) => e.stopPropagation()}>
            <CheckCircle size={48} style={{ color: "var(--color-green)", margin: "0 auto" }} />
            <h2>Promotion activée !</h2>
            <p>
              Votre pack <strong>{pack?.label}</strong> est actif.<br/>
              Vos articles bénéficient d'un boost de <strong>{pack?.boost}</strong> pendant <strong>{pack?.duree}</strong>.
            </p>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleReset}>
              Retour aux promotions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsFournisseur;
