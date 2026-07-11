import React, { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, X, AlertTriangle } from "lucide-react";
import "./admin.css";

const RAISONS = {
  non_conforme: "Article non conforme",
  endommage:    "Article endommagé",
  manquant:     "Article manquant",
  autre:        "Autre",
};

const INITIAL = [
  { id: "LIT-001", commande: "CMD-102", client: "Sara Alaoui",   article: "Table Ronde",      raison: "non_conforme", description: "La table reçue n'est pas la bonne couleur.", statut: "ouvert",   date: "10/07/2026", montant: 1899, retrait: null          },
  { id: "LIT-002", commande: "CMD-098", client: "Karim Idrissi", article: "Canapé 3 places",  raison: "endommage",    description: "Un pied du canapé est cassé à la livraison.", statut: "en_cours", date: "08/07/2026", montant: 3200, retrait: null          },
  { id: "LIT-003", commande: "CMD-087", client: "Latifa Benaissa",article:"Lampe de bureau",  raison: "manquant",     description: "Le câble USB n'était pas dans le colis.",     statut: "résolu",   date: "01/07/2026", montant: 129,  retrait: "CP-48291-MA" },
];

const STATUS_INFO = {
  ouvert:   { cls: "badge-pending",   label: "Ouvert"    },
  en_cours: { cls: "badge-process",   label: "En cours"  },
  résolu:   { cls: "badge-delivered", label: "Résolu"    },
  rejeté:   { cls: "badge-blocked",   label: "Rejeté"    },
};

const LitigesAdmin = () => {
  const [litiges, setLitiges] = useState(INITIAL);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [detail, setDetail]   = useState(null);
  const [code, setCode]       = useState("");

  const filtered = litiges.filter((l) => {
    const q = search.toLowerCase();
    const match = `${l.id} ${l.client} ${l.article}`.toLowerCase().includes(q);
    const f = filter === "all" || l.statut === filter;
    return match && f;
  });

  const setStatut = (id, statut, retrait = null) => {
    setLitiges((prev) => prev.map((l) => l.id === id ? { ...l, statut, retrait: retrait || l.retrait } : l));
    setDetail(null);
    setCode("");
  };

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Litiges & retours</h1>

      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="ID, client, article…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous</option>
          {Object.entries(STATUS_INFO).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
        </select>
      </div>

      <div className="ad-section">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>{["ID","Commande","Client","Article","Raison","Montant","Date","Statut","Action"].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucun litige</td></tr>
              ) : filtered.map((l) => {
                const si = STATUS_INFO[l.statut];
                return (
                  <tr key={l.id}>
                    <td className="ad-td-bold">{l.id}</td>
                    <td className="ad-td-muted">{l.commande}</td>
                    <td>{l.client}</td>
                    <td>{l.article}</td>
                    <td style={{ fontSize: 12 }}>{RAISONS[l.raison]}</td>
                    <td className="ad-td-price">{l.montant.toLocaleString()} dh</td>
                    <td className="ad-td-muted">{l.date}</td>
                    <td><span className={`badge ${si.cls}`}>{si.label}</span></td>
                    <td>
                      <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => { setDetail(l); setCode(""); }}>
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

      {detail && (
        <div className="ad-overlay" onClick={() => setDetail(null)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={18} style={{ color: "var(--color-amber)" }} />
                <h2 className="ad-modal-title">Litige {detail.id}</h2>
              </div>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>

            {[
              ["Commande",   detail.commande],
              ["Client",     detail.client],
              ["Article",    detail.article],
              ["Raison",     RAISONS[detail.raison]],
              ["Montant",    `${detail.montant.toLocaleString()} dh`],
              ["Date",       detail.date],
              ["Statut",     STATUS_INFO[detail.statut].label],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 90, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}

            {/* Description */}
            <div style={{ background: "var(--color-bg)", borderRadius: "var(--radius-md)", padding: "12px 14px", fontSize: 13, color: "var(--color-text-2)", fontStyle: "italic" }}>
              "{detail.description}"
            </div>

            {detail.retrait && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-green)", marginBottom: 4 }}>CODE DE RETRAIT</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: "#15803d", letterSpacing: 2 }}>{detail.retrait}</p>
                <p style={{ fontSize: 11, color: "var(--color-text-3)", marginTop: 4 }}>À communiquer au client pour retrait Cash Plus / Wafa Cash</p>
              </div>
            )}

            {(detail.statut === "ouvert" || detail.statut === "en_cours") && (
              <>
                {/* Champ code retrait pour résoudre */}
                <div className="form-group">
                  <label className="form-label">Code retrait (Cash Plus / Wafa Cash)</label>
                  <input className="form-input" placeholder="Ex: CP-XXXXX-MA" value={code}
                    onChange={(e) => setCode(e.target.value)} />
                </div>

                <div className="ad-modal-actions">
                  <button className="btn btn-danger" onClick={() => setStatut(detail.id, "rejeté")}>
                    <XCircle size={14} style={{ marginRight: 4 }} /> Rejeter
                  </button>
                  <button className="btn btn-primary" disabled={!code.trim()} onClick={() => setStatut(detail.id, "résolu", code.trim())}>
                    <CheckCircle size={14} style={{ marginRight: 4 }} /> Résoudre + remboursement
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
