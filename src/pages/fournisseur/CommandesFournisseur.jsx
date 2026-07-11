import React, { useState } from "react";
import { Search, Eye, X, Package, CheckCircle, Truck, Clock } from "lucide-react";
import "./Fournisseur.css";

const STATUS = {
  en_attente:     { label: "En attente",    cls: "badge-pending",   icon: Clock,        next: "en_preparation",  nextLabel: "Prendre en charge" },
  en_preparation: { label: "En préparation",cls: "badge-process",   icon: Package,      next: "pret_expedition",  nextLabel: "Prêt à expédier"   },
  pret_expedition:{ label: "Prêt à expédier",cls:"badge-shipped",   icon: Truck,        next: null,               nextLabel: null                 },
  livre:          { label: "Livré",         cls: "badge-delivered", icon: CheckCircle,  next: null,               nextLabel: null                 },
};

const INITIAL_ORDERS = [
  { id: "CMD-001", client: "Hamza Berrada",  article: "Lampe de chevet",     qty: 2,  prix: 248,  total: 496,  date: "09/07/2026", statut: "en_attente",    adresse: "Casablanca, Maarif, Rue Hassan II" },
  { id: "CMD-002", client: "Sara Alaoui",   article: "Table Ronde",          qty: 1,  prix: 1899, total: 1899, date: "08/07/2026", statut: "en_preparation",adresse: "Rabat, Agdal, Av. Mohamed V"       },
  { id: "CMD-003", client: "Youssef Tazi",  article: "Canapé Droit",         qty: 1,  prix: 2319, total: 2319, date: "07/07/2026", statut: "pret_expedition",adresse: "Marrakech, Guéliz, Rue Ibn Toumert"},
  { id: "CMD-004", client: "Nadia El Fassi",article: "Coussin décoratif",    qty: 3,  prix: 85,   total: 255,  date: "05/07/2026", statut: "livre",          adresse: "Fès, Medina, Derb Taazi"          },
];

const CommandesFournisseur = () => {
  const [orders, setOrders]   = useState(INITIAL_ORDERS);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [detail, setDetail]   = useState(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.article.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.statut === filter;
    return matchSearch && matchFilter;
  });

  const advance = (id) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const nextStatut = STATUS[o.statut]?.next;
      return nextStatut ? { ...o, statut: nextStatut } : o;
    }));
    if (detail?.id === id) {
      setDetail((d) => {
        const nextStatut = STATUS[d.statut]?.next;
        return nextStatut ? { ...d, statut: nextStatut } : d;
      });
    }
  };

  return (
    <div className="fn-page">
      <h1 className="fn-page-title">Commandes reçues</h1>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-3)" }} />
          <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Rechercher une commande…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="fn-section">
        <div className="fn-table-wrap">
          <table className="fn-table">
            <thead>
              <tr>
                {["ID", "Client", "Article", "Quantité", "Total", "Date", "Statut", "Action"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucune commande trouvée</td></tr>
              ) : filtered.map((o) => {
                const s = STATUS[o.statut];
                return (
                  <tr key={o.id}>
                    <td className="fn-td-bold">{o.id}</td>
                    <td>{o.client}</td>
                    <td>{o.article}</td>
                    <td className="fn-td-muted">{o.qty}</td>
                    <td className="fn-td-price">{o.total.toLocaleString()} dh</td>
                    <td className="fn-td-muted">{o.date}</td>
                    <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost" style={{ padding: "5px 10px" }} onClick={() => setDetail(o)}>
                          <Eye size={14} />
                        </button>
                        {s.next && (
                          <button className="btn btn-primary" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => advance(o.id)}>
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

      {/* Détail commande */}
      {detail && (
        <div className="fn-promo-overlay" onClick={() => setDetail(null)}>
          <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", padding: "28px 28px 24px", maxWidth: 460, width: "100%", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, fontSize: 18 }}>Détail — {detail.id}</h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={18} /></button>
            </div>

            {[
              ["Client",    detail.client],
              ["Article",   detail.article],
              ["Quantité",  detail.qty],
              ["Total",     `${detail.total.toLocaleString()} dh`],
              ["Date",      detail.date],
              ["Adresse",   detail.adresse],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 90, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}

            <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
              <span style={{ minWidth: 90, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>Statut</span>
              <span className={`badge ${STATUS[detail.statut].cls}`}>{STATUS[detail.statut].label}</span>
            </div>

            {STATUS[detail.statut]?.next && (
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={() => advance(detail.id)}>
                {STATUS[detail.statut].nextLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandesFournisseur;
