import React, { useState } from "react";

const Profil = ({ setNotification }) => {
  const [activeProfileSection, setActiveProfileSection] = useState("menu"); 
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: "Amine El Amrani",
    company: "Mobilia Design Maroc",
    email: "fournisseur.mobilia@supplylink.ma",
    phone: "+212 612-345678",
    city: "Casablanca"
  });

  const mockOrders = [
    { id: "SL-9482", date: "12/06/2026", total: "2000 dh", status: "Livré", items: ["Armoire en Bois Noir"] },
    { id: "SL-8311", date: "28/05/2026", total: "1600 dh", status: "En cours", items: ["Canapé Droit Confort"] }
  ];

  const mockPayments = [
    { id: 1, type: "Visa", last4: "4321", expiry: "09/29", provider: "Attijariwafa Bank" },
    { id: 2, type: "Virement", label: "Compte principal CIH Bank", active: true }
  ];

  const mockPromotions = [
    { id: 1, title: "Soldes d'été", discount: "-15%", status: "Actif", period: "Jusqu'au 31/07/2026" },
    { id: 2, title: "Offre Flash Salon", discount: "-20%", status: "Expiré", period: "Terminé le 15/06/2026" }
  ];

  return (
    <div style={{ 
      padding: "40px 20px", 
      width: "100%", 
      boxSizing: "border-box",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      <div style={{ 
        maxWidth: "1450px", 
        margin: "0 auto",
        backgroundColor: "#fff", 
        borderRadius: "24px", 
        boxShadow: "0 10px 40px rgba(0,0,0,0.07)", 
        overflow: "hidden",
        display: "flex",
        minHeight: "800px"
      }}>
        
        {/* ==================== SIDEBAR GAUCHE ==================== */}
        <div style={{ 
          width: "380px", 
          borderRight: "1px solid #f0f0f2", 
          padding: "40px 28px",
          backgroundColor: "#fafbfc"
        }}>
          
          {/* En-tête Profil */}
          <div style={{ textAlign: "center", marginBottom: "45px" }}>
            <div style={{ 
              width: "115px", 
              height: "115px", 
              borderRadius: "50%", 
              backgroundColor: "#f4f4f6", 
              border: "5px solid #009fe3", 
              margin: "0 auto 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "50px"
            }}>
              👤
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 6px 0" }}>{profileData.company}</h3>
            <p style={{ fontSize: "14px", color: "#666" }}>{profileData.email}</p>
          </div>

          {/* Menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <MenuItem 
              icon="🕒" color="#009fe3"
              title="Mon activité"
              subtitle="Suivi de vos ventes, statistiques et historiques de publications"
              onClick={() => { setActiveProfileSection("activity"); setSelectedOrder(null); }}
            />
            <MenuItem 
              icon="🔖" color="#2ec4b6"
              title="Mes informations"
              subtitle="Modifier le nom de l'entreprise, adresse de l'entrepôt, contact"
              onClick={() => setActiveProfileSection("info")}
            />
            <MenuItem 
              icon="🏷️" color="#ff4d4d"
              title="Promotions & Campagnes"
              subtitle="Créer des réductions, mettre en avant vos articles et gérer les offres"
              onClick={() => setActiveProfileSection("promotions")}
            />
            <MenuItem 
              icon="💳" color="#f1c40f"
              title="Méthode de paiement"
              subtitle="Gérer vos coordonnées bancaires pour recevoir vos virements"
              onClick={() => setActiveProfileSection("payments")}
            />
            <MenuItem 
              icon="⚙️" color="#7b2cbf"
              title="Paramètres de la boutique"
              subtitle="Devises, notifications push, alertes de stock bas"
              onClick={() => setActiveProfileSection("shop_settings")}
            />
            <MenuItem 
              icon="🛡️" color="#1abc9c"
              title="Sécurité & Confidentialité"
              subtitle="Changer votre mot de passe et gérer l'authentification"
              onClick={() => setActiveProfileSection("security")}
            />
          </div>

          {/* Déconnexion */}
          <button 
            type="button"
            onClick={() => alert("Déconnexion réussie !")}
            style={logoutButtonStyle}
          >
            Déconnexion
          </button>
        </div>

        {/* ==================== ZONE CONTENU DROITE (zone entourée) ==================== */}
        <div style={{ flex: 1, padding: "50px 60px", overflowY: "auto" }}>
          
          {activeProfileSection === "activity" && <ActivityContent mockOrders={mockOrders} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />}
          
          {activeProfileSection === "info" && <InfoContent profileData={profileData} setProfileData={setProfileData} setNotification={setNotification} setActiveProfileSection={setActiveProfileSection} />}
          
          {activeProfileSection === "promotions" && <PromotionsContent mockPromotions={mockPromotions} />}
          
          {activeProfileSection === "payments" && <PaymentsContent mockPayments={mockPayments} />}
          
          {activeProfileSection === "shop_settings" && <ShopSettingsContent />}
          
          {activeProfileSection === "security" && <SecurityContent setNotification={setNotification} setActiveProfileSection={setActiveProfileSection} />}
        </div>
      </div>
    </div>
  );
};

/* ====================== Composants de contenu ====================== */

const MenuItem = ({ icon, color, title, subtitle, onClick }) => (
  <button onClick={onClick} style={menuItemStyle}>
    <div style={{ ...iconWrapperStyle, backgroundColor: "#f8f9fa", color }}>{icon}</div>
    <div style={{ flex: 1, textAlign: "left" }}>
      <h4 style={itemTitleStyle}>{title}</h4>
      <p style={itemSubStyle}>{subtitle}</p>
    </div>
    <span style={arrowStyle}>›</span>
  </button>
);

const ActivityContent = ({ mockOrders, selectedOrder, setSelectedOrder }) => (
  <div>
    <h2 style={{ marginBottom: "30px", fontSize: "26px", color: "#1a1a1a" }}>Mon Activité & Ventes</h2>
    {!selectedOrder ? (
      mockOrders.map((order) => (
        <div key={order.id} onClick={() => setSelectedOrder(order)} style={orderCardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontWeight: "700", color: "#009fe3" }}>{order.id}</span>
            <span style={{ color: "#888", fontSize: "14px" }}>{order.date}</span>
          </div>
          <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px" }}>{order.items.join(", ")}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", fontSize: "17px" }}>Total : {order.total}</span>
            <span style={{ padding: "6px 16px", borderRadius: "30px", fontSize: "13px", backgroundColor: order.status === "Livré" ? "#e8f8f5" : "#fff9e6", color: order.status === "Livré" ? "#1abc9c" : "#f1c40f", fontWeight: "600" }}>
              {order.status}
            </span>
          </div>
        </div>
      ))
    ) : (
      <div style={{ backgroundColor: "#fafafa", padding: "30px", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
        <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", color: "#009fe3", fontWeight: "600", marginBottom: "20px" }}>← Retour au listing</button>
        <p><strong>ID Commande :</strong> {selectedOrder.id}</p>
        <p><strong>Date :</strong> {selectedOrder.date}</p>
        <p><strong>Articles :</strong> {selectedOrder.items.join(", ")}</p>
        <p><strong>Statut :</strong> {selectedOrder.status}</p>
        <p style={{ marginTop: "25px", fontSize: "19px", fontWeight: "700", color: "#009fe3" }}>Montant débloqué : {selectedOrder.total}</p>
      </div>
    )}
  </div>
);

