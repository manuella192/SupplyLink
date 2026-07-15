import React, { useState, useEffect, useCallback } from "react";
import { Search, Eye, X, Loader } from "lucide-react";
import { getCommandesAdmin, advanceCommande } from "../../services/commandes.service";
import "./admin.css";

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";
const IMG_PH   = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Crect fill='%23f1f5f9' width='44' height='44' rx='4'/%3E%3C/svg%3E";

const STATUTS = {
  en_attente:     { label: "En attente",     cls: "badge-pending",   next: "en_preparation", nextLabel: "Valider"   },
  en_preparation: { label: "En préparation", cls: "badge-process",   next: "expedie",         nextLabel: "Expédier"  },
  expedie:        { label: "Expédié",        cls: "badge-shipped",   next: null,              nextLabel: null        },
  livre:          { label: "Livré",          cls: "badge-delivered", next: null,              nextLabel: null        },
};

const CommandesAdmin = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [detail,  setDetail]  = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "all") params.statut = filter;
      if (search.trim())    params.q      = search.trim();
      const { data } = await getCommandesAdmin(params);
      setOrders(data.data || data);
    } catch { /* état vide */ }
    finally { setLoading(false); }
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const handleAdvance = async (id) => {
    try {
      const { data } = await advanceCommande(id);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, statut: data.statut } : o));
      if (detail?.id === id) setDetail((d) => ({ ...d, statut: data.statut }));
    } catch { /* ignore */ }
  };

  const imgSrc = (img) => {
    if (!img) return IMG_PH;
    return img.startsWith("http") ? img : BASE_URL + img;
  };

  const filtered = orders;

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Commandes</h1>

      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="Réf., client…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUTS).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
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
                <tr>{["Réf.","Client","Montant","Mode","Date","Statut","Action"].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucune commande</td></tr>
                ) : filtered.map((o) => {
                  const s = STATUTS[o.statut] || STATUTS.en_attente;
                  return (
                    <tr key={o.id}>
                      <td className="ad-td-bold">{o.ref}</td>
                      <td>{o.client}</td>
                      <td className="ad-td-price">{Number(o.total).toLocaleString()} dh</td>
                      <td className="ad-td-muted">{o.mode_paiement === "stripe" ? "Carte" : "Cash"}</td>
                      <td className="ad-td-muted">{new Date(o.created_at).toLocaleDateString("fr-MA")}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setDetail(o)}><Eye size={14} /></button>
                          {s.next && (
                            <button className="btn btn-primary" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => handleAdvance(o.id)}>
                              {s.nextLabel}
                            </button>
                          )}
                        </div>
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
          <div className="ad-modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h2 className="ad-modal-title">Commande {detail.ref}</h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>

            {[
              ["Client",     detail.client],
              ["Email",      detail.client_email || "—"],
              ["Paiement",   detail.mode_paiement === "stripe" ? "Carte bancaire" : "Cash à la livraison"],
              ["Montant",    `${Number(detail.total).toLocaleString()} dh`],
              ["Date",       new Date(detail.created_at).toLocaleDateString("fr-MA")],
              ["Statut",     (STATUTS[detail.statut] || STATUTS.en_attente).label],
              ...(detail.livreur_nom ? [["Livreur", detail.livreur_nom]] : []),
              ...(detail.heure_livraison ? [["Créneau", new Date(detail.heure_livraison).toLocaleString("fr-MA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 100, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}

            {(detail.items || []).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase", marginBottom: 10 }}>Articles</p>
                {detail.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                    <img src={imgSrc(item.image)} alt={item.nom_article}
                      style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "var(--radius-sm)", flexShrink: 0 }}
                      onError={(e) => { e.target.onerror = null; e.target.src = IMG_PH; }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--color-text-1)" }}>{item.nom_article}</span>
                    <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>×{item.quantite}</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "var(--color-primary)" }}>{(item.prix_unitaire * item.quantite).toLocaleString()} dh</span>
                  </div>
                ))}
              </div>
            )}

            <div className="ad-modal-actions">
              <button className="btn btn-outline" onClick={() => setDetail(null)}>Fermer</button>
              {STATUTS[detail.statut]?.next && (
                <button className="btn btn-primary" onClick={() => handleAdvance(detail.id)}>
                  {STATUTS[detail.statut].nextLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandesAdmin;
