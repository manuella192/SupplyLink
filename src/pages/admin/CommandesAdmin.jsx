import React, { useState } from "react";
import { Search, Eye, Truck, X } from "lucide-react";
import "./admin.css";

const STATUTS = {
  en_attente:     { label: "En attente",     cls: "badge-pending",   next: "en_preparation",   nextLabel: "Valider",           icon: null    },
  en_preparation: { label: "En préparation", cls: "badge-process",   next: "expedie",           nextLabel: "Expédier",          icon: Truck   },
  expedie:        { label: "Expédié",        cls: "badge-shipped",   next: null,                nextLabel: null,                icon: null    },
  livre:          { label: "Livré",          cls: "badge-delivered", next: null,                nextLabel: null,                icon: null    },
};

const INITIAL = [
  { id: "CMD-101", client: "Hamza Berrada",   fournisseur: "MeublexMaroc", article: "Lampe de chevet",  qty: 2,  montant: 496,  mode: "Stripe",   statut: "en_attente",    date: "09/07/2026", livreur: null         },
  { id: "CMD-102", client: "Sara Alaoui",     fournisseur: "DécoMaroc",    article: "Table Ronde",      qty: 1,  montant: 1899, mode: "Cash",     statut: "en_preparation",date: "08/07/2026", livreur: "Ali Zouiten"},
  { id: "CMD-103", client: "Youssef Tazi",    fournisseur: "MeublexMaroc", article: "Canapé Droit",     qty: 1,  montant: 2319, mode: "Stripe",   statut: "expedie",       date: "07/07/2026", livreur: "Ali Zouiten"},
  { id: "CMD-104", client: "Nadia El Fassi",  fournisseur: "CuisineMaroc", article: "Coussin déco",     qty: 3,  montant: 255,  mode: "Cash",     statut: "livre",         date: "05/07/2026", livreur: "Mehdi Raji" },
];

const CommandesAdmin = () => {
  const [orders, setOrders]   = useState(INITIAL);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [detail, setDetail]   = useState(null);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const match = `${o.id} ${o.client} ${o.article}`.toLowerCase().includes(q);
    const f = filter === "all" || o.statut === filter;
    return match && f;
  });

  const advance = (id) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const ns = STATUTS[o.statut]?.next;
      return ns ? { ...o, statut: ns } : o;
    }));
    setDetail((d) => {
      if (!d || d.id !== id) return d;
      const ns = STATUTS[d.statut]?.next;
      return ns ? { ...d, statut: ns } : d;
    });
  };

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Commandes</h1>

      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="ID, client, article…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUTS).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
        </select>
      </div>

      <div className="ad-section">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>{["ID","Client","Fournisseur","Article","Montant","Mode","Date","Statut","Action"].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucune commande</td></tr>
              ) : filtered.map((o) => {
                const s = STATUTS[o.statut];
                return (
                  <tr key={o.id}>
                    <td className="ad-td-bold">{o.id}</td>
                    <td>{o.client}</td>
                    <td className="ad-td-muted">{o.fournisseur}</td>
                    <td>{o.article}</td>
                    <td className="ad-td-price">{o.montant.toLocaleString()} dh</td>
                    <td className="ad-td-muted">{o.mode}</td>
                    <td className="ad-td-muted">{o.date}</td>
                    <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setDetail(o)}><Eye size={14} /></button>
                        {s.next && (
                          <button className="btn btn-primary" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => advance(o.id)}>
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

      {detail && (
        <div className="ad-overlay" onClick={() => setDetail(null)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h2 className="ad-modal-title">Commande {detail.id}</h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>

            {[
              ["Client",      detail.client],
              ["Fournisseur", detail.fournisseur],
              ["Article",     `${detail.article} × ${detail.qty}`],
              ["Montant",     `${detail.montant.toLocaleString()} dh`],
              ["Mode paiem.", detail.mode],
              ["Date",        detail.date],
              ["Livreur",     detail.livreur || "Non assigné"],
              ["Statut",      STATUTS[detail.statut].label],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 100, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}

            <div className="ad-modal-actions">
              <button className="btn btn-outline" onClick={() => setDetail(null)}>Fermer</button>
              {STATUTS[detail.statut]?.next && (
                <button className="btn btn-primary" onClick={() => advance(detail.id)}>
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
