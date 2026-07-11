import React, { useState } from "react";
import AccueilFournisseur from "./pages/AccueilFournisseur";
import GestionArticle from "./pages/GestionArticle";
import DiscussionFournisseur from "./pages/DiscussionFournisseur";
import GestionCommandes from "./pages/GestionCommandes";
import "./App.css";

// --- ON INTÈGRE DIRECTEMENT LE CODE DU PROFIL INTERACTIF ICI POUR ÉVITER TOUT CONFLIT ---
const ProfilVendeurInteractif = ({ setNotification }) => {
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
    <div className="profile-container" style={{ padding: "10px 0", width: "100%", boxSizing: "border-box" }}>
      <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #f0f0f2", maxWidth: "700px", margin: "0 auto" }}>
        
        {/* EN-TÊTE DYNAMIQUE */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px", borderBottom: "1px solid #f4f4f6", paddingBottom: "20px" }}>
          {activeProfileSection !== "menu" && (
            <button 
              type="button"
              onClick={() => { setActiveProfileSection("menu"); setSelectedOrder(null); }} 
              style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#009fe3", padding: "0 10px 0 0", display: "flex", alignItems: "center", fontWeight: "600" }}
            >
              ‹ Retour
            </button>
          )}
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a", margin: 0, letterSpacing: "-0.5px" }}>
            {activeProfileSection === "menu" && "Mon Compte"}
            {activeProfileSection === "activity" && "Mon activité & Ventes"}
            {activeProfileSection === "info" && "Mes informations"}
            {activeProfileSection === "promotions" && "Promotions & Campagnes"}
            {activeProfileSection === "payments" && "Méthodes de paiement"}
            {activeProfileSection === "shop_settings" && "Paramètres de la boutique"}
            {activeProfileSection === "security" && "Sécurité & Confidentialité"}
          </h2>
        </div>

        {/* MENU PRINCIPAL */}
        {activeProfileSection === "menu" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "35px" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#f4f4f6", border: "3px solid #009fe3", padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px" }}>
                <span style={{ fontSize: "44px" }}>👤</span>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 4px 0" }}>{profileData.company}</h3>
              <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>{profileData.email}</p>
            </div>

            {/* BLOC RÉGLAGES 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", backgroundColor: "#fff", border: "1px solid #f4f4f6", borderRadius: "16px", overflow: "hidden", marginBottom: "20px" }}>
              <button type="button" onClick={() => setActiveProfileSection("activity")} style={menuItemStyle}>
                <div style={{ ...iconWrapperStyle, backgroundColor: "#e6f6fe", color: "#009fe3" }}>🕒</div>
                <div style={{ flex: 1, textAlign: "left" }}><h4 style={itemTitleStyle}>Mon activité</h4><p style={itemSubStyle}>Suivi de vos ventes, statistiques et historiques de publications</p></div>
                <span style={arrowStyle}>›</span>
              </button>

              <button type="button" onClick={() => setActiveProfileSection("info")} style={menuItemStyle}>
                <div style={{ ...iconWrapperStyle, backgroundColor: "#eefaf9", color: "#2ec4b6" }}>🔖</div>
                <div style={{ flex: 1, textAlign: "left" }}><h4 style={itemTitleStyle}>Mes informations</h4><p style={itemSubStyle}>Modifier le nom de l'entreprise, adresse de l'entrepôt, contact</p></div>
                <span style={arrowStyle}>›</span>
              </button>

              <button type="button" onClick={() => setActiveProfileSection("promotions")} style={menuItemStyle}>
                <div style={{ ...iconWrapperStyle, backgroundColor: "#fff0f0", color: "#ff4d4d" }}>🏷️</div>
                <div style={{ flex: 1, textAlign: "left" }}><h4 style={itemTitleStyle}>Promotions & Campagnes</h4><p style={itemSubStyle}>Créer des réductions, mettre en avant vos articles et gérer les offres</p></div>
                <span style={arrowStyle}>›</span>
              </button>

              <button type="button" onClick={() => setActiveProfileSection("payments")} style={{ ...menuItemStyle, borderBottom: "none" }}>
                <div style={{ ...iconWrapperStyle, backgroundColor: "#fff9e6", color: "#f1c40f" }}>💳</div>
                <div style={{ flex: 1, textAlign: "left" }}><h4 style={itemTitleStyle}>Méthode de paiement</h4><p style={itemSubStyle}>Gérer vos coordonnées bancaires pour recevoir vos virements</p></div>
                <span style={arrowStyle}>›</span>
              </button>
            </div>

            {/* BLOC RÉGLAGES 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", backgroundColor: "#fff", border: "1px solid #f4f4f6", borderRadius: "16px", overflow: "hidden", marginBottom: "20px" }}>
              <button type="button" onClick={() => setActiveProfileSection("shop_settings")} style={menuItemStyle}>
                <div style={{ ...iconWrapperStyle, backgroundColor: "#f1effc", color: "#7b2cbf" }}>⚙️</div>
                <div style={{ flex: 1, textAlign: "left" }}><h4 style={itemTitleStyle}>Paramètres de la boutique</h4><p style={itemSubStyle}>Devises, notifications push, alertes de stock bas</p></div>
                <span style={arrowStyle}>›</span>
              </button>

              <button type="button" onClick={() => setActiveProfileSection("security")} style={{ ...menuItemStyle, borderBottom: "none" }}>
                <div style={{ ...iconWrapperStyle, backgroundColor: "#e8f8f5", color: "#1abc9c" }}>🛡️</div>
                <div style={{ flex: 1, textAlign: "left" }}><h4 style={itemTitleStyle}>Sécurité & Confidentialité</h4><p style={itemSubStyle}>Changer votre mot de passe et gérer l'authentification</p></div>
                <span style={arrowStyle}>›</span>
              </button>
            </div>

            {/* DECONNEXION */}
            <button type="button" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "14px 20px", border: "1px solid #ffebe9", borderRadius: "16px", cursor: "pointer", backgroundColor: "#fff", width: "100%", fontFamily: "inherit" }} onClick={() => alert("Déconnexion réussie !")}>
              <div style={{ ...iconWrapperStyle, backgroundColor: "#fff1f0", color: "#ff4d4f" }}>🚪</div>
              <div style={{ flex: 1, textAlign: "left" }}><h4 style={{ ...itemTitleStyle, color: "#ff4d4f", fontWeight: "700" }}>Déconnexion</h4><p style={itemSubStyle}>Quitter votre espace vendeur en toute sécurité</p></div>
              <span style={{ ...arrowStyle, color: "#ff4d4f" }}>›</span>
            </button>
          </>
        )}

        {/* CONTENUS DES SECTIONS */}
        {activeProfileSection === "activity" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {!selectedOrder ? (
              mockOrders.map((order) => (
                <div key={order.id} onClick={() => setSelectedOrder(order)} style={{ border: "1px solid #e5e7eb", padding: "16px", borderRadius: "12px", cursor: "pointer", backgroundColor: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontWeight: "700", color: "#009fe3" }}>{order.id}</span>
                    <span style={{ color: "#888", fontSize: "13px" }}>{order.date}</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#444", marginBottom: "10px", fontWeight: "600" }}>{order.items.join(", ")}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "700", color: "#1a1a1a" }}>Total : {order.total}</span>
                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", backgroundColor: order.status === "Livré" ? "#e8f8f5" : "#fff9e6", color: order.status === "Livré" ? "#1abc9c" : "#f1c40f", fontWeight: "600" }}>{order.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ backgroundColor: "#fafafa", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", color: "#009fe3", cursor: "pointer", fontWeight: "600", marginBottom: "15px", padding: 0 }}>← Retour au listing</button>
                <p style={{ margin: "6px 0" }}><strong>ID Commande :</strong> {selectedOrder.id}</p>
                <p style={{ margin: "6px 0" }}><strong>Date :</strong> {selectedOrder.date}</p>
                <p style={{ margin: "6px 0" }}><strong>Articles :</strong> {selectedOrder.items.join(", ")}</p>
                <p style={{ margin: "6px 0" }}><strong>Statut :</strong> {selectedOrder.status}</p>
                <p style={{ margin: "12px 0 0 0", fontSize: "16px", fontWeight: "700", color: "#009fe3" }}>Montant : {selectedOrder.total}</p>
              </div>
            )}
          </div>
        )}

        {activeProfileSection === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div><label style={labelStyle}>Nom du Responsable</label><input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>Raison Sociale</label><input type="text" value={profileData.company} onChange={(e) => setProfileData({ ...profileData, company: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>Téléphone</label><input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>Ville</label><input type="text" value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} style={inputStyle} /></div>
            <button style={saveButtonStyle} onClick={() => { if (setNotification) setNotification("Enregistré !"); setActiveProfileSection("menu"); }}>Enregistrer les modifications</button>
          </div>
        )}

        {activeProfileSection === "promotions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {mockPromotions.map((promo) => (
              <div key={promo.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f4f4f6", padding: "16px", borderRadius: "12px", backgroundColor: "#fafafa" }}>
                <div><h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "600" }}>{promo.title} <span style={{ color: "#ff4d4d" }}>{promo.discount}</span></h4><p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{promo.period}</p></div>
                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", backgroundColor: promo.status === "Actif" ? "#e8f8f5" : "#f5f5f7", color: promo.status === "Actif" ? "#1abc9c" : "#888", fontWeight: "600" }}>{promo.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeProfileSection === "payments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {mockPayments.map((pay) => (
              <div key={pay.id} style={{ border: "1px solid #e5e7eb", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "15px", backgroundColor: "#fafafa" }}>
                <div style={{ fontSize: "24px" }}>{pay.type === "Visa" ? "💳" : "🏦"}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: "600", fontSize: "14px" }}>{pay.type === "Visa" ? `Visa **** ${pay.last4}` : pay.label}</div>{pay.provider && <div style={{ fontSize: "12px", color: "#666" }}>{pay.provider}</div>}</div>
              </div>
            ))}
          </div>
        )}

        {activeProfileSection === "shop_settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f4f4f6" }}>
              <div><h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>Notifications de stock bas</h4></div>
              <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", accentColor: "#009fe3" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
              <div><h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>Devise principale</h4></div>
              <strong style={{ color: "#009fe3" }}>MAD (dh)</strong>
            </div>
          </div>
        )}

        {activeProfileSection === "security" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div><label style={labelStyle}>Nouveau mot de passe</label><input type="password" placeholder="••••••••" style={inputStyle} /></div>
            <button style={saveButtonStyle} onClick={() => setActiveProfileSection("menu")}>Mettre à jour</button>
          </div>
        )}

      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL CONTENEUR ---
