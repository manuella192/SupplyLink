import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Zap, CheckCircle, TrendingUp, Eye, Users, Loader, X, ExternalLink, AlertCircle } from "lucide-react";
import { getMyArticles, getMyStats } from "../../services/articles.service";
import { createPromoCheckout, getMyPromos } from "../../services/commandes.service";
import "./Fournisseur.css";

const PACKS = [
  {
    id: "starter", label: "Starter", prix: 10,
    acheteurs: "1 000 acheteurs", duree: "7 jours",
    description: "Idéal pour tester la visibilité. Articles mis en avant auprès de 1 000 acheteurs ciblés.",
    color: "var(--color-primary)",
  },
  {
    id: "pro", label: "Pro", prix: 100,
    acheteurs: "15 000 acheteurs", duree: "30 jours",
    description: "Boostez vos ventes avec une exposition maximale auprès de 15 000 acheteurs qualifiés.",
    color: "#8b5cf6", popular: true,
  },
  {
    id: "elite", label: "Elite", prix: 200,
    acheteurs: "40 000 acheteurs", duree: "60 jours",
    description: "Placement prioritaire, badge Sponsorisé permanent et 40 000 acheteurs exposés.",
    color: "var(--color-amber)",
  },
];

const STATUT_STYLE = {
  actif:   { cls: "badge-active",    label: "Actif"    },
  annulé:  { cls: "badge-cancelled", label: "Annulé"   },
  expiré:  { cls: "badge-blocked",   label: "Expiré"   },
};

