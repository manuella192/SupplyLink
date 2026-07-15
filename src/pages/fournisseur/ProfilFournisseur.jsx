import React, { useState } from "react";
import { Building2, Lock, CreditCard, ChevronRight, Save, LogOut, CheckCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Fournisseur.css";

const VILLES = [
  "Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir",
  "Meknès","Oujda","Kenitra","Tétouan","Salé","El Jadida",
];

const ProfilFournisseur = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [section, setSection] = useState("menu");
  const [saved, setSaved]     = useState(false);

  const [info, setInfo] = useState({
    boutique:     user?.boutique     || "",
    description:  user?.description  || "",
    prenom:       user?.prenom       || "",
    nom:          user?.nom          || "",
    email:        user?.email        || "",
    telephone:    user?.telephone    || "",
    ville:        user?.ville        || "",
    adresse:      user?.adresse?.rue || "",
  });

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [rib, setRib] = useState({ iban: "", titulaire: "" });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => { setSaved(false); setSection("menu"); }, 1500);
  };

  const MENU = [
    { key: "boutique", icon: Building2,   title: "Ma boutique",        sub: "Nom, description, adresse" },
    { key: "security", icon: Lock,         title: "Sécurité",           sub: "Changer le mot de passe"    },
    { key: "paiements",icon: CreditCard,   title: "Paiements",          sub: "IBAN pour les virements"    },
  ];

  const SaveBtn = ({ label = "Enregistrer" }) => (
    <button type="submit" className={`btn btn-primary`} style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: "flex-start" }}>
      {saved ? <CheckCircle size={16} /> : <Save size={16} />}
      {saved ? "Enregistré !" : label}
    </button>
  );

  return (
    <div className="fn-page" style={{ maxWidth: 560 }}>

      {section !== "menu" && (
        <button className="btn btn-ghost" style={{ alignSelf: "flex-start" }} onClick={() => setSection("menu")}>
          ‹ Retour
        </button>
      )}

      {/* ── Menu ── */}
      {section === "menu" && (
        <div className="pc-menu-card" style={{ background: "#fff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          {/* Avatar boutique */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "28px 24px", borderBottom: "1px solid var(--color-border-lt)", background: "var(--color-bg)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--color-primary)", color: "#fff", fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {(user?.boutique?.[0] || user?.prenom?.[0] || "V").toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: "var(--color-text-1)" }}>{user?.boutique || `${user?.prenom} ${user?.nom}`}</h2>
              <p style={{ fontSize: 12, color: "var(--color-text-3)", marginTop: 2 }}>Vendeur · {user?.email}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {MENU.map(({ key, icon: Icon, title, sub }) => (
              <button key={key}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", border: "none", borderBottom: "1px solid var(--color-border-lt)", background: "#fff", cursor: "pointer", textAlign: "left", width: "100%" }}
                onClick={() => setSection(key)}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--color-primary-lt)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text-1)" }}>{title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-3)" }}>{sub}</div>
                </div>
                <ChevronRight size={16} style={{ color: "var(--color-text-4)" }} />
              </button>
            ))}
          </div>

          <button
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "16px 24px", border: "none", borderTop: "1px solid var(--color-border-lt)", background: "var(--color-red-lt)", color: "var(--color-red)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            onClick={() => { logout(); navigate("/login"); }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      )}

      {/* ── Boutique ── */}
      {section === "boutique" && (
        <div className="fn-form">
          <h1 className="fn-page-title">Ma boutique</h1>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Nom de la boutique *</label>
              <input className="form-input" required value={info.boutique}
                onChange={(e) => setInfo({ ...info, boutique: e.target.value })} placeholder="Ex: MeublexMaroc" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={info.description}
                onChange={(e) => setInfo({ ...info, description: e.target.value })}
                placeholder="Présentez votre boutique…" style={{ resize: "vertical" }} />
            </div>

            <div className="fn-form-row">
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input className="form-input" value={info.prenom}
                  onChange={(e) => setInfo({ ...info, prenom: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input className="form-input" value={info.nom}
                  onChange={(e) => setInfo({ ...info, nom: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input className="form-input" value={info.telephone}
                onChange={(e) => setInfo({ ...info, telephone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Ville</label>
              <select className="form-input" value={info.ville} onChange={(e) => setInfo({ ...info, ville: e.target.value })}>
                <option value="">Sélectionner</option>
                {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Adresse complète</label>
              <input className="form-input" value={info.adresse}
                onChange={(e) => setInfo({ ...info, adresse: e.target.value })} placeholder="Rue, numéro, quartier" />
            </div>
            <SaveBtn />
          </form>
        </div>
      )}

      {/* ── Sécurité ── */}
      {section === "security" && (
        <div className="fn-form">
          <h1 className="fn-page-title">Sécurité</h1>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { key: "current",  label: "Mot de passe actuel",       ph: "••••••••" },
              { key: "next",     label: "Nouveau mot de passe",      ph: "Minimum 8 caractères" },
              { key: "confirm",  label: "Confirmer le nouveau",      ph: "Répéter le nouveau mot de passe" },
            ].map(({ key, label, ph }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input className="form-input" type="password" placeholder={ph}
                  value={pwd[key]} onChange={(e) => setPwd({ ...pwd, [key]: e.target.value })} />
              </div>
            ))}
            <SaveBtn label="Mettre à jour" />
          </form>
        </div>
      )}

      {/* ── Paiements ── */}
      {section === "paiements" && (
        <div className="fn-form">
          <h1 className="fn-page-title">Paiements</h1>
          <p style={{ fontSize: 13, color: "var(--color-text-2)", marginTop: -6 }}>
            Les virements de vos ventes seront effectués sur ce compte bancaire.
          </p>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">IBAN / RIB</label>
              <input className="form-input" value={rib.iban} placeholder="MA64 0000 0000 0000 0000 0000 00"
                onChange={(e) => setRib({ ...rib, iban: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Titulaire du compte</label>
              <input className="form-input" value={rib.titulaire} placeholder="Prénom Nom"
                onChange={(e) => setRib({ ...rib, titulaire: e.target.value })} />
            </div>
            <SaveBtn label="Enregistrer le RIB" />
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilFournisseur;
