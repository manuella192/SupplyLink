import React, { useState } from "react";
import { Search, Zap, X } from "lucide-react";
import "./admin.css";

const INITIAL = [
  { id: 1, fournisseur: "MeublexMaroc", pack: "Pro",     article: "Canapé Droit",  debut: "01/07/2026", fin: "16/07/2026", montant: 349, statut: "actif",   vues: 1241 },
  { id: 2, fournisseur: "DécoMaroc",    pack: "Starter", article: "Table Ronde",   debut: "20/06/2026", fin: "27/06/2026", montant: 199, statut: "expiré",  vues: 412  },
  { id: 3, fournisseur: "ElectroPro",   pack: "Elite",   article: "Réfrigérateur", debut: "10/07/2026", fin: "10/08/2026", montant: 599, statut: "actif",   vues: 683  },
  { id: 4, fournisseur: "LightShop",    pack: "Starter", article: "Lampe chevet",  debut: "01/06/2026", fin: "08/06/2026", montant: 199, statut: "expiré",  vues: 298  },
];

const PromosAdmin = () => {
  const [promos, setPromos] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const filtered = promos.filter((p) => {
    const q = search.toLowerCase();
    const match = `${p.fournisseur} ${p.article} ${p.pack}`.toLowerCase().includes(q);
    const f = filter === "all" || p.statut === filter;
    return match && f;
  });

  const cancel = (id) => {
    setPromos((prev) => prev.map((p) => p.id === id ? { ...p, statut: "annulé" } : p));
    setDetail(null);
  };

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Promotions</h1>

      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="Rechercher…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous</option>
          <option value="actif">Actif</option>
          <option value="expiré">Expiré</option>
          <option value="annulé">Annulé</option>
        </select>
      </div>

      <div className="ad-section">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>{["Fournisseur","Article","Pack","Montant","Début","Fin","Vues","Statut","Action"].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucune promotion</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td className="ad-td-bold">{p.fournisseur}</td>
                  <td>{p.article}</td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 13, color: "var(--color-primary)" }}>
                      <Zap size={12} />{p.pack}
                    </span>
                  </td>
                  <td className="ad-td-price">{p.montant} dh</td>
                  <td className="ad-td-muted">{p.debut}</td>
                  <td className="ad-td-muted">{p.fin}</td>
                  <td>{p.vues.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${p.statut === "actif" ? "badge-active" : p.statut === "annulé" ? "badge-blocked" : "badge-pending"}`}>
                      {p.statut}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setDetail(p)}>
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="ad-overlay" onClick={() => setDetail(null)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h2 className="ad-modal-title">Promo · {detail.fournisseur}</h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>
            {[
              ["Article",    detail.article],
              ["Pack",       detail.pack],
              ["Montant",    `${detail.montant} dh`],
              ["Période",    `${detail.debut} → ${detail.fin}`],
              ["Vues",       detail.vues.toLocaleString()],
              ["Statut",     detail.statut],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 90, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}
            <div className="ad-modal-actions">
              <button className="btn btn-outline" onClick={() => setDetail(null)}>Fermer</button>
              {detail.statut === "actif" && (
                <button className="btn btn-danger" onClick={() => cancel(detail.id)}>Annuler la promo</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromosAdmin;
