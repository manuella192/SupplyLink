import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus, Plus, Trash2, ShoppingCart, CreditCard, Truck,
  ChevronRight, ArrowLeft, CheckCircle, Loader,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { createCommande } from "../../services/commandes.service";
import "./PanierPage.css";

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";
const IMG_PH   = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23f1f5f9' width='80' height='80' rx='8'/%3E%3C/svg%3E";

const STEPS = ["Panier", "Livraison", "Paiement", "Confirmation"];

const PanierPage = () => {
  const { items, count, updateQty, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]     = useState(0);
  const [payment, setPayment] = useState("");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [orderRef, setOrderRef] = useState("");

  const [address, setAddress] = useState({
    prenom:    user?.prenom    || "",
    nom:       user?.nom       || "",
    telephone: user?.telephone || "",
    ville:     user?.ville     || "",
    adresse:   "",
  });

  const total    = items.reduce((s, i) => s + i.price * i.qty, 0);
  const livraison = total >= 2000 ? 0 : 50;
  const grandTotal = total + livraison;

  const imgSrc = (img) => {
    if (!img) return IMG_PH;
    return img.startsWith("http") ? img : BASE_URL + img;
  };

  const handleConfirm = async () => {
    setError("");
    setSaving(true);
    try {
      const payload = {
        items: items.map((i) => ({ articleId: i.id, qty: i.qty })),
        adresse: address,
        modePaiement: payment,
      };
      const { data } = await createCommande(payload);
      setOrderRef(data.ref);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la commande. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  // ── Confirmation ──
  if (step === 3) return (
    <div className="pn-confirm">
      <div className="pn-confirm-icon"><CheckCircle size={56} /></div>
      <h2>Commande confirmée !</h2>
      <p>Votre commande <strong>{orderRef}</strong> a bien été enregistrée.<br />
        Un email de confirmation vous a été envoyé.</p>
      <div className="pn-confirm-detail">
        <span>Mode de paiement :</span>
        <strong>{payment === "stripe" ? "Carte bancaire (Stripe)" : "Cash à la livraison"}</strong>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="btn btn-outline" onClick={() => navigate("/commandes")}>Mes commandes</button>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    </div>
  );

  return (
    <div className="pn-page">
      {/* Étapes */}
      <div className="pn-steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`pn-step ${i <= step ? "active" : ""}`}>
              <span className="pn-step-num">{i + 1}</span>
              <span className="pn-step-label">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`pn-step-line ${i < step ? "done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Étape 0 : Panier ── */}
      {step === 0 && (
        <div className="pn-layout">
          <div className="pn-items">
            <h2 className="pn-section-title">Mon panier <span>({count})</span></h2>

            {items.length === 0 ? (
              <div className="pn-empty">
                <ShoppingCart size={48} />
                <p>Votre panier est vide.</p>
                <Link to="/catalogue" className="btn btn-primary">Découvrir nos articles</Link>
              </div>
            ) : items.map((item) => (
              <div key={item.id} className="pn-item">
                <img
                  src={imgSrc(item.image)}
                  alt={item.name}
                  className="pn-item-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = IMG_PH; }}
                />
                <div className="pn-item-info">
                  <span className="pn-item-cat">{item.category}</span>
                  <h4 className="pn-item-name">{item.name}</h4>
                  <span className="pn-item-price">{(item.price * item.qty).toLocaleString()} dh</span>
                </div>
                <div className="pn-item-actions">
                  <div className="pn-qty">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}><Minus size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                  </div>
                  <button className="pn-remove" onClick={() => removeItem(item.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="pn-summary">
              <h3>Résumé</h3>
              <div className="pn-summary-row"><span>Sous-total</span><span>{total.toLocaleString()} dh</span></div>
              <div className="pn-summary-row">
                <span>Livraison</span>
                <span style={{ color: livraison === 0 ? "var(--color-green)" : undefined }}>
                  {livraison === 0 ? "Gratuite" : `${livraison} dh`}
                </span>
              </div>
              {livraison > 0 && <p className="pn-free-hint">Livraison gratuite dès 2 000 dh</p>}
              <div className="pn-summary-total">
                <span>Total</span>
                <span>{grandTotal.toLocaleString()} dh</span>
              </div>
              <button className="btn btn-primary btn-lg pn-cta" onClick={() => setStep(1)}>
                Valider le panier <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Étape 1 : Livraison ── */}
      {step === 1 && (
        <div className="pn-form-wrap">
          <button className="pn-back" onClick={() => setStep(0)}><ArrowLeft size={16} /> Retour</button>
          <h2 className="pn-section-title">Adresse de livraison</h2>

          <div className="pn-form">
            {[
              { key: "prenom",    label: "Prénom",          ph: "Votre prénom" },
              { key: "nom",       label: "Nom",             ph: "Votre nom" },
              { key: "telephone", label: "Téléphone",       ph: "0612 345 678" },
              { key: "ville",     label: "Ville",           ph: "Casablanca" },
              { key: "adresse",   label: "Adresse complète",ph: "Rue, quartier, numéro…" },
            ].map(({ key, label, ph }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input
                  className="form-input"
                  placeholder={ph}
                  value={address[key]}
                  onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-lg pn-cta"
            onClick={() => setStep(2)}
            disabled={!address.prenom || !address.nom || !address.telephone || !address.ville || !address.adresse}
          >
            Choisir le paiement <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── Étape 2 : Paiement ── */}
      {step === 2 && (
        <div className="pn-form-wrap">
          <button className="pn-back" onClick={() => setStep(1)}><ArrowLeft size={16} /> Retour</button>
          <h2 className="pn-section-title">Mode de paiement</h2>

          <div className="pn-payment-options">
            <label className={`pn-pay-card ${payment === "cash" ? "selected" : ""}`}>
              <input type="radio" name="payment" value="cash"
                checked={payment === "cash"} onChange={() => setPayment("cash")} />
              <div className="pn-pay-icon"><Truck size={22} /></div>
              <div>
                <span className="pn-pay-title">Cash à la livraison</span>
                <span className="pn-pay-sub">Payez en espèces à réception du colis</span>
              </div>
            </label>

            <label className={`pn-pay-card ${payment === "stripe" ? "selected" : ""}`}>
              <input type="radio" name="payment" value="stripe"
                checked={payment === "stripe"} onChange={() => setPayment("stripe")} />
              <div className="pn-pay-icon"><CreditCard size={22} /></div>
              <div>
                <span className="pn-pay-title">Carte bancaire (Stripe)</span>
                <span className="pn-pay-sub">Paiement sécurisé — Visa, Mastercard, CMI</span>
              </div>
            </label>
          </div>

          {payment && (
            <div className="pn-order-recap">
              <div className="pn-summary-row"><span>Articles ({count})</span><span>{total.toLocaleString()} dh</span></div>
              <div className="pn-summary-row"><span>Livraison</span><span>{livraison === 0 ? "Gratuite" : `${livraison} dh`}</span></div>
              <div className="pn-summary-total" style={{ marginTop: 10 }}><span>Total à payer</span><span>{grandTotal.toLocaleString()} dh</span></div>
            </div>
          )}

          {error && <p style={{ color: "var(--color-red)", fontSize: 13, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", padding: "10px 14px" }}>{error}</p>}

          <button
            className="btn btn-primary btn-lg pn-cta"
            disabled={!payment || saving}
            onClick={handleConfirm}
          >
            {saving ? <Loader size={16} className="spin" /> : <CheckCircle size={16} />}
            {saving ? "Traitement en cours…" : "Confirmer la commande"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PanierPage;
