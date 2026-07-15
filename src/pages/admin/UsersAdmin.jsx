import React, { useState, useEffect, useCallback } from "react";
import { Search, UserCheck, UserX, Eye, X, Shield, Plus, Loader, CheckCircle, Truck } from "lucide-react";
import { getUsers, toggleUser, createFournisseurUser, createLivreurUser } from "../../services/commandes.service";
import "./admin.css";

const ROLES_LABEL = { client: "Client", fournisseur: "Fournisseur", admin: "Admin", livreur: "Livreur" };
const ROLE_BADGE  = { client: "badge-pending", fournisseur: "badge-shipped", admin: "badge-process", livreur: "badge-active" };

const EMPTY_FORM = { prenom: "", nom: "", email: "", telephone: "", ville: "", boutique: "", password: "" };

const CREATE_CONFIG = {
  fournisseur: { label: "fournisseur", title: "Créer un compte fournisseur", okMsg: "Fournisseur créé !", apiFn: createFournisseurUser, hasBoutique: true  },
  livreur:     { label: "livreur",     title: "Créer un compte livreur",     okMsg: "Livreur créé !",     apiFn: createLivreurUser,     hasBoutique: false },
};

const VILLES = ["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Meknès","Oujda","Kenitra","Tétouan","Salé","El Jadida"];

