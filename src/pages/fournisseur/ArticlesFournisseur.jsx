import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, Search, Edit2, Trash2, UploadCloud, X,
  Package, CheckCircle, AlertTriangle, Loader
} from "lucide-react";
import { getMyArticles, createArticle, updateArticle, deleteArticle } from "../../services/articles.service";
import "./Fournisseur.css";

const CATEGORIES = ["Mobilier", "Électroménager", "Décoration", "Literie", "Cuisine"];
const EMPTY_FORM  = { nom: "", prix: "", stock: "", categorie: "", description: "" };

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";
const IMG_PH   = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='90'%3E%3Crect fill='%23f1f5f9' width='120' height='90' rx='6'/%3E%3Ctext x='60' y='52' font-family='sans-serif' font-size='11' fill='%23cbd5e1' text-anchor='middle'%3EAucune photo%3C/text%3E%3C/svg%3E";

const ArticlesFournisseur = () => {
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [view, setView]           = useState("list");
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editId, setEditId]       = useState(null);
  const [search, setSearch]       = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saved, setSaved]         = useState(false);
  const [preview, setPreview]     = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileRef                   = useRef();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getMyArticles();
      setArticles(data);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = articles.filter((a) =>
    a.nom.toLowerCase().includes(search.toLowerCase()) ||
    a.categorie.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(EMPTY_FORM); setPreview(null); setImageFile(null); setEditId(null); setView("add"); };
  const openEdit = (a) => {
    setForm({ nom: a.nom, prix: a.prix, stock: a.stock, categorie: a.categorie, description: a.description || "" });
    setPreview(a.image ? BASE_URL + a.image : null);
    setImageFile(null);
    setEditId(a.id);
    setView("edit");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      if (view === "add") { await createArticle(fd); }
      else                { await updateArticle(editId, fd); }
      setSaved(true);
      await load();
      setTimeout(() => { setSaved(false); setView("list"); }, 1400);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try {
      await deleteArticle(deleteTarget);
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget));
    } catch { /* ignore */ }
    setDeleteTarget(null);
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
      <Loader size={28} className="spin" style={{ color: "var(--color-primary)" }} />
    </div>
  );

  return (
    <div className="fn-page">

      {view === "list" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <h1 className="fn-page-title">Mes articles</h1>
            <button className="btn btn-primary" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={16} /> Ajouter
            </button>
          </div>

          <div style={{ position: "relative", maxWidth: 320 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-3)" }} />
            <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Rechercher…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-text-3)" }}>
              <Package size={40} strokeWidth={1.2} />
              <p style={{ marginTop: 12, fontWeight: 600 }}>Aucun article</p>
            </div>
          ) : (
            <div className="fn-articles-grid">
              {filtered.map((a) => (
                <div key={a.id} className="fn-article-card">
                  <img
                    className="fn-article-img"
                    src={a.image ? BASE_URL + a.image : IMG_PH}
                    alt={a.nom}
                    onError={(e) => { e.target.onerror = null; e.target.src = IMG_PH; }}
                  />
                  <div className="fn-article-body">
                    <span className="fn-article-cat">{a.categorie}</span>
                    <span className="fn-article-name">{a.nom}</span>
                    <span className="fn-article-price">{Number(a.prix).toLocaleString()} dh</span>
                    <div className="fn-article-meta">
                      <Package size={12} />
                      <span>Stock : {a.stock}</span>
                      {a.stock < 5 && (
                        <span style={{ color: "var(--color-red)", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                          <AlertTriangle size={11} /> Faible
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="fn-article-footer">
                    <button className="btn btn-outline" style={{ padding: "6px 12px" }} onClick={() => openEdit(a)}><Edit2 size={13} /></button>
                    <button className="btn btn-danger"  style={{ padding: "6px 12px" }} onClick={() => setDeleteTarget(a.id)}><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {(view === "add" || view === "edit") && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button className="btn btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setView("list")}>
              <X size={16} />
            </button>
            <h1 className="fn-page-title">{view === "add" ? "Ajouter un article" : "Modifier l'article"}</h1>
          </div>

          {saved ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "60px 0", textAlign: "center" }}>
              <CheckCircle size={48} style={{ color: "var(--color-green)" }} />
              <p style={{ fontWeight: 700, fontSize: 18 }}>{view === "add" ? "Article ajouté !" : "Article mis à jour !"}</p>
            </div>
          ) : (
            <form className="fn-form" onSubmit={handleSubmit}>
              <div>
                <label className="form-label">Photo</label>
                <div className="fn-file-upload" onClick={() => fileRef.current.click()} role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileRef.current.click()}>
                  {preview ? (
                    <img src={preview} alt="Aperçu" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                  ) : (
                    <><UploadCloud size={28} /><span>Cliquer pour télécharger</span><small>JPG, PNG, WebP — max 2 Mo</small></>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
              </div>

              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input className="form-input" required value={form.nom} onChange={f("nom")} />
              </div>
              <div className="fn-form-row">
                <div className="form-group">
                  <label className="form-label">Prix (dh) *</label>
                  <input className="form-input" type="number" min="0" step="0.01" required value={form.prix} onChange={f("prix")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-input" type="number" min="0" required value={form.stock} onChange={f("stock")} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Catégorie *</label>
                <select className="form-input" required value={form.categorie} onChange={f("categorie")}>
                  <option value="">Sélectionner</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={f("description")} style={{ resize: "vertical" }} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}
                style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8 }}>
                {saving ? <Loader size={15} className="spin" /> : <CheckCircle size={16} />}
                {view === "add" ? "Publier" : "Enregistrer"}
              </button>
            </form>
          )}
        </>
      )}

      {deleteTarget !== null && (
        <div className="fn-promo-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="fn-promo-modal" onClick={(e) => e.stopPropagation()}>
            <Trash2 size={36} style={{ color: "var(--color-red)", margin: "0 auto" }} />
            <h2>Supprimer cet article ?</h2>
            <p>Cette action est irréversible.</p>
            <div className="fn-promo-modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesFournisseur;
