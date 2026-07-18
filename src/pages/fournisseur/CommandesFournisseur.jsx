import React, { useState, useEffect, useCallback } from "react";
import { Search, Eye, X, Package, Loader, ChevronRight } from "lucide-react";
import { getFournisseurCommandes, advanceCommande } from "../../services/commandes.service";
import "./Fournisseur.css";

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";
const IMG_PH   = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect fill='%23f1f5f9' width='56' height='56' rx='6'/%3E%3C/svg%3E";

const STATUS = {
  en_attente:     { label: "En attente",     cls: "badge-pending",   nextLabel: "Valider"  },
  en_preparation: { label: "En préparation", cls: "badge-process",   nextLabel: "Expédier" },
  expedie:        { label: "Expédié",        cls: "badge-shipped",   nextLabel: null       },
  livre:          { label: "Livré",          cls: "badge-delivered", nextLabel: null       },
  retourné:       { label: "Retourné",       cls: "badge-blocked",   nextLabel: null       },
};

const CommandesFournisseur = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [detail,  setDetail]  = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await getFournisseurCommandes();
      setOrders(data);
    } catch { /* état vide */ }
    finally { setLoading(false); }
  }, []);

  const handleAdvance = async (id) => {
    try {
      const { data } = await advanceCommande(id);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, statut: data.statut } : o));
      if (detail?.id === id) setDetail((d) => ({ ...d, statut: data.statut }));
    } catch { /* ignore */ }
  };

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = o.ref.toLowerCase().includes(q) || o.client_nom.toLowerCase().includes(q);
    const matchFilter = filter === "all" || o.statut === filter;
    return matchSearch && matchFilter;
  });

  const imgSrc = (img) => {
    if (!img) return IMG_PH;
    return img.startsWith("http") ? img : BASE_URL + img;
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
      <Loader size={28} className="spin" style={{ color: "var(--color-primary)" }} />
    </div>
  );

  return (
    <div className="fn-page">
      <h1 className="fn-page-title">Commandes reçues</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-3)" }} />
          <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Réf. ou client…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
        </select>
      </div>

      <div className="fn-section">
        <div className="fn-table-wrap">
          <table className="fn-table">
            <thead>
              <tr>{["Réf.", "Client", "Date", "Statut", "Total", ""].map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>
                  Aucune commande
                </td></tr>
              ) : filtered.map((o) => {
                const s = STATUS[o.statut] || STATUS.en_attente;
                return (
                  <tr key={o.id}>
                    <td className="fn-td-bold">{o.ref}</td>
                    <td>{o.client_nom}</td>
                    <td className="fn-td-muted">{new Date(o.created_at).toLocaleDateString("fr-MA")}</td>
                    <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                    <td className="fn-td-price">{Number(o.total).toLocaleString()} dh</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setDetail(o)}>
                          <Eye size={14} />
                        </button>
                        {s.nextLabel && (
                          <button className="btn btn-primary" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => handleAdvance(o.id)}>
                            {s.nextLabel} <ChevronRight size={12} />
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

      {detail && (
        <div className="fn-promo-overlay" onClick={() => setDetail(null)}>
          <div style={{
            background: "#fff", borderRadius: "var(--radius-xl)", padding: "28px 28px 24px",
            maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, fontSize: 18 }}>Commande {detail.ref}</h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={18} /></button>
            </div>

            {[
              ["Client",    detail.client_nom],
              ["Téléphone", detail.telephone_livr || detail.client_tel || "—"],
              ["Adresse",   `${detail.adresse_livr}, ${detail.ville_livr}`],
              ["Paiement",  detail.mode_paiement === "stripe" ? "Carte bancaire" : "Cash à la livraison"],
              ["Date",      new Date(detail.created_at).toLocaleDateString("fr-MA")],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 90, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}

            <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
              <span style={{ minWidth: 90, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>Statut</span>
              <span className={`badge ${(STATUS[detail.statut] || STATUS.en_attente).cls}`}>{(STATUS[detail.statut] || STATUS.en_attente).label}</span>
            </div>

            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase", marginBottom: 12 }}>Articles commandés</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(detail.items || []).map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--color-bg)", borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
                    <img
                      src={imgSrc(item.image)}
                      alt={item.nom_article}
                      style={{ width: 52, height: 52, borderRadius: "var(--radius-sm)", objectFit: "cover", border: "1px solid var(--color-border-lt)", flexShrink: 0 }}
                      onError={(e) => { e.target.onerror = null; e.target.src = IMG_PH; }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: "var(--color-text-1)", margin: 0 }}>{item.nom_article}</p>
                      <p style={{ fontSize: 12, color: "var(--color-text-3)", margin: "2px 0 0" }}>Qté : {item.quantite}</p>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 14, color: "var(--color-primary)" }}>
                      {(item.prix_unitaire * item.quantite).toLocaleString()} dh
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, paddingTop: 12, borderTop: "2px solid var(--color-border)" }}>
              <span>Total</span>
              <span style={{ color: "var(--color-primary)" }}>{Number(detail.total).toLocaleString()} dh</span>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDetail(null)}>Fermer</button>
              {STATUS[detail.statut]?.nextLabel && (
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAdvance(detail.id)}>
                  {STATUS[detail.statut].nextLabel} <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandesFournisseur;
