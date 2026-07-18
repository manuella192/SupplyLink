import React, { useState } from "react";
import { User, MapPin, Lock, LogOut, Save, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ProfilClient.css";

const VILLES = [
  "Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir",
  "Meknès","Oujda","Kenitra","Tétouan","Salé","El Jadida",
];

const fmtDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-MA", { year: "numeric", month: "long" });
};

const Alert = ({ type, msg }) => msg ? (
  <div className={`profil-alert ${type}`}>
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    {msg}
  </div>
) : null;

const ProfilClient = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState("info");
  const [saving,  setSaving]  = useState(false);
  const [alert,   setAlert]   = useState({ type: "", msg: "" });
  const [showPwd, setShowPwd] = useState({ cur: false, nxt: false, cfm: false });

  const [info, setInfo] = useState({
    prenom:    user?.prenom    || "",
    nom:       user?.nom       || "",
    telephone: user?.telephone || "",
  });

  const [addr, setAddr] = useState({
    ville:    user?.ville    || "",
    quartier: user?.quartier || "",
    rue:      user?.rue      || "",
  });

  const [pwd, setPwd] = useState({ current: "", newPwd: "", confirm: "" });

  const flash = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: "", msg: "" }), 4000);
  };

  const saveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch("/users/me", { ...info });
      updateUser(data);
      flash("success", "Informations mises à jour.");
    } catch (err) {
      flash("error", err.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally { setSaving(false); }
  };

  const saveAddr = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch("/users/me", { ...addr });
      updateUser(data);
      flash("success", "Adresse mise à jour.");
    } catch (err) {
      flash("error", err.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally { setSaving(false); }
  };

  const savePwd = async (e) => {
    e.preventDefault();
    if (pwd.newPwd !== pwd.confirm) return flash("error", "Les mots de passe ne correspondent pas.");
    setSaving(true);
    try {
      await api.patch("/users/me/password", { currentPassword: pwd.current, newPassword: pwd.newPwd });
      flash("success", "Mot de passe mis à jour.");
      setPwd({ current: "", newPwd: "", confirm: "" });
    } catch (err) {
      flash("error", err.response?.data?.message || "Mot de passe actuel incorrect.");
    } finally { setSaving(false); }
  };

  const NAV = [
    { key: "info",     icon: User,   label: "Informations",   desc: "Nom, email, téléphone"   },
    { key: "adresse",  icon: MapPin, label: "Adresse",        desc: "Ville, quartier, rue"     },
    { key: "security", icon: Lock,   label: "Sécurité",       desc: "Mot de passe"             },
  ];

  const pwdOk = pwd.newPwd.length >= 8;
  const pwdMatch = pwd.newPwd === pwd.confirm && pwd.confirm.length > 0;

  return (
    <div className="profil-page">

      {/* ── Sidebar ── */}
      <aside className="profil-sidebar">
        <div className="profil-sidebar-card">
          <div className="profil-sidebar-banner" />
          <div className="profil-sidebar-identity">
            <div className="profil-sidebar-avatar">
              {(user?.prenom?.[0] || "U").toUpperCase()}
            </div>
            <p className="profil-sidebar-name">{user?.prenom} {user?.nom}</p>
            <p className="profil-sidebar-email">{user?.email}</p>
            <span className="profil-role-badge">Client</span>
            {user?.created_at && (
              <p className="profil-since">Membre depuis {fmtDate(user.created_at)}</p>
            )}
          </div>

          <nav className="profil-nav">
            {NAV.map(({ key, icon: Icon, label, desc }) => (
              <button key={key} className={`profil-nav-item ${section === key ? "active" : ""}`}
                onClick={() => { setSection(key); setAlert({ type: "", msg: "" }); }}>
                <div className="profil-nav-icon"><Icon size={16} /></div>
                <div className="profil-nav-texts">
                  <span className="profil-nav-label">{label}</span>
                  <span className="profil-nav-desc">{desc}</span>
                </div>
              </button>
            ))}
          </nav>

          <button className="profil-logout-btn" onClick={() => { logout(); navigate("/login"); }}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Contenu ── */}
      <div className="profil-content">

        {/* ── Informations personnelles ── */}
        {section === "info" && (
          <>
            <div className="profil-section-header">
              <h1 className="profil-section-title">Informations personnelles</h1>
              <p className="profil-section-sub">Gérez votre identité et vos coordonnées.</p>
            </div>
            <div className="profil-card">
              <Alert type={alert.type} msg={alert.msg} />
              <form onSubmit={saveInfo} className="profil-form">
                <div className="profil-form-row">
                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <input className="form-input" value={info.prenom}
                      onChange={(e) => setInfo({ ...info, prenom: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input className="form-input" value={info.nom}
                      onChange={(e) => setInfo({ ...info, nom: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={user?.email || ""} disabled
                    style={{ opacity: .6, cursor: "not-allowed" }} />
                  <p className="profil-field-helper">L'adresse email ne peut pas être modifiée.</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input className="form-input" placeholder="+212 6XX XXX XXX" value={info.telephone}
                    onChange={(e) => setInfo({ ...info, telephone: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary profil-save-btn" disabled={saving}>
                  {saving ? "Enregistrement…" : <><Save size={15} /> Enregistrer</>}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── Adresse ── */}
        {section === "adresse" && (
          <>
            <div className="profil-section-header">
              <h1 className="profil-section-title">Adresse de livraison</h1>
              <p className="profil-section-sub">Utilisée par défaut lors de vos commandes.</p>
            </div>
            <div className="profil-card">
              <Alert type={alert.type} msg={alert.msg} />
              <form onSubmit={saveAddr} className="profil-form">
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <select className="form-input" value={addr.ville}
                    onChange={(e) => setAddr({ ...addr, ville: e.target.value })}>
                    <option value="">Sélectionner une ville</option>
                    {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="profil-form-row">
                  <div className="form-group">
                    <label className="form-label">Quartier</label>
                    <input className="form-input" placeholder="Ex : Maarif" value={addr.quartier}
                      onChange={(e) => setAddr({ ...addr, quartier: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rue / Numéro</label>
                    <input className="form-input" placeholder="Ex : Rue Hassan II, 12" value={addr.rue}
                      onChange={(e) => setAddr({ ...addr, rue: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary profil-save-btn" disabled={saving}>
                  {saving ? "Enregistrement…" : <><Save size={15} /> Enregistrer</>}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── Sécurité ── */}
        {section === "security" && (
          <>
            <div className="profil-section-header">
              <h1 className="profil-section-title">Sécurité</h1>
              <p className="profil-section-sub">Modifiez votre mot de passe de connexion.</p>
            </div>
            <div className="profil-card">
              <Alert type={alert.type} msg={alert.msg} />
              <form onSubmit={savePwd} className="profil-form">
                {[
                  { key: "current", label: "Mot de passe actuel",  field: "current", show: "cur" },
                  { key: "newPwd",  label: "Nouveau mot de passe", field: "newPwd",  show: "nxt" },
                  { key: "confirm", label: "Confirmer",            field: "confirm", show: "cfm" },
                ].map(({ key, label, field, show }) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <div style={{ position: "relative" }}>
                      <input className="form-input" style={{ paddingRight: 40 }}
                        type={showPwd[show] ? "text" : "password"} placeholder="••••••••"
                        value={pwd[field]}
                        onChange={(e) => setPwd({ ...pwd, [field]: e.target.value })} />
                      <button type="button" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-3)", padding: 0 }}
                        onClick={() => setShowPwd((s) => ({ ...s, [show]: !s[show] }))}>
                        {showPwd[show] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="profil-pwd-checks">
                  <div className={`profil-pwd-check ${pwdOk ? "ok" : "fail"}`}>
                    <CheckCircle size={12} /> Minimum 8 caractères
                  </div>
                  <div className={`profil-pwd-check ${pwdMatch ? "ok" : "fail"}`}>
                    <CheckCircle size={12} /> Les mots de passe correspondent
                  </div>
                </div>
                <button type="submit" className="btn btn-primary profil-save-btn"
                  disabled={saving || !pwd.current || !pwdOk || !pwdMatch}>
                  {saving ? "Mise à jour…" : <><Lock size={15} /> Mettre à jour</>}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilClient;
