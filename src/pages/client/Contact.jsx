import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader } from "lucide-react";
import api from "../../services/api";
import "./Contact.css";

const INFOS = [
  { icon: Mail,    label: "Email",     value: "contact@supplylink.ma" },
  { icon: Phone,   label: "Téléphone", value: "+212 6 00 00 00 00"    },
  { icon: MapPin,  label: "Adresse",   value: "Casablanca, Maroc"     },
];

const Contact = () => {
  const [form,    setForm]   = useState({ nom: "", email: "", sujet: "", message: "" });
  const [sent,    setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]  = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Vérification sujet (le select placeholder a value="")
    if (!form.sujet) {
      setError("Veuillez choisir un sujet.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/contact", form);
      setSent(true);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        // Erreurs de validation express-validator
        setError(data.errors.map((e) => e.msg).join(" — "));
      } else {
        setError(data?.message || "Une erreur est survenue. Réessayez.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 className="contact-title">Contactez-nous</h1>
        <p className="contact-sub">Notre équipe vous répond sous 24h ouvrées.</p>
      </div>

      <div className="contact-layout">
        {/* Infos */}
        <aside className="contact-aside">
          <div className="contact-info-card">
            <h2 className="contact-info-title">Nos coordonnées</h2>
            {INFOS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="contact-info-item">
                <div className="contact-info-icon"><Icon size={16} /></div>
                <div>
                  <span className="contact-info-label">{label}</span>
                  <span className="contact-info-value">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-hours-card">
            <h2 className="contact-info-title">Horaires d'assistance</h2>
            <div className="contact-hours-row"><span>Lundi – Vendredi</span><strong>9h – 18h</strong></div>
            <div className="contact-hours-row"><span>Samedi</span><strong>9h – 13h</strong></div>
            <div className="contact-hours-row"><span>Dimanche</span><strong>Fermé</strong></div>
          </div>
        </aside>

        {/* Formulaire */}
        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <CheckCircle size={48} strokeWidth={1.5} />
              <h3>Message envoyé !</h3>
              <p>Merci de nous avoir contactés. Nous vous répondrons dans les meilleurs délais.</p>
              <button className="btn btn-primary" onClick={() => { setSent(false); setForm({ nom: "", email: "", sujet: "", message: "" }); }}>
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={set("nom")}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sujet</label>
                <select className="form-input" value={form.sujet} onChange={set("sujet")} required>
                  <option value="" disabled>Choisissez un sujet</option>
                  <option>Problème de commande</option>
                  <option>Remboursement / retour</option>
                  <option>Question sur un article</option>
                  <option>Devenir fournisseur</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input contact-textarea"
                  placeholder="Décrivez votre demande..."
                  value={form.message}
                  onChange={set("message")}
                  rows={6}
                  required
                />
              </div>

              {error && <p className="contact-error">{error}</p>}

              <button type="submit" className="btn btn-primary contact-submit" disabled={loading}>
                {loading ? <Loader size={16} className="spin" /> : <Send size={16} />}
                {loading ? "Envoi en cours…" : "Envoyer le message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