const InfoContent = ({ profileData, setProfileData, setNotification, setActiveProfileSection }) => (
  <div>
    <h2 style={{ marginBottom: "30px" }}>Mes Informations</h2>
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "600px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#444" }}>Nom du Responsable</label>
        <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#444" }}>Raison Sociale</label>
        <input type="text" value={profileData.company} onChange={(e) => setProfileData({ ...profileData, company: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#444" }}>Téléphone Professionnel</label>
        <input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#444" }}>Ville principale</label>
        <input type="text" value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} style={inputStyle} />
      </div>
      <button style={saveButtonStyle} onClick={() => {
        if (setNotification) setNotification("Informations mises à jour !");
        setTimeout(() => setNotification && setNotification(""), 2000);
        setActiveProfileSection("menu");
      }}>
        Enregistrer les modifications
      </button>
    </div>
  </div>
);

const PromotionsContent = ({ mockPromotions }) => (
  <div>
    <h2 style={{ marginBottom: "25px" }}>Promotions & Campagnes</h2>
    {mockPromotions.map((promo) => (
      <div key={promo.id} style={{ padding: "20px", border: "1px solid #f0f0f2", borderRadius: "16px", marginBottom: "16px", backgroundColor: "#fafafa" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4>{promo.title} <span style={{ color: "#ff4d4d", fontWeight: "700" }}>{promo.discount}</span></h4>
            <p style={{ margin: "6px 0 0 0", color: "#666" }}>{promo.period}</p>
          </div>
          <span style={{ padding: "6px 14px", borderRadius: "30px", fontSize: "13px", backgroundColor: promo.status === "Actif" ? "#e8f8f5" : "#f5f5f5", color: promo.status === "Actif" ? "#1abc9c" : "#888" }}>
            {promo.status}
          </span>
        </div>
      </div>
    ))}
    <button style={{ ...saveButtonStyle, backgroundColor: "#009fe3" }} onClick={() => alert("Création de coupon bientôt disponible")}>
      Créer un nouveau coupon
    </button>
  </div>
);

const PaymentsContent = ({ mockPayments }) => (
  <div>
    <h2 style={{ marginBottom: "25px" }}>Méthodes de Paiement</h2>
    {mockPayments.map((pay) => (
      <div key={pay.id} style={{ padding: "20px", border: "1px solid #e5e7eb", borderRadius: "16px", marginBottom: "16px", backgroundColor: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ fontSize: "32px" }}>{pay.type === "Visa" ? "💳" : "🏦"}</div>
          <div>
            <div style={{ fontWeight: "600" }}>{pay.type === "Visa" ? `Visa **** ${pay.last4}` : pay.label}</div>
            {pay.provider && <div style={{ color: "#666", fontSize: "14px" }}>{pay.provider}</div>}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ShopSettingsContent = () => (
  <div>
    <h2 style={{ marginBottom: "30px" }}>Paramètres de la Boutique</h2>
    <div style={{ padding: "20px", backgroundColor: "#fafafa", borderRadius: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #eee" }}>
        <div>
          <strong>Notifications de stock bas</strong>
          <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>M'alerter s'il reste moins de 3 articles</p>
        </div>
        <input type="checkbox" defaultChecked style={{ accentColor: "#009fe3", transform: "scale(1.3)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0" }}>
        <div>
          <strong>Devise principale</strong>
          <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>Dirham Marocain (MAD)</p>
        </div>
        <strong style={{ color: "#009fe3" }}>MAD (dh)</strong>
      </div>
    </div>
  </div>
);

const SecurityContent = ({ setNotification, setActiveProfileSection }) => (
  <div>
    <h2 style={{ marginBottom: "30px" }}>Sécurité & Confidentialité</h2>
    <div style={{ maxWidth: "500px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Mot de passe actuel</label>
        <input type="password" placeholder="••••••••" style={inputStyle} />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Nouveau mot de passe</label>
        <input type="password" placeholder="Minimum 8 caractères" style={inputStyle} />
      </div>
      <button style={saveButtonStyle} onClick={() => {
        if (setNotification) setNotification("Mot de passe mis à jour !");
        setTimeout(() => setNotification && setNotification(""), 2000);
        setActiveProfileSection("menu");
      }}>
        Mettre à jour la sécurité
      </button>
    </div>
  </div>
);

/* ====================== Styles ====================== */
const menuItemStyle = { 
  display: "flex", alignItems: "center", gap: "18px", padding: "17px 22px", 
  borderRadius: "14px", border: "none", backgroundColor: "#fff", width: "100%", 
  cursor: "pointer", textAlign: "left" 
};

const iconWrapperStyle = { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "23px" };
const itemTitleStyle = { fontSize: "15.5px", fontWeight: "600", margin: "0 0 4px 0", color: "#1a1a1a" };
const itemSubStyle = { fontSize: "13px", color: "#666", margin: 0 };
const arrowStyle = { fontSize: "23px", color: "#bbb" };

const logoutButtonStyle = { 
  width: "100%", padding: "16px", marginTop: "35px", backgroundColor: "#fff1f0", 
  color: "#ff4d4f", border: "1px solid #ffebe9", borderRadius: "14px", fontWeight: "600", cursor: "pointer" 
};

const orderCardStyle = { 
  padding: "22px", border: "1px solid #e5e7eb", borderRadius: "16px", 
  marginBottom: "18px", cursor: "pointer", backgroundColor: "#fff" 
};

const inputStyle = { 
  width: "100%", padding: "14px 16px", borderRadius: "10px", 
  border: "1px solid #d1d5db", fontSize: "15px", outline: "none" 
};

const saveButtonStyle = { 
  width: "100%", backgroundColor: "#009fe3", color: "#fff", border: "none", 
  borderRadius: "25px", padding: "16px", fontSize: "16px", fontWeight: "700", 
  cursor: "pointer", marginTop: "10px" 
};

export default Profil;