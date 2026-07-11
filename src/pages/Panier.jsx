import React, { useState } from "react";

const Panier = ({ cartItems, updateCartQuantity, removeCartItem, setSelectedProduct, setActiveTab }) => {
  // 1. Nouvel état pour gérer les étapes : 'cart' -> 'payment' -> 'success'
  const [step, setStep] = useState("cart");

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // 2. Affichage si commande réussie
  if (step === "success") {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <div style={{ fontSize: "60px", marginBottom: "20px" }}>✅</div>
        <h2 style={{ fontSize: "28px", color: "#333" }}>Commande validée avec succès !</h2>
        <p style={{ color: "#666", marginBottom: "30px" }}>Merci de votre confiance sur SupplyLink.</p>
        <button onClick={() => setActiveTab("home")} className="order-btn">Retour à l'accueil</button>
      </div>
    );
  }

  // 3. Affichage sélection mode de paiement amélioré
  if (step === "payment") {
    const paymentMethods = [
      { name: "Carte Bancaire", icon: "💳" },
      { name: "Paiement à la livraison", icon: "🚚" },
      { name: "Virement", icon: "🏦" }
    ];

    return (
      <div style={{ maxWidth: "450px", margin: "60px auto", padding: "40px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Mode de paiement</h2>
        <p style={{ color: "#666", marginBottom: "30px", fontSize: "14px" }}>Choisissez comment vous souhaitez régler votre commande.</p>
        
        {paymentMethods.map((method) => (
          <button 
            key={method.name} 
            onClick={() => setStep("success")} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "15px",
              width: "100%", 
              padding: "18px", 
              marginBottom: "12px", 
              border: "2px solid #f0f0f0", 
              borderRadius: "12px", 
              background: "#fff", 
              cursor: "pointer", 
              fontWeight: "600",
              fontSize: "16px",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#009fe3";
              e.currentTarget.style.backgroundColor = "#f0f9ff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#f0f0f0";
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            <span style={{ fontSize: "24px" }}>{method.icon}</span>
            {method.name}
          </button>
        ))}
        
        <button 
          onClick={() => setStep("cart")} 
          style={{ background: "none", border: "none", color: "#009fe3", marginTop: "20px", cursor: "pointer", fontWeight: "500" }}
        >
          ← Retour au panier
        </button>
      </div>
    );
  }

  // 4. Affichage normal du Panier
  return (
    <div className="cart-container" style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "24px", fontWeight: "700" }}>Mon Panier</h2>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p style={{ fontSize: "18px" }}>Votre panier est vide.</p>
          <button className="order-btn" onClick={() => setActiveTab("home")}>Découvrir nos articles</button>
        </div>
      ) : (
        <div className="cart-content-layout" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
          <div className="cart-items-list" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "20px", paddingBottom: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", alignItems: "center" }}>
                <img src={item.image} alt={item.name} onClick={() => setSelectedProduct(item)} style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }} />
                <div style={{ flex: 1 }}>
                  <h4 onClick={() => setSelectedProduct(item)} style={{ fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#333" }}>{item.name}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                    <span style={{ fontWeight: "700", color: "#009fe3" }}>{item.price} dh</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className="quantity-selector" style={{ margin: 0, height: "32px", display: "flex" }}>
                        <button onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                        <input type="text" value={item.quantity} readOnly style={{ width: "35px", textAlign: "center" }} />
                        <button onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                      </div>
                      <button onClick={() => removeCartItem(item.id)} style={{ color: "#ff4d4f" }}>🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-card" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", height: "fit-content" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Résumé</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span>Total TTC</span><span style={{ color: "#009fe3", fontWeight: "700" }}>{calculateTotal()} dh</span>
            </div>
            {/* Déclenche l'étape paiement */}
            <button className="order-btn" style={{ width: "100%" }} onClick={() => setStep("payment")}>
              Valider la commande
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panier;