const UsersAdmin = () => {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [detail,     setDetail]     = useState(null);
  const [showCreate, setShowCreate] = useState(null); // null | 'fournisseur' | 'livreur'
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [createErr,  setCreateErr]  = useState("");
  const [createOk,   setCreateOk]   = useState(false);

  const load = useCallback(async () => {
    try {
      const params = {};
      if (roleFilter !== "all") params.role = roleFilter;
      if (search.trim())        params.q    = search.trim();
      const { data } = await getUsers(params);
      setUsers(data);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, [roleFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleUser(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, statut: data.statut } : u));
      if (detail?.id === id) setDetail((d) => ({ ...d, statut: data.statut }));
    } catch { /* ignore */ }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const openCreate = (type) => { setShowCreate(type); setCreateErr(""); setCreateOk(false); setForm(EMPTY_FORM); };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateErr("");
    setSaving(true);
    const cfg = CREATE_CONFIG[showCreate];
    try {
      await cfg.apiFn(form);
      setCreateOk(true);
      setForm(EMPTY_FORM);
      await load();
      setTimeout(() => { setCreateOk(false); setShowCreate(null); }, 1600);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) setCreateErr(data.errors.map((e) => e.msg).join(" — "));
      else setCreateErr(data?.message || "Erreur lors de la création");
    } finally { setSaving(false); }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return `${u.prenom || ""} ${u.nom || ""} ${u.email || ""}`.toLowerCase().includes(q);
  });

  const primaryRole = (roles) => {
    if (!roles) return "client";
    const arr = roles.split(",");
    for (const r of ["admin","fournisseur","livreur","client"]) if (arr.includes(r)) return r;
    return arr[0] || "client";
  };

  return (
    <div className="ad-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 className="ad-page-title">Utilisateurs</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => openCreate("fournisseur")}>
            <Plus size={15} /> Fournisseur
          </button>
          <button className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => openCreate("livreur")}>
            <Truck size={15} /> Livreur
          </button>
        </div>
      </div>

      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="Rechercher…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">Tous les rôles</option>
          {Object.entries(ROLES_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
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
                <tr>{["Nom","Email","Rôle","Ville","Inscription","Statut","Actions"].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucun utilisateur</td></tr>
                ) : filtered.map((u) => {
                  const role = primaryRole(u.roles);
                  return (
                    <tr key={u.id}>
                      <td className="ad-td-bold">{u.prenom} {u.nom}</td>
                      <td className="ad-td-muted">{u.email}</td>
                      <td><span className={`badge ${ROLE_BADGE[role] || "badge-pending"}`}>{ROLES_LABEL[role] || role}</span></td>
                      <td className="ad-td-muted">{u.ville || "—"}</td>
                      <td className="ad-td-muted">{new Date(u.created_at).toLocaleDateString("fr-MA")}</td>
                      <td><span className={`badge ${u.statut === "actif" ? "badge-active" : "badge-blocked"}`}>{u.statut}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setDetail({ ...u, role })} title="Détail">
                            <Eye size={14} />
                          </button>
                          <button
                            className={`btn ${u.statut === "actif" ? "btn-danger" : "btn-outline"}`}
                            style={{ padding: "5px 10px", fontSize: 12 }}
                            onClick={() => handleToggle(u.id)}
                            title={u.statut === "actif" ? "Bloquer" : "Débloquer"}>
                            {u.statut === "actif" ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
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

      {/* ── Détail utilisateur ── */}
      {detail && (
        <div className="ad-overlay" onClick={() => setDetail(null)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h2 className="ad-modal-title">
                <Shield size={16} style={{ display: "inline", marginRight: 6, color: "var(--color-primary)" }} />
                {detail.prenom} {detail.nom}
              </h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>
            {[
              ["Email",       detail.email],
              ["Rôle",        ROLES_LABEL[detail.role] || detail.role],
              ["Ville",       detail.ville || "—"],
              ["Téléphone",   detail.telephone || "—"],
              ["Inscription", new Date(detail.created_at).toLocaleDateString("fr-MA")],
              ["Statut",      detail.statut],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--color-border-lt)" }}>
                <span style={{ minWidth: 100, fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-1)" }}>{v}</span>
              </div>
            ))}
            <div className="ad-modal-actions">
              <button className="btn btn-outline" onClick={() => setDetail(null)}>Fermer</button>
              <button className={`btn ${detail.statut === "actif" ? "btn-danger" : "btn-primary"}`}
                onClick={() => { handleToggle(detail.id); setDetail(null); }}>
                {detail.statut === "actif" ? "Bloquer" : "Débloquer"} l'utilisateur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Créer utilisateur (fournisseur ou livreur) ── */}
      {showCreate && (() => {
        const cfg = CREATE_CONFIG[showCreate];
        return (
          <div className="ad-overlay">
            <div className="ad-modal" style={{ maxWidth: 500 }}>
              <div className="ad-modal-head">
                <h2 className="ad-modal-title">{cfg.title}</h2>
                <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setShowCreate(null)}><X size={16} /></button>
              </div>

              {createOk ? (
                <div style={{ textAlign: "center", padding: "32px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <CheckCircle size={44} style={{ color: "var(--color-green)" }} />
                  <p style={{ fontWeight: 700, fontSize: 16 }}>{cfg.okMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[
                      { key: "prenom", label: "Prénom *", ph: "Mohamed" },
                      { key: "nom",    label: "Nom *",    ph: "Alaoui" },
                    ].map(({ key, label, ph }) => (
                      <div className="form-group" key={key}>
                        <label className="form-label">{label}</label>
                        <input className="form-input" placeholder={ph} required value={form[key]} onChange={f(key)} />
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="email@exemple.com" required value={form.email} onChange={f("email")} />
                  </div>
                  {cfg.hasBoutique && (
                    <div className="form-group">
                      <label className="form-label">Nom de boutique</label>
                      <input className="form-input" placeholder="Ex: MeublexMaroc" value={form.boutique} onChange={f("boutique")} />
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Téléphone</label>
                      <input className="form-input" placeholder="0612345678" value={form.telephone} onChange={f("telephone")} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ville</label>
                      <select className="form-input" value={form.ville} onChange={f("ville")}>
                        <option value="">Sélectionner</option>
                        {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mot de passe temporaire *</label>
                    <input className="form-input" type="password" placeholder="Min. 8 caractères" required value={form.password} onChange={f("password")} />
                  </div>

                  {createErr && (
                    <p style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", padding: "10px 14px" }}>
                      {createErr}
                    </p>
                  )}

                  <div className="ad-modal-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setShowCreate(null)}>Annuler</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {saving ? <Loader size={14} className="spin" /> : <Plus size={14} />}
                      {saving ? "Création…" : "Créer le compte"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default UsersAdmin;
