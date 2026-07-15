import React, { useState, useEffect, useCallback } from "react";
import { Search, Eye, CheckCircle, XCircle, X, Loader } from "lucide-react";
import { getAdminArticles, toggleArticle } from "../../services/articles.service";
import "./admin.css";

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";
const IMG_PH   = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Crect fill='%23f1f5f9' width='44' height='44' rx='4'/%3E%3C/svg%3E";
const CATS     = ["all","Mobilier","Électroménager","Décoration","Literie","Cuisine"];

const ArticlesAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState("all");
  const [statutF,  setStatutF]  = useState("all");
  const [detail,   setDetail]   = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim())      params.q        = search.trim();
      if (cat !== "all")      params.categorie = cat;
      if (statutF !== "all")  params.statut    = statutF;
      const { data } = await getAdminArticles(params);
      setArticles(Array.isArray(data) ? data : (data.data || []));
    } catch { /* état vide */ }
    finally { setLoading(false); }
  }, [search, cat, statutF]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleArticle(id);
      setArticles((prev) => prev.map((a) => a.id === id ? { ...a, statut: data.statut } : a));
      if (detail?.id === id) setDetail((d) => ({ ...d, statut: data.statut }));
    } catch { /* ignore */ }
  };

  const imgSrc = (img) => {
    if (!img) return IMG_PH;
    return img.startsWith("http") ? img : BASE_URL + img;
  };

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Articles</h1>

      <div className="ad-toolbar" style={{ flexWrap: "wrap", gap: 8 }}>
        <div className="ad-search-wrap" style={{ flex: "1 1 200px" }}>
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="Nom, fournisseur…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={cat} onChange={(e) => setCat(e.target.value)}>
          {CATS.map((c) => <option key={c} value={c}>{c === "all" ? "Toutes catégories" : c}</option>)}
        </select>
        <select className="form-input" style={{ width: "auto" }} value={statutF} onChange={(e) => setStatutF(e.target.value)}>
          <option value="all">Tous statuts</option>
          <option value="actif">Actifs</option>
          <option value="suspendu">Suspendus</option>
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
                <tr>{["Photo","Nom","Fournisseur","Catégorie","Prix","Stock","Date","Statut","Actions"].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucun article</td></tr>
                ) : articles.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <img src={imgSrc(a.image)} alt={a.nom}
                        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-lt)" }}
                        onError={(e) => { e.target.onerror = null; e.target.src = IMG_PH; }} />
                    </td>
                    <td className="ad-td-bold">{a.nom}</td>
                    <td className="ad-td-muted">{a.fournisseur}</td>
                    <td>{a.categorie}</td>
                    <td className="ad-td-price">{Number(a.prix).toLocaleString()} dh</td>
                    <td style={{ color: a.stock < 5 ? "var(--color-red)" : undefined, fontWeight: a.stock < 5 ? 700 : 400 }}>{a.stock}</td>
                    <td className="ad-td-muted">{new Date(a.created_at).toLocaleDateString("fr-MA")}</td>
                    <td><span className={`badge ${a.statut === "actif" ? "badge-active" : "badge-blocked"}`}>{a.statut}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setDetail(a)}><Eye size={14} /></button>
                        <button className={`btn ${a.statut === "actif" ? "btn-danger" : "btn-outline"}`}
                          style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => handleToggle(a.id)}
                          title={a.statut === "actif" ? "Suspendre" : "Réactiver"}>
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
      )}

      {detail && (
        <div className="ad-overlay" onClick={() => setDetail(null)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h2 className="ad-modal-title">{detail.nom}</h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <img src={imgSrc(detail.image)} alt={detail.nom}
                style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-lt)" }}
                onError={(e) => { e.target.onerror = null; e.target.src = IMG_PH; }} />
            </div>
            {[
              ["Fournisseur", detail.fournisseur],
              ["Catégorie",  detail.categorie],
              ["Prix",       `${Number(detail.prix).toLocaleString()} dh`],
              ["Stock",      detail.stock],
              ["Ajouté le",  new Date(detail.created_at).toLocaleDateString("fr-MA")],
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
                onClick={() => { handleToggle(detail.id); setDetail(null); }}>
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
