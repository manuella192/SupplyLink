import React, { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, X } from "lucide-react";
import "./admin.css";

const INITIAL = [
  { id: 1, nom: "Canapé Droit",      fournisseur: "MeublexMaroc", categorie: "Mobilier",       prix: 2319, stock: 8,  statut: "actif",   date: "01/06/2026" },
  { id: 2, nom: "Table Ronde",       fournisseur: "DécoMaroc",    categorie: "Mobilier",       prix: 1899, stock: 14, statut: "actif",   date: "12/06/2026" },
  { id: 3, nom: "Lampe de chevet",   fournisseur: "LightShop",    categorie: "Décoration",     prix: 248,  stock: 32, statut: "actif",   date: "20/06/2026" },
  { id: 4, nom: "Réfrigérateur 250L",fournisseur: "ElectroPro",   categorie: "Électroménager", prix: 3499, stock: 5,  statut: "suspendu",date: "05/07/2026" },
  { id: 5, nom: "Coussin Berbère",   fournisseur: "ArtisanatMA",  categorie: "Décoration",     prix: 85,   stock: 60, statut: "actif",   date: "08/07/2026" },
];

const ArticlesAdmin = () => {
  const [articles, setArticles] = useState(INITIAL);
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("all");
  const [detail, setDetail]     = useState(null);

  const cats = ["all", ...new Set(INITIAL.map((a) => a.categorie))];

  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    const match = `${a.nom} ${a.fournisseur}`.toLowerCase().includes(q);
    const c = cat === "all" || a.categorie === cat;
    return match && c;
  });

  const toggleStatut = (id) => {
    setArticles((prev) => prev.map((a) =>
      a.id === id ? { ...a, statut: a.statut === "actif" ? "suspendu" : "actif" } : a
    ));
    if (detail?.id === id) setDetail((d) => ({ ...d, statut: d.statut === "actif" ? "suspendu" : "actif" }));
  };

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Articles</h1>

      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="Rechercher un article…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c} value={c}>{c === "all" ? "Toutes catégories" : c}</option>)}
        </select>
      </div>

      <div className="ad-section">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>{["Nom","Fournisseur","Catégorie","Prix","Stock","Date","Statut","Actions"].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucun article</td></tr>
              ) : filtered.map((a) => (
                <tr key={a.id}>
                  <td className="ad-td-bold">{a.nom}</td>
                  <td className="ad-td-muted">{a.fournisseur}</td>
                  <td>{a.categorie}</td>
                  <td className="ad-td-price">{a.prix.toLocaleString()} dh</td>
                  <td style={{ color: a.stock < 5 ? "var(--color-red)" : "var(--color-text-2)", fontWeight: a.stock < 5 ? 700 : 400 }}>{a.stock}</td>
                  <td className="ad-td-muted">{a.date}</td>
                  <td><span className={`badge ${a.statut === "actif" ? "badge-active" : "badge-blocked"}`}>{a.statut}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setDetail(a)}><Eye size={14} /></button>
                      <button className={`btn ${a.statut === "actif" ? "btn-danger" : "btn-outline"}`} style={{ padding: "5px 10px", fontSize: 12 }}
                        onClick={() => toggleStatut(a.id)} title={a.statut === "actif" ? "Suspendre" : "Activer"}>
                        {a.statut === "actif" ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      </button>
                    </div>
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
              <h2 className="ad-modal-title">{detail.nom}</h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>
            {[
              ["Fournisseur", detail.fournisseur],
              ["Catégorie",  detail.categorie],
              ["Prix",       `${detail.prix.toLocaleString()} dh`],
              ["Stock",      detail.stock],
              ["Ajouté le",  detail.date],
              ["Statut",     detail.statut],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 100, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}
            <div className="ad-modal-actions">
              <button className="btn btn-outline" onClick={() => setDetail(null)}>Fermer</button>
              <button className={`btn ${detail.statut === "actif" ? "btn-danger" : "btn-primary"}`}
                onClick={() => { toggleStatut(detail.id); setDetail(null); }}>
                {detail.statut === "actif" ? "Suspendre" : "Réactiver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesAdmin;
