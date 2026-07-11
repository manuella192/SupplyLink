import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Truck, ChevronRight, ArrowLeft, CheckCircle } from "lucide-react";
import "./PanierPage.css";

// Mock panier initial
const MOCK_CART = [
  { id:3, name:"Table à manger avec 4 chaises", price:1899, image:"/assets/table.jpg", qty:1, category:"Mobilier" },
  { id:1, name:"Lampe de table de chevet",       price:248,  image:"/assets/lampe.jpg", qty:2, category:"Décoration" },
];

const STEPS = ["Panier", "Livraison", "Paiement", "Confirmation"];

const PanierPage = () => {
  const [cart, setCart]       = useState(MOCK_CART);
  const [step, setStep]       = useState(0);
  const [payment, setPayment] = useState("");
  const [address, setAddress] = useState({ nom:"", prenom:"", telephone:"", ville:"", adresse:"" });
  const [orderId]             = useState("SL-" + Math.floor(10000 + Math.random()*90000));

  const total   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const livraison = total > 2000 ? 0 : 50;

  const updateQty = (id, delta) =>
    setCart((c) => c.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const remove = (id) => setCart((c) => c.filter((i) => i.id !== id));

  // ── Confirmation ──
  if (step === 3) return (
    <div className="pn-confirm">
      <div className="pn-confirm-icon"><CheckCircle size={48} /></div>
      <h2>Commande confirmée !</h2>
      <p>Votre commande <strong>{orderId}</strong> a bien été enregistrée.<br />
        Un email de confirmation vous a été envoyé.</p>
      <div className="pn-confirm-detail">
        <span>Mode de paiement :</span>
        <strong>{payment === "stripe" ? "Carte bancaire (Stripe)" : "Cash à la livraison"}</strong>
      </div>
      <Link to="/" className="btn btn-primary btn-lg">Retour à l'accueil</Link>
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
            <h2 className="pn-section-title">Mon panier <span>({cart.length})</span></h2>

            {cart.length === 0 ? (
              <div className="pn-empty">
                <ShoppingCart size={48} />
                <p>Votre panier est vide.</p>
                <Link to="/catalogue" className="btn btn-primary">Découvrir nos articles</Link>
              </div>
            ) : cart.map((item) => (
              <div key={item.id} className="pn-item">
                <img src={item.image} alt={item.name} className="pn-item-img" />
                <div className="pn-item-info">
                  <span className="pn-item-cat">{item.category}</span>
                  <h4 className="pn-item-name">{item.name}</h4>
                  <span className="pn-item-price">{(item.price * item.qty).toLocaleString()} dh</span>
                </div>
                <div className="pn-item-actions">
                  <div className="pn-qty">
                    <button onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}><Minus size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                  </div>
                  <button className="pn-remove" onClick={() => remove(item.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="pn-summary">
              <h3>Résumé</h3>
              <div className="pn-summary-row"><span>Sous-total</span><span>{total.toLocaleString()} dh</span></div>
              <div className="pn-summary-row"><span>Livraison</span><span>{livraison === 0 ? "Gratuite" : `${livraison} dh`}</span></div>
              {livraison > 0 && <p className="pn-free-hint">Livraison gratuite dès 2 000 dh</p>}
              <div className="pn-summary-total"><span>Total</span><span>{(total + livraison).toLocaleString()} dh</span></div>
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
              { key:"prenom",    label:"Prénom",    placeholder:"Votre prénom" },
              { key:"nom",       label:"Nom",       placeholder:"Votre nom" },
              { key:"telephone", label:"Téléphone", placeholder:"0612 345 678" },
              { key:"ville",     label:"Ville",     placeholder:"Casablanca" },
              { key:"adresse",   label:"Adresse complète", placeholder:"Quartier, rue, numéro..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input
                  className="form-input"
                  placeholder={placeholder}
                  value={address[key]}
                  onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
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
            <label className={`pn-pay-card ${payment === "stripe" ? "selected" : ""}`}>
              <input type="radio" name="payment" value="stripe"
                checked={payment === "stripe"} onChange={() => setPayment("stripe")} />
              <div className="pn-pay-icon"><CreditCard size={22} /></div>
              <div>
                <span className="pn-pay-title">Carte bancaire (Stripe)</span>
                <span className="pn-pay-sub">Paiement sécurisé — Visa, Mastercard</span>
              </div>
            </label>

            <label className={`pn-pay-card ${payment === "cash" ? "selected" : ""}`}>
              <input type="radio" name="payment" value="cash"
                checked={payment === "cash"} onChange={() => setPayment("cash")} />
              <div className="pn-pay-icon"><Truck size={22} /></div>
              <div>
                <span className="pn-pay-title">Cash à la livraison</span>
                <span className="pn-pay-sub">Payez en espèces à réception</span>
              </div>
            </label>
          </div>

          {payment && (
            <div className="pn-order-recap">
              <div className="pn-summary-total"><span>Total à payer</span><span>{(total + livraison).toLocaleString()} dh</span></div>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg pn-cta"
            disabled={!payment}
            onClick={() => setStep(3)}
          >
            Confirmer la commande <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PanierPage;