const PromotionsFournisseur = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [articles,   setArticles]   = useState([]);
  const [promos,     setPromos]     = useState([]);
  const [stats,      setStats]      = useState({ vues_mois: 0, acheteurs: 0 });
  const [loading,    setLoading]    = useState(true);
  const [pack,     setPack]     = useState(null);
  const [artId,    setArtId]    = useState("");
  const [paying,   setPaying]   = useState(false);
  const [err,      setErr]      = useState("");

  // Résultat retour Stripe
  const params   = new URLSearchParams(location.search);
  const success  = params.get("success") === "1";
  const cancelled = params.get("cancel") === "1";

  const load = useCallback(async () => {
    try {
      const [{ data: arts }, { data: prs }, { data: st }] = await Promise.all([
        getMyArticles(),
        getMyPromos(),
        getMyStats(),
      ]);
      setArticles(arts);
      setPromos(prs);
      setStats(st);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Nettoyer les query params après affichage du résultat
  useEffect(() => {
    if (success || cancelled) {
      const t = setTimeout(() => navigate("/fournisseur/promotions", { replace: true }), 4000);
      return () => clearTimeout(t);
    }
  }, [success, cancelled, navigate]);

  const openModal = (p) => { setPack(p); setArtId(""); setErr(""); };
  const closeModal = () => { setPack(null); setErr(""); };

  const handlePay = async () => {
    if (!artId) { setErr("Veuillez sélectionner un article à promouvoir."); return; }
    setPaying(true);
    setErr("");
    try {
      const { data } = await createPromoCheckout({ articleId: Number(artId), pack: pack.id });
      // Redirection vers Stripe Checkout
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur lors de la création du paiement.");
      setPaying(false);
    }
  };

  return (
    <div className="fn-page">
      <h1 className="fn-page-title">Promotions & visibilité</h1>

      {/* ── Retour Stripe : succès ── */}
      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "var(--radius-md)", padding: "14px 18px", marginBottom: 20 }}>
          <CheckCircle size={20} style={{ color: "var(--color-green)", flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 700, color: "#15803d", margin: 0 }}>Paiement reçu — promotion en cours d'activation</p>
            <p style={{ fontSize: 12, color: "#166534", margin: 0 }}>Stripe a confirmé le paiement. Votre article sera mis en avant dans quelques instants.</p>
          </div>
        </div>
      )}

      {/* ── Retour Stripe : annulé ── */}
      {cancelled && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", padding: "14px 18px", marginBottom: 20 }}>
          <AlertCircle size={20} style={{ color: "var(--color-red)", flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 700, color: "#dc2626", margin: 0 }}>Paiement annulé</p>
            <p style={{ fontSize: 12, color: "#991b1b", margin: 0 }}>Vous avez quitté la page Stripe sans finaliser le paiement.</p>
          </div>
        </div>
      )}

      {/* ── KPI ── */}
      <div className="fn-kpis" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
        {[
          { label: "Promos actives",    value: promos.filter((p) => p.statut === "actif").length, icon: TrendingUp, color: "var(--color-green)"  },
          { label: "Acheteurs exposés", value: stats.acheteurs > 0 ? stats.acheteurs.toLocaleString("fr-MA") : "—", icon: Users, color: "#8b5cf6" },
          { label: "Vues ce mois",      value: loading ? "…" : stats.vues_mois.toLocaleString("fr-MA"), icon: Eye, color: "var(--color-primary)" },
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

      {/* ── Packs ── */}
      <div className="fn-section">
        <div className="fn-section-head"><h2>Choisir un pack de visibilité</h2></div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12, maxWidth: 520 }}>
          {PACKS.map((p) => (
            <button key={p.id} className="fn-promo-option"
              style={{ position: "relative", borderColor: p.popular ? "#8b5cf6" : undefined }}
              onClick={() => openModal(p)}>
              {p.popular && (
                <span className="badge" style={{ position: "absolute", top: 10, right: 12, fontSize: 10, background: "#8b5cf6", color: "#fff" }}>
                  Populaire
                </span>
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ color: p.color, fontSize: 17, fontWeight: 800 }}>{p.label}</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "var(--color-text-1)" }}>{p.prix} dh</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-primary)", fontWeight: 700, fontSize: 13 }}>
                <Users size={14} /> {p.acheteurs} · {p.duree}
              </div>
              <small style={{ color: "var(--color-text-2)", fontSize: 12 }}>{p.description}</small>
            </button>
          ))}
        </div>
      </div>

      {/* ── Historique promos ── */}
      {!loading && promos.length > 0 && (
        <div className="fn-section">
          <div className="fn-section-head"><h2>Mes promotions</h2></div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--color-bg)" }}>
                  {["Article","Pack","Montant","Du","Au","Statut"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "var(--color-text-3)", fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map((p) => {
                  const s = STATUT_STYLE[p.statut] || STATUT_STYLE.annulé;
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-lt)" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600 }}>{p.article}</td>
                      <td style={{ padding: "10px 14px", textTransform: "capitalize" }}>{p.pack}</td>
                      <td style={{ padding: "10px 14px", color: "var(--color-primary)", fontWeight: 700 }}>{Number(p.montant).toLocaleString()} dh</td>
                      <td style={{ padding: "10px 14px", color: "var(--color-text-3)" }}>{new Date(p.date_debut).toLocaleDateString("fr-MA")}</td>
                      <td style={{ padding: "10px 14px", color: "var(--color-text-3)" }}>{new Date(p.date_fin).toLocaleDateString("fr-MA")}</td>
                      <td style={{ padding: "10px 14px" }}><span className={`badge ${s.cls}`}>{s.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal confirmation + sélection article ── */}
      {pack && (
        <div className="fn-promo-overlay" onClick={closeModal}>
          <div className="fn-promo-modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "var(--color-text-3)", cursor: "pointer" }} onClick={closeModal}>
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
              <Zap size={28} style={{ color: pack.color }} />
              <h2 style={{ margin: 0 }}>Pack {pack.label}</h2>
            </div>

            {/* Résumé du pack */}
            <div style={{ background: "var(--color-bg)", borderRadius: "var(--radius-lg)", padding: "16px 18px", textAlign: "left" }}>
              {[
                ["Visibilité",  `${pack.acheteurs} acheteurs ciblés`],
                ["Durée",       pack.duree],
                ["Montant",     `${pack.prix} dh TTC`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--color-border-lt)", fontSize: 14 }}>
                  <span style={{ color: "var(--color-text-3)", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontWeight: 700, color: "var(--color-text-1)" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 16 }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 900, color: pack.color }}>{pack.prix} dh</span>
              </div>
            </div>

            {/* Sélecteur d'article */}
            <div className="form-group">
              <label className="form-label">Article à promouvoir *</label>
              <select className="form-input" value={artId} onChange={(e) => setArtId(e.target.value)}>
                <option value="">Sélectionner un article</option>
                {articles.filter((a) => a.statut === "actif").map((a) => (
                  <option key={a.id} value={a.id}>{a.nom} — {Number(a.prix).toLocaleString()} dh</option>
                ))}
              </select>
            </div>

            {err && (
              <p style={{ fontSize: 13, color: "var(--color-red)", background: "var(--color-red-lt)", borderRadius: "var(--radius-md)", padding: "10px 14px", margin: 0 }}>
                {err}
              </p>
            )}

            <p style={{ fontSize: 12, color: "var(--color-text-3)", textAlign: "center", margin: 0 }}>
              Vous serez redirigé vers la page de paiement sécurisée Stripe.
            </p>

            <div className="fn-promo-modal-actions">
              <button className="btn btn-outline" onClick={closeModal} disabled={paying}>Annuler</button>
              <button className="btn btn-primary" disabled={paying} onClick={handlePay}
                style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {paying
                  ? <Loader size={14} className="spin" />
                  : <ExternalLink size={14} />}
                {paying ? "Redirection…" : `Passer au paiement — ${pack.prix} dh`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsFournisseur;
