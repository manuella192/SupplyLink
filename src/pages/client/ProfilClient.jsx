import React, { useState } from "react";
import { User, MapPin, Lock, ChevronRight, Save, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ProfilClient.css";

const VILLES = [
  "Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir",
  "Meknès","Oujda","Kenitra","Tétouan","Salé","El Jadida",
];

const ProfilClient = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState("menu");
  const [saved, setSaved] = useState(false);

  const [info, setInfo] = useState({
    prenom:   user?.prenom   || "",
    nom:      user?.nom      || "",
    email:    user?.email    || "",
    telephone:user?.telephone|| "",
    ville:    user?.ville    || "",
    quartier: user?.adresse?.quartier || "",
    rue:      user?.adresse?.rue      || "",
  });

  const [pwd, setPwd] = useState({ current:"", next:"", confirm:"" });

  const handleSaveInfo = (e) => {
    e.preventDefault();
    // TODO: appeler API PATCH /users/me
    setSaved(true);
    setTimeout(() => { setSaved(false); setSection("menu"); }, 1500);
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const MENU = [
    { key:"info",     icon:User,    title:"Mes informations",   sub:"Nom, email, téléphone" },
    { key:"adresse",  icon:MapPin,  title:"Adresse de livraison",sub:"Ville, quartier, rue" },
    { key:"security", icon:Lock,    title:"Sécurité",           sub:"Changer le mot de passe" },
  ];

  return (
    <div className="pc-wrap">
      {section !== "menu" && (
        <button className="pc-back" onClick={() => setSection("menu")}>
          ‹ Retour
        </button>
      )}

      {section === "menu" && (
        <div className="pc-menu-card">
          {/* Avatar + nom */}
          <div className="pc-avatar-block">
            <div className="pc-avatar">{(user?.prenom?.[0] || "U").toUpperCase()}</div>
            <div>
              <h2 className="pc-name">{user?.prenom} {user?.nom}</h2>
              <p className="pc-email">{user?.email}</p>
            </div>
          </div>

          {/* Menu */}
          <div className="pc-menu-list">
            {MENU.map(({ key, icon: Icon, title, sub }) => (
              <button key={key} className="pc-menu-item" onClick={() => setSection(key)}>
                <div className="pc-menu-icon"><Icon size={18} /></div>
                <div className="pc-menu-text">
                  <span className="pc-menu-title">{title}</span>
                  <span className="pc-menu-sub">{sub}</span>
                </div>
                <ChevronRight size={16} className="pc-menu-arrow" />
              </button>
            ))}
          </div>

          <button className="pc-logout" onClick={handleLogout}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      )}

      {/* ── Informations personnelles ── */}
      {section === "info" && (
        <div className="pc-form-card">
          <h2 className="pc-section-title">Mes informations</h2>
          <form onSubmit={handleSaveInfo} className="pc-form">
            <div className="pc-form-row">
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
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input className="form-input" value={info.telephone}
                onChange={(e) => setInfo({ ...info, telephone: e.target.value })} />
            </div>
            <button type="submit" className={`btn btn-primary pc-save-btn ${saved ? "saved" : ""}`}>
              <Save size={16} /> {saved ? "Enregistré !" : "Enregistrer"}
            </button>
          </form>
        </div>
      )}

      {/* ── Adresse ── */}
      {section === "adresse" && (
        <div className="pc-form-card">
          <h2 className="pc-section-title">Adresse de livraison</h2>
          <form onSubmit={handleSaveInfo} className="pc-form">
            <div className="form-group">
              <label className="form-label">Ville</label>
              <select className="form-input" value={info.ville}
                onChange={(e) => setInfo({ ...info, ville: e.target.value })}>
                <option value="">Sélectionner</option>
                {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="pc-form-row">
              <div className="form-group">
                <label className="form-label">Quartier</label>
                <input className="form-input" value={info.quartier}
                  onChange={(e) => setInfo({ ...info, quartier: e.target.value })}
                  placeholder="Ex: Maarif" />
              </div>
              <div className="form-group">
                <label className="form-label">Rue / N°</label>
                <input className="form-input" value={info.rue}
                  onChange={(e) => setInfo({ ...info, rue: e.target.value })}
                  placeholder="Ex: Rue Hassan II, 12" />
              </div>
            </div>
            <button type="submit" className={`btn btn-primary pc-save-btn ${saved ? "saved" : ""}`}>
              <Save size={16} /> {saved ? "Enregistré !" : "Enregistrer"}
            </button>
          </form>
        </div>
      )}

      {/* ── Sécurité ── */}
      {section === "security" && (
        <div className="pc-form-card">
          <h2 className="pc-section-title">Sécurité</h2>
          <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => { setSaved(false); setSection("menu"); }, 1500); }} className="pc-form">
            <div className="form-group">
              <label className="form-label">Mot de passe actuel</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Nouveau mot de passe</label>
              <input className="form-input" type="password" placeholder="Minimum 8 caractères"
                value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer</label>
              <input className="form-input" type="password" placeholder="Répéter le nouveau mot de passe"
                value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
            </div>
            <button type="submit" className={`btn btn-primary pc-save-btn ${saved ? "saved" : ""}`}
              disabled={!pwd.current || !pwd.next || pwd.next !== pwd.confirm}>
              <Save size={16} /> {saved ? "Mis à jour !" : "Mettre à jour"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilClient;
