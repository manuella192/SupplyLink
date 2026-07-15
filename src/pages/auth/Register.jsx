import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import "./auth.css";

const VILLES = [
  "Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Meknès",
  "Oujda","Kenitra","Tétouan","Salé","Mohammedia","El Jadida","Béni Mellal","Nador",
];

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    prenom: "", nom: "", email: "", telephone: "",
    ville: "", quartier: "", rue: "",
    password: "", confirm: "",
  });
  const [show, setShow]       = useState({ pwd: false, conf: false });
  const [error, setError]     = useState("");
  const [touched, setTouched] = useState({});
  const [step, setStep]       = useState(1); // 1 = infos, 2 = adresse & mdp

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const blur = (k) => setTouched((t) => ({ ...t, [k]: true }));

  const validators = {
    prenom:    (v) => v.trim().length < 2 ? "Prénom trop court" : "",
    nom:       (v) => v.trim().length < 2 ? "Nom trop court" : "",
    email:     (v) => !v.includes("@") ? "Email invalide" : "",
    telephone: (v) => !/^(\+212|0)[5-7]\d{8}$/.test(v.replace(/\s/g,"")) ? "Numéro invalide (ex: 0612345678)" : "",
    ville:     (v) => !v ? "Sélectionnez une ville" : "",
    password:  (v) => v.length < 8 ? "Minimum 8 caractères" : "",
    confirm:   (v) => v !== form.password ? "Les mots de passe ne correspondent pas" : "",
  };

  const getErr = (k) => touched[k] ? validators[k]?.(form[k]) || "" : "";

  const step1Valid = ["prenom","nom","email","telephone"].every((k) => !validators[k](form[k]));
  const step2Valid = ["ville","password","confirm"].every((k) => !validators[k](form[k]));

  const nextStep = () => {
    setTouched({ prenom:true, nom:true, email:true, telephone:true });
    if (step1Valid) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
    if (!step1Valid || !step2Valid) return;
    setError("");

    const payload = {
      prenom: form.prenom.trim(),
      nom:    form.nom.trim(),
      email:  form.email.trim().toLowerCase(),
      telephone: form.telephone.trim(),
      ville:  form.ville,
      adresse: { quartier: form.quartier.trim(), rue: form.rue.trim() },
      password: form.password,
    };

    const res = await register(payload);
    if (!res.success) { setError(res.message); return; }
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none"
          stroke="#009fe3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span className="auth-brand-name">SupplyLink</span>
      </div>

      <div className="auth-card">
        {/* Indicateur d'étape */}
        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? "active" : ""}`}><span>1</span> Vos informations</div>
          <div className="auth-step-sep" />
          <div className={`auth-step ${step >= 2 ? "active" : ""}`}><span>2</span> Adresse & sécurité</div>
        </div>

        <div className="auth-card-header">
          <h1 className="auth-title">{step === 1 ? "Créer un compte" : "Adresse & mot de passe"}</h1>
          <p className="auth-subtitle">
            {step === 1 ? "Rejoignez la communauté SupplyLink" : "Dernière étape !"}
          </p>
        </div>

        {error && (
          <div className="auth-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit}
          noValidate className="auth-form">

          {step === 1 && (
            <>
              <div className="auth-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="prenom">Prénom</label>
                  <div className="input-icon-wrap">
                    <User size={16} className="input-icon" />
                    <input id="prenom" type="text" className={`form-input has-icon${getErr("prenom") ? " error" : ""}`}
                      placeholder="Prénom" value={form.prenom}
                      onChange={(e) => set("prenom", e.target.value)} onBlur={() => blur("prenom")} />
                  </div>
                  {getErr("prenom") && <span className="form-error">{getErr("prenom")}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="nom">Nom</label>
                  <div className="input-icon-wrap">
                    <User size={16} className="input-icon" />
                    <input id="nom" type="text" className={`form-input has-icon${getErr("nom") ? " error" : ""}`}
                      placeholder="Nom de famille" value={form.nom}
                      onChange={(e) => set("nom", e.target.value)} onBlur={() => blur("nom")} />
                  </div>
                  {getErr("nom") && <span className="form-error">{getErr("nom")}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="r-email">Email</label>
                <div className="input-icon-wrap">
                  <Mail size={16} className="input-icon" />
                  <input id="r-email" type="email" className={`form-input has-icon${getErr("email") ? " error" : ""}`}
                    placeholder="vous@exemple.com" value={form.email}
                    onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")}
                    autoComplete="email" />
                </div>
                {getErr("email") && <span className="form-error">{getErr("email")}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="telephone">Téléphone</label>
                <div className="input-icon-wrap">
                  <Phone size={16} className="input-icon" />
                  <input id="telephone" type="tel" className={`form-input has-icon${getErr("telephone") ? " error" : ""}`}
                    placeholder="0612 345 678" value={form.telephone}
                    onChange={(e) => set("telephone", e.target.value)} onBlur={() => blur("telephone")} />
                </div>
                {getErr("telephone") && <span className="form-error">{getErr("telephone")}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit">
                Continuer
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="ville">Ville</label>
                <div className="input-icon-wrap">
                  <MapPin size={16} className="input-icon" />
                  <select id="ville" className={`form-input has-icon${getErr("ville") ? " error" : ""}`}
                    value={form.ville} onChange={(e) => set("ville", e.target.value)}
                    onBlur={() => blur("ville")}>
                    <option value="">Sélectionner une ville</option>
                    {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                {getErr("ville") && <span className="form-error">{getErr("ville")}</span>}
              </div>

              <div className="auth-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="quartier">Quartier</label>
                  <input id="quartier" type="text" className="form-input"
                    placeholder="Ex: Maarif" value={form.quartier}
                    onChange={(e) => set("quartier", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="rue">Rue / N°</label>
                  <input id="rue" type="text" className="form-input"
                    placeholder="Ex: Rue Hassan II, 12" value={form.rue}
                    onChange={(e) => set("rue", e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="r-pwd">Mot de passe</label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input id="r-pwd" type={show.pwd ? "text" : "password"}
                    className={`form-input has-icon has-icon-right${getErr("password") ? " error" : ""}`}
                    placeholder="Minimum 8 caractères" value={form.password}
                    onChange={(e) => set("password", e.target.value)} onBlur={() => blur("password")} />
                  <button type="button" className="input-icon-right"
                    onClick={() => setShow((s) => ({ ...s, pwd: !s.pwd }))}>
                    {show.pwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {getErr("password") && <span className="form-error">{getErr("password")}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="r-conf">Confirmer le mot de passe</label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input id="r-conf" type={show.conf ? "text" : "password"}
                    className={`form-input has-icon has-icon-right${getErr("confirm") ? " error" : ""}`}
                    placeholder="Répétez votre mot de passe" value={form.confirm}
                    onChange={(e) => set("confirm", e.target.value)} onBlur={() => blur("confirm")} />
                  <button type="button" className="input-icon-right"
                    onClick={() => setShow((s) => ({ ...s, conf: !s.conf }))}>
                    {show.conf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {getErr("confirm") && <span className="form-error">{getErr("confirm")}</span>}
              </div>

              <div className="auth-back-row">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>
                  Retour
                </button>
                <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : "Créer mon compte"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="auth-switch">
          Déjà un compte ?{" "}
          <Link to="/login" className="auth-link">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
