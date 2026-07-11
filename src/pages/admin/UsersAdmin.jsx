import React, { useState } from "react";
import { Search, UserCheck, UserX, Eye, X, Shield } from "lucide-react";
import "./admin.css";

const ROLES_LABEL = { client: "Client", fournisseur: "Fournisseur", admin: "Admin", livreur: "Livreur" };

const INITIAL_USERS = [
  { id: 1, prenom: "Hamza",  nom: "Berrada",  email: "hamza@example.com",  role: "client",      statut: "actif",  inscription: "01/03/2026", ville: "Casablanca" },
  { id: 2, prenom: "Sara",   nom: "Alaoui",   email: "sara@example.com",   role: "fournisseur", statut: "actif",  inscription: "12/02/2026", ville: "Rabat"      },
  { id: 3, prenom: "Youssef",nom: "Tazi",     email: "youssef@example.com",role: "client",      statut: "bloqué", inscription: "20/04/2026", ville: "Marrakech"  },
  { id: 4, prenom: "Nadia",  nom: "El Fassi", email: "nadia@example.com",  role: "livreur",     statut: "actif",  inscription: "08/05/2026", ville: "Fès"        },
  { id: 5, prenom: "Khalid", nom: "Mansouri", email: "khalid@example.com", role: "fournisseur", statut: "actif",  inscription: "15/01/2026", ville: "Tanger"     },
];

const UsersAdmin = () => {
  const [users, setUsers]   = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const match = `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(q);
    const r = roleFilter === "all" || u.role === roleFilter;
    return match && r;
  });

  const toggleStatut = (id) => {
    setUsers((prev) => prev.map((u) =>
      u.id === id ? { ...u, statut: u.statut === "actif" ? "bloqué" : "actif" } : u
    ));
    if (detail?.id === id) setDetail((d) => ({ ...d, statut: d.statut === "actif" ? "bloqué" : "actif" }));
  };

  return (
    <div className="ad-page">
      <h1 className="ad-page-title">Utilisateurs</h1>

      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={15} className="ad-search-icon" />
          <input className="form-input" placeholder="Rechercher un utilisateur…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: "auto" }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">Tous les rôles</option>
          {Object.entries(ROLES_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="ad-section">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>{["Nom","Email","Rôle","Ville","Inscription","Statut","Actions"].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-3)" }}>Aucun utilisateur trouvé</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id}>
                  <td className="ad-td-bold">{u.prenom} {u.nom}</td>
                  <td className="ad-td-muted">{u.email}</td>
                  <td><span className={`badge ${u.role === "admin" ? "badge-process" : u.role === "fournisseur" ? "badge-shipped" : u.role === "livreur" ? "badge-active" : "badge-pending"}`}>{ROLES_LABEL[u.role]}</span></td>
                  <td className="ad-td-muted">{u.ville}</td>
                  <td className="ad-td-muted">{u.inscription}</td>
                  <td><span className={`badge ${u.statut === "actif" ? "badge-active" : "badge-blocked"}`}>{u.statut}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setDetail(u)} title="Voir détail">
                        <Eye size={14} />
                      </button>
                      <button
                        className={`btn ${u.statut === "actif" ? "btn-danger" : "btn-outline"}`}
                        style={{ padding: "5px 10px", fontSize: 12 }}
                        onClick={() => toggleStatut(u.id)}
                        title={u.statut === "actif" ? "Bloquer" : "Débloquer"}>
                        {u.statut === "actif" ? <UserX size={14} /> : <UserCheck size={14} />}
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
              <h2 className="ad-modal-title">
                <Shield size={16} style={{ display: "inline", marginRight: 6, color: "var(--color-primary)" }} />
                {detail.prenom} {detail.nom}
              </h2>
              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setDetail(null)}><X size={16} /></button>
            </div>

            {[
              ["Email",       detail.email],
              ["Rôle",        ROLES_LABEL[detail.role]],
              ["Ville",       detail.ville],
              ["Inscription", detail.inscription],
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
                onClick={() => { toggleStatut(detail.id); setDetail(null); }}>
                {detail.statut === "actif" ? "Bloquer" : "Débloquer"} l'utilisateur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