const FournisseurPage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [globalNotification, setGlobalNotification] = useState("");
  const [promotionState, setPromotionState] = useState(null);
  

  const [supplierProducts, setSupplierProducts] = useState([
    { id: 1, name: "Armoire en Bois Noir", price: "2000", rating: 4, category: "Mobilier", image: "/assets/armoire.jpg", visitors: 62 },
    { id: 2, name: "bureau.jpg", price: "2000", rating: 5, category: "Mobilier", image: "/assets/bureau.jpg", visitors: 17 },
    { id: 3, name: "four.jpg", price: "1000", rating: 3, category: "Électroménager", image: "/assets/four.jpg", visitors: 13 },
    { id: 4, name: "frigo.jpg", price: "2000", rating: 4, category: "Électroménager", image: "/assets/frigo.jpg", visitors: 13 },
    { id: 5, name: "Table Ronde Moderne", price: "3000", rating: 5, category: "Mobilier", image: "/assets/table.jpg", visitors: 13 },
    { id: 6, name: "Armoire1.jpg", price: "1500", rating: 4, category: "Mobilier", image: "/assets/Armoire1.jpg", visitors: 32 },
    { id: 7, name: "burreau1.jpg", price: "2500", rating: 5, category: "Mobilier", image: "/assets/burreau1.jpg", visitors: 2 },
    { id: 8, name: "canape.jpg", price: "1600", rating: 4, category: "Mobilier", image: "/assets/canape.jpg", visitors: 1 },
    { id: 9, name: "Cannape1.jpg", price: "700", rating: 5, category: "Mobilier", image: "/assets/Cannape1.jpg", visitors: 7 },
    { id: 10, name: "lit.jpg", price: "1500", rating: 4, category: "Mobilier", image: "/assets/lit.jpg", visitors: 1 },
    { id: 11, name: "Lit1.jpg", price: "1850", rating: 4, category: "Mobilier", image: "/assets/Lit1.jpg", visitors: 0 },
    { id: 12, name: "Lampe de chevet", price: "248", rating: 4, category: "Luminaire", image: "/assets/lampe.jpg", visitors: 2099 }
  ]);
  

  const handleAddProduct = (newProd) => {
    setSupplierProducts([newProd, ...supplierProducts]);
  };
  

  const handleDeleteProduct = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      setSupplierProducts(supplierProducts.filter(p => p.id !== id));
    }
  };

 const handlePromoteProduct = (product) => {
  setPromotionState({ step: 'select', product });
};

  return (
    <div className="pc-layout" style={{ position: "relative", minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {promotionState && (
  <div style={{ 
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
    backgroundColor: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(8px)", 
    zIndex: 5000, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px"
  }}>
    <div style={{ 
      backgroundColor: "#fff", padding: "40px", borderRadius: "24px", 
      maxWidth: "450px", width: "100%", textAlign: "center",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      animation: "slideUp 0.3s ease-out"
    }}>
      
      {promotionState.step === 'select' && (
        <>
          <div style={{ width: "60px", height: "60px", backgroundColor: "#f0f7ff", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <span style={{ fontSize: "28px" }}>📈</span>
          </div>
          <h2 style={{ fontSize: "22px", margin: "0 0 10px", color: "#1a1a1a" }}>Choisir une campagne</h2>
          <p style={{ color: "#71717a", marginBottom: "30px", fontSize: "14px" }}>Sélectionnez l'offre pour : <strong>{promotionState.product?.name}</strong></p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Boost Visibilité (99 dh)", "Pack Premium (199 dh)", "Focus Accueil (499 dh)"].map(opt => (
              <button key={opt} onClick={() => setPromotionState({...promotionState, step: 'confirm'})} 
                style={{ 
                  padding: "16px", borderRadius: "16px", border: "1px solid #e4e4e7", 
                  backgroundColor: "white", cursor: "pointer", fontWeight: "600", 
                  fontSize: "14px", transition: "all 0.2s", color: "#27272a"
                }}
                onMouseOver={(e) => { e.target.style.backgroundColor = "#f9fafb"; e.target.style.borderColor = "#009fe3"; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = "white"; e.target.style.borderColor = "#e4e4e7"; }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {promotionState.step === 'confirm' && (
        <>
          <h2 style={{ fontSize: "22px", margin: "0 0 15px" }}>Confirmation de paiement</h2>
          <div style={{ backgroundColor: "#f4f4f5", padding: "20px", borderRadius: "16px", marginBottom: "25px" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#52525b" }}>Prélèvement prévu sur :</p>
            <p style={{ margin: "5px 0 0", fontWeight: "700", color: "#009fe3" }}>Compte principal CIH Bank</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setPromotionState(null)} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", background: "#f4f4f5", fontWeight: "600", cursor: "pointer" }}>Annuler</button>
            <button onClick={() => setPromotionState({...promotionState, step: 'success'})} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", backgroundColor: "#009fe3", color: "#fff", fontWeight: "600", cursor: "pointer" }}>Valider</button>
          </div>
        </>
      )}

      {promotionState.step === 'success' && (
        <>
          <div style={{ width: "80px", height: "80px", backgroundColor: "#ecfdf5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <span style={{ fontSize: "40px" }}>✨</span>
          </div>
          <h2 style={{ fontSize: "24px", margin: "0 0 10px" }}>Campagne activée !</h2>
          <p style={{ color: "#71717a", marginBottom: "30px", lineHeight: "1.6" }}>Votre article a été propulsé en tête de liste pour maximiser vos ventes.</p>
          <button onClick={() => setPromotionState(null)} style={{ width: "100%", padding: "16px", borderRadius: "12px", backgroundColor: "#18181b", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer" }}>Retour à mes articles</button>
        </>
      )}
    </div>
  </div>
)}
      {/* ALERTE NOTIFICATION */}
      {globalNotification && (
        <div style={{ position: "fixed", top: "80px", right: "20px", backgroundColor: "#2ec4b6", color: "#fff", padding: "12px 24px", borderRadius: "8px", zIndex: 2000, fontWeight: "600" }}>
          {globalNotification}
        </div>
      )}

      {/* HEADER GLOBAL */}
      <header className="main-header" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "15px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="header-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <div className="logo-section" onClick={() => setActiveTab("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#009fe3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span className="brand-name" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "20px", color: "#1f2937" }}>
              SupplyLink <span style={{ fontSize: "11px", backgroundColor: "#009fe3", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: "normal" }}>Espace Vendeur</span>
            </span>
          </div>

          <div className="search-wrapper" style={{ position: "relative", width: "320px" }}>
            <span className="search-icon" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "14px" }}>🔍</span>
            <input type="text" placeholder="Rechercher mes articles..." className="search-input" style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: "10px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", backgroundColor: "#f9fafb" }} />
          </div>
        </div>
      </header>

      {/* ZONE DE CONTENU DYNAMIQUE */}
      <main className="page-content scrollable-area" style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 24px 100px 24px", boxSizing: "border-box" }}>
        {activeTab === "home" && <AccueilFournisseur products={supplierProducts} onPromote={handlePromoteProduct} />}
        {activeTab === "article" && <GestionArticle products={supplierProducts} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} />}
        
        {/* APPEL DU PROFIL INTERACTIF ET CORRIGÉ À LA PLACE DE L'ANCIEN COMPOSANT STATIQUE */}
        {activeTab === "profil" && <ProfilVendeurInteractif setNotification={setGlobalNotification} />}
        {activeTab === "commandes" && <GestionCommandes />}
        {activeTab === "discussion" && <DiscussionFournisseur />}

      </main>

      {/* FOOTER - BARRE DE NAVIGATION FIXE */}
      <footer className="pc-footer" style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb", padding: "10px 24px", zIndex: 1000, boxShadow: "0 -4px 12px rgba(0,0,0,0.05)" }}>
        <div className="footer-links" style={{ display: "flex", justifyContent: "space-around", maxWidth: "600px", margin: "0 auto" }}>
          <button onClick={() => setActiveTab("home")} style={{ ...navButtonStyle, color: activeTab === "home" ? "#009fe3" : "#6b7280" }}><span>🏠</span>Accueil</button>
          <button onClick={() => setActiveTab("article")} style={{ ...navButtonStyle, color: activeTab === "article" ? "#009fe3" : "#6b7280" }}><span>📦</span>Articles</button>
          <button onClick={() => setActiveTab("profil")} style={{ ...navButtonStyle, color: activeTab === "profil" ? "#009fe3" : "#6b7280" }}><span>👤</span>Profil</button>
          <button onClick={() => setActiveTab("discussion")} style={{ ...navButtonStyle, color: activeTab === "discussion" ? "#009fe3" : "#6b7280" }}><span>💬</span>Discussion</button>
          <button onClick={() => setActiveTab("commandes")} style={{ ...navButtonStyle, color: activeTab === "commandes" ? "#009fe3" : "#6b7280" }}><span>📦</span>Commande</button>
        </div>
      </footer>

    </div>
  );
};

// Styles du Menu Profil
const menuItemStyle = { display: "flex", alignItems: "center", gap: "20px", padding: "16px 20px", borderBottom: "1px solid #f4f4f6", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer", backgroundColor: "#fff", width: "100%", fontFamily: "inherit", outline: "none" };
const iconWrapperStyle = { width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" };
const itemTitleStyle = { fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 2px 0" };
const itemSubStyle = { fontSize: "12px", color: "#777", margin: 0, fontWeight: "400" };
const arrowStyle = { fontSize: "20px", color: "#bbb", fontWeight: "300" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db", boxSizing: "border-box", outline: "none", fontSize: "14px" };
const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "6px" };
const saveButtonStyle = { width: "100%", backgroundColor: "#009fe3", color: "#fff", border: "none", borderRadius: "25px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: "pointer", marginTop: "10px" };
const navButtonStyle = { background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer" };

export default FournisseurPage;