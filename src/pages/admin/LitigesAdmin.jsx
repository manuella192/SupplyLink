import React, { useState, useEffect, useCallback } from "react";
import { Search, Eye, CheckCircle, XCircle, X, AlertTriangle, Loader, Calendar, Package, RotateCcw } from "lucide-react";
import { getLitigesAdmin, validateLitige, resolveLitige, rejectLitige } from "../../services/commandes.service";
import "./admin.css";

const RAISONS = {
  non_conforme: "Non conforme",
  endommage:    "Endommagé",
  manquant:     "Manquant",
  autre:        "Autre",
};

const STATUS_INFO = {
  ouvert:    { cls: "badge-pending",   label: "Ouvert"      },
  en_cours:  { cls: "badge-process",   label: "En cours"    },
  validé:    { cls: "badge-process",   label: "Validé"      },
  recuperé:  { cls: "badge-shipped",   label: "Récupéré"    },
  résolu:    { cls: "badge-delivered", label: "Résolu"      },
  rejeté:    { cls: "badge-blocked",   label: "Rejeté"      },
};

const daysBetween = (d1, d2) => {
  if (!d1 || !d2) return null;
  const diff = Math.abs(new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24);
  return isNaN(diff) ? null : Math.round(diff);
};

const LitigesAdmin = () => {
  const [litiges, setLitiges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [detail,  setDetail]  = useState(null);
  const [code,    setCode]    = useState("");
  const [acting,  setActing]  = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getLitigesAdmin();
      setLitiges(data);
    } catch { /* état vide */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDetail = (l) => { setDetail(l); setCode(""); };

  const handleValidate = async () => {
    setActing(true);
    try {
      await validateLitige(detail.id);
      await load();
      setDetail(null);
    } catch (err) { alert(err.response?.data?.message || "Erreur"); }
    finally { setActing(false); }
  };

  const handleResolve = async () => {
    const isStripe = detail.mode_paiement === "stripe";
    if (!isStripe && !code.trim()) return;
    setActing(true);
    try {
      await resolveLitige(detail.id, isStripe ? undefined : code.trim());
      await load();
      setDetail(null);
      setCode("");
    } catch (err) { alert(err.response?.data?.message || "Erreur"); }
    finally { setActing(false); }
  };

  const handleReject = async () => {
    setActing(true);
    try {
      await rejectLitige(detail.id);
      await load();
      setDetail(null);
    } catch { /* ignore */ }
    finally { setActing(false); }
  };

  const filtered = litiges.filter((l) => {
    const q = `${l.ref} ${l.client} ${l.commande_ref}`.toLowerCase();
    return q.includes(search.toLowerCase()) && (filter === "all" || l.statut === filter);
  });

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Litiges & retours</h1>

      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="Réf., client…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous</option>
          {Object.entries(STATUS_INFO).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
          <Loader size={26} className="spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : (
        <div className="ad-section">
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>{["Réf.","Commande","Client","Raison","Montant","Paiement","Jours","Statut",""].map((h, i) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucun litige</td></tr>
                ) : filtered.map((l) => {
                  const si   = STATUS_INFO[l.statut] || STATUS_INFO.ouvert;
                  const days = daysBetween(l.date_livraison, l.created_at);
                  return (
                    <tr key={l.id}>
                      <td className="ad-td-bold">{l.ref}</td>
                      <td className="ad-td-muted">{l.commande_ref}</td>
                      <td>{l.client}</td>
                      <td style={{ fontSize: 12 }}>{RAISONS[l.raison] || l.raison}</td>
                      <td className="ad-td-price">{Number(l.total).toLocaleString()} dh</td>
                      <td className="ad-td-muted">{l.mode_paiement === "stripe" ? "Carte" : "Cash"}</td>
                      <td>
                        {days !== null ? (
                          <span style={{ fontWeight: 700, fontSize: 12, color: days <= 2 ? "var(--color-green)" : days <= 5 ? "var(--color-amber)" : "var(--color-red)" }}>
                            {days}j
                          </span>
                        ) : "—"}
                      </td>
                      <td><span className={`badge ${si.cls}`}>{si.label}</span></td>
                      <td>
                        <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => openDetail(l)}>
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detail && (
        <div className="ad-overlay" onClick={() => setDetail(null)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={18} style={{ color: "var(--color-amber)" }} />
                <h2 className="ad-modal-title">Litige {detail.ref}</h2>
              </div>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>

            {[
              ["Commande",   detail.commande_ref],
              ["Client",     detail.client],
              ["Email",      detail.email],
              ["Raison",     RAISONS[detail.raison] || detail.raison],
              ["Montant",    `${Number(detail.total).toLocaleString()} dh`],
              ["Paiement",   detail.mode_paiement === "stripe" ? "Carte bancaire" : "Cash"],
              ["Statut",     STATUS_INFO[detail.statut]?.label || detail.statut],
              ...(detail.livreur_nom ? [["Livreur", detail.livreur_nom]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 90, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}

            {/* Délais */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "14px 0 4px", background: "var(--color-bg)", borderRadius: "var(--radius-md)", padding: "14px" }}>
              {[
                { label: "Livré le",   val: detail.date_livraison ? new Date(detail.date_livraison).toLocaleDateString("fr-MA") : "—" },
                { label: "Demande",    val: new Date(detail.created_at).toLocaleDateString("fr-MA") },
                { label: "Délai",      val: daysBetween(detail.date_livraison, detail.created_at) != null ? `${daysBetween(detail.date_livraison, detail.created_at)}j` : "—" },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <Calendar size={14} style={{ color: "var(--color-text-3)", marginBottom: 4 }} />
                  <p style={{ fontSize: 11, color: "var(--color-text-3)", fontWeight: 700, textTransform: "uppercase", margin: "0 0 3px" }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-1)", margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--color-bg)", borderRadius: "var(--radius-md)", padding: "12px 14px", fontSize: 13, color: "var(--color-text-2)", fontStyle: "italic", margin: "8px 0" }}>
              "{detail.description}"
            </div>

            {/* Code retrait déjà attribué */}
            {detail.code_retrait && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "var(--radius-md)", padding: "12px 14px", marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-green)", marginBottom: 4 }}>CODE DE RETRAIT</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: "#15803d", letterSpacing: 2 }}>{detail.code_retrait}</p>
              </div>
            )}

            {/* ── Étape 1 : Admin valide le litige (ouvert) ── */}
            {detail.statut === "ouvert" && (
              <div className="ad-modal-actions">
                <button className="btn btn-danger" disabled={acting} onClick={handleReject}>
                  {acting ? <Loader size={13} className="spin" /> : <XCircle size={14} />} Rejeter
                </button>
                <button className="btn btn-primary" disabled={acting} onClick={handleValidate}>
                  {acting ? <Loader size={13} className="spin" /> : <CheckCircle size={14} />} Valider — notifier livreur
                </button>
              </div>
            )}

            {/* ── Étape 2 : En attente de récupération par le livreur ── */}
            {detail.statut === "validé" && (
              <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "var(--radius-md)", padding: "12px 14px", marginTop: 8, fontSize: 13, color: "#92400e" }}>
                <Package size={14} style={{ display: "inline", marginRight: 6 }} />
                En attente de récupération par <strong>{detail.livreur_nom || "le livreur"}</strong>.
              </div>
            )}

            {/* ── Étape 3 : Livreur a récupéré → admin clôture ── */}
            {detail.statut === "recuperé" && (
              <>
                <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "var(--radius-md)", padding: "12px 14px", marginTop: 8, fontSize: 13, color: "#0369a1" }}>
                  <RotateCcw size={14} style={{ display: "inline", marginRight: 6 }} />
                  Article récupéré par le livreur. {detail.mode_paiement === "stripe" ? "Cliquez pour rembourser automatiquement via Stripe." : "Saisissez le code de retrait à communiquer au client."}
                </div>
                {detail.mode_paiement !== "stripe" && (
                  <div className="form-group" style={{ margin: "12px 0 0" }}>
                    <label className="form-label">Code de retrait (Cash Plus / Wafa Cash)</label>
                    <input className="form-input" placeholder="Ex: CP-XXXXX-MA"
                      value={code} onChange={(e) => setCode(e.target.value)} />
                  </div>
                )}
                <div className="ad-modal-actions">
                  <button className="btn btn-primary"
                    disabled={acting || (detail.mode_paiement !== "stripe" && !code.trim())}
                    onClick={handleResolve}>
                    {acting ? <Loader size={13} className="spin" /> : <CheckCircle size={14} />}
                    {detail.mode_paiement === "stripe" ? "Rembourser via Stripe" : "Valider le retrait"}
                  </button>
                </div>
              </>
            )}

            {(detail.statut === "résolu" || detail.statut === "rejeté") && (
              <div className="ad-modal-actions">
                <button className="btn btn-outline" onClick={() => setDetail(null)}>Fermer</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LitigesAdmin;
