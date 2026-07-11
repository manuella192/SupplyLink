import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth, ROLES } from "../../contexts/AuthContext";
import "./auth.css";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState("");
  const [touched, setTouched] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const blur = (k) => setTouched((t) => ({ ...t, [k]: true }));

  const emailErr = touched.email && !form.email.includes("@")
    ? "Email invalide" : "";
  const passErr = touched.password && form.password.length < 6
    ? "Minimum 6 caractères" : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (emailErr || passErr || !form.email || !form.password) return;
    setError("");

    const res = await login(form.email, form.password);
    if (!res.success) { setError(res.message); return; }

    if (res.role === ROLES.ADMIN)       navigate("/admin");
    else if (res.role === ROLES.FOURNISSEUR) navigate("/fournisseur");
    else navigate("/");
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
        <div className="auth-card-header">
          <h1 className="auth-title">Bon retour</h1>
          <p className="auth-subtitle">Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="auth-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Adresse email</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input
                id="email" type="email" className={`form-input has-icon${emailErr ? " error" : ""}`}
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={() => blur("email")}
                autoComplete="email"
              />
            </div>
            {emailErr && <span className="form-error">{emailErr}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="password" type={show ? "text" : "password"}
                className={`form-input has-icon has-icon-right${passErr ? " error" : ""}`}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                onBlur={() => blur("password")}
                autoComplete="current-password"
              />
              <button type="button" className="input-icon-right" onClick={() => setShow(!show)}
                aria-label={show ? "Masquer" : "Afficher"}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passErr && <span className="form-error">{passErr}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Se connecter"}
          </button>
        </form>

        <p className="auth-switch">
          Pas encore de compte ?{" "}
          <Link to="/register" className="auth-link">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
