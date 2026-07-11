import React, { useState } from "react";

const ProfilFournisseur = () => {
  // État local pour stocker la photo de profil chargée dynamiquement
  const [avatar, setAvatar] = useState(null); // Initialisé à null pour gérer un affichage propre sans image cassée

  // Fonction pour gérer l'importation de l'image de profil depuis le PC
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Met à jour l'avatar avec l'image choisie
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ 
      padding: "30px", 
      width: "100%", 
      maxHeight: "100%",
      boxSizing: "border-box",
    }}>
      
      {/* EN-TÊTE DE LA PAGE */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#009fe3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0, letterSpacing: "-0.5px" }}>
          Mon Espace Fournisseur
        </h2>
      </div>

      {/* DISPOSITION EN GRILLE DEUX COLONNES POUR REMPLIR L'ÉCRAN PC */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "30px",
        alignItems: "start"
      }}>
        
        {/* COLONNE GAUCHE : CARTE D'IDENTITÉ PREMIUM */}
        <div style={{ 
          backgroundColor: "#fff", 
          borderRadius: "20px", 
          padding: "30px", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          border: "1px solid #f0f0f2",
          textAlign: "center"
        }}>
          
          {/* ZONE AVATAR AVEC L'ICÔNE D'APPAREIL PHOTO OPTIMISÉE */}
          <div style={{ position: "relative", width: "110px", height: "110px", margin: "0 auto 20px auto" }}>
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "3px solid #009fe3",
              padding: "3px",
              boxSizing: "border-box",
              backgroundColor: "#f4f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}>
              {avatar ? (
                <img 
                  src={avatar} 
                  alt="Avatar Vendeur" 
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
                />
              ) : (
                // Silhouette neutre si aucune image n'est chargée (évite l'icône d'image brisée)
                <svg viewBox="0 0 24 24" width="45" height="45" fill="none" stroke="#b5b5c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
            
            {/* BOUTON APPAREIL PHOTO RE-STYLISÉ ET AMÉLIORÉ */}
            <label 
              style={{ 
                position: "absolute", 
                bottom: "2px", 
                right: "2px", 
                backgroundColor: "#009fe3", 
                borderRadius: "50%", 
                width: "34px", 
                height: "34px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                color: "#fff",
                boxShadow: "0 3px 10px rgba(0, 159, 227, 0.4)",
                cursor: "pointer",
                transition: "transform 0.2s ease, background-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.backgroundColor = "#0082ba";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#009fe3";
              }}
            >
              {/* Icône SVG moderne au lieu de l'émoji */}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                style={{ display: "none" }} 
              />
            </label>
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 4px 0" }}>Mobilia Design Maroc</h3>
          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 15px 0" }}>fournisseur.mobilia@supplylink.ma</p>
          
          <span style={{ 
            backgroundColor: "#e6f6fe", 
            color: "#009fe3", 
            padding: "6px 14px", 
            borderRadius: "20px", 
            fontSize: "12px", 
            fontWeight: "600",
            display: "inline-block"
          }}>
            ✓ Vendeur Certifié SupplyLink
          </span>

          {/* SÉPARATEUR */}
          <hr style={{ border: "none", borderTop: "1px solid #f0f0f2", margin: "25px 0" }} />

          {/* COMPTEURS DE STATISTIQUES */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div style={{ flex: 1, backgroundColor: "#fafafa", padding: "12px", borderRadius: "12px" }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a" }}>14</div>
              <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Articles En Ligne</div>
            </div>
            <div style={{ flex: 1, backgroundColor: "#fafafa", padding: "12px", borderRadius: "12px" }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#2ec4b6" }}>4.8 ★</div>
              <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Évaluation globale</div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : LES BLOCS D'OPTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Groupe de réglages 1 */}
          <div style={cardStyle}>
            <div style={rowStyle}>
              <div style={{ ...iconWrapperStyle, backgroundColor: "#e6f6fe", color: "#009fe3" }}>🕒</div>
              <div style={{ flex: 1 }}>
                <h4 style={rowTitleStyle}>Mon activité</h4>
                <p style={rowSubStyle}>Suivi de vos ventes, statistiques et historiques de publications</p>
              </div>
              <span style={arrowStyle}>›</span>
            </div>

            <div style={rowStyle}>
              <div style={{ ...iconWrapperStyle, backgroundColor: "#eefaf9", color: "#2ec4b6" }}>🔖</div>
              <div style={{ flex: 1 }}>
                <h4 style={rowTitleStyle}>Mes informations</h4>
                <p style={rowSubStyle}>Modifier le nom de l'entreprise, adresse de l'entrepôt, contact</p>
              </div>
              <span style={arrowStyle}>›</span>
            </div>

            {/* NOUVEL ONGLET : PROMOTION */}
            <div style={rowStyle}>
              <div style={{ ...iconWrapperStyle, backgroundColor: "#fff0f0", color: "#ff4d4d" }}>🏷️</div>
              <div style={{ flex: 1 }}>
                <h4 style={rowTitleStyle}>Promotions & Campagnes</h4>
                <p style={rowSubStyle}>Créer des réductions, mettre en avant vos articles et gérer les offres</p>
              </div>
              <span style={arrowStyle}>›</span>
            </div>

            <div style={{ ...rowStyle, borderBottom: "none" }}>
              <div style={{ ...iconWrapperStyle, backgroundColor: "#fff9e6", color: "#f1c40f" }}>💳</div>
              <div style={{ flex: 1 }}>
                <h4 style={rowTitleStyle}>Méthode de paiement</h4>
                <p style={rowSubStyle}>Gérer vos coordonnées bancaires pour recevoir vos virements</p>
              </div>
              <span style={arrowStyle}>›</span>
            </div>
          </div>

          {/* Groupe de réglages 2 */}
          <div style={cardStyle}>
            <div style={rowStyle}>
              <div style={{ ...iconWrapperStyle, backgroundColor: "#f1effc", color: "#7b2cbf" }}>⚙️</div>
              <div style={{ flex: 1 }}>
                <h4 style={rowTitleStyle}>Paramètres de la boutique</h4>
                <p style={rowSubStyle}>Devises, notifications push, alertes de stock bas</p>
              </div>
              <span style={arrowStyle}>›</span>
            </div>

            <div style={{ ...rowStyle, borderBottom: "none" }}>
              <div style={{ ...iconWrapperStyle, backgroundColor: "#e8f8f5", color: "#1abc9c" }}>🛡️</div>
              <div style={{ flex: 1 }}>
                <h4 style={rowTitleStyle}>Sécurité & Confidentialité</h4>
                <p style={rowSubStyle}>Changer votre mot de passe et gérer l'authentification</p>
              </div>
              <span style={arrowStyle}>›</span>
            </div>
          </div>

          {/* Bloc Déconnexion */}
          <div style={{ 
            ...cardStyle, 
            border: "1px solid #ffebe9",
            transition: "background-color 0.2s"
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fff1f0"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
          >
            <div style={{ ...rowStyle, borderBottom: "none", padding: "4px 0" }}>
              <div style={{ ...iconWrapperStyle, backgroundColor: "#fff1f0", color: "#ff4d4f" }}>🚪</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ ...rowTitleStyle, color: "#ff4d4f", fontWeight: "700" }}>Déconnexion</h4>
                <p style={rowSubStyle}>Quitter votre espace vendeur en toute sécurité</p>
              </div>
              <span style={{ ...arrowStyle, color: "#ff4d4f" }}>›</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// DESIGN GÉNÉRAL
const cardStyle = { 
  backgroundColor: "#fff", 
  borderRadius: "20px", 
  padding: "10px 24px", 
  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
  border: "1px solid #f0f0f2"
};

const rowStyle = { 
  display: "flex", 
  alignItems: "center", 
  gap: "20px", 
  padding: "18px 0", 
  borderBottom: "1px solid #f4f4f6", 
  cursor: "pointer" 
};

const iconWrapperStyle = { 
  width: "42px", 
  height: "42px", 
  borderRadius: "12px", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  fontSize: "20px" 
};

const rowTitleStyle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 2px 0"
};

const rowSubStyle = {
  fontSize: "12px",
  color: "#777",
  margin: 0
};

const arrowStyle = {
  fontSize: "20px",
  color: "#bbb",
  fontWeight: "300"
};

export default ProfilFournisseur;