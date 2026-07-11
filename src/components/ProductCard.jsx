import React from "react";


const ProductCard = ({ product }) => {
  return (
    <div className="product-card" style={cardStyle}>
      {/* Container de l'image pour assurer un format cohérent */}
      <div style={imageContainerStyle}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={imageStyle}
          // Image de secours si le chemin ne fonctionne pas
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/200?text=Image+indisponible"; 
          }}
        />
      </div>

      {/* Détails du produit */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{product.name}</h3>
        
        {/* Affichage du prix */}
        <div style={priceContainerStyle}>
          <span style={priceStyle}>{product.price}</span>
          {product.oldPrice && <span style={oldPriceStyle}>{product.oldPrice}</span>}
        </div>
        
        {/* Badge promotionnel si présent */}
        {product.discount && (
          <span style={discountBadgeStyle}>{product.discount}</span>
        )}
      </div>
    </div>
  );
};
const contactButtonStyle = {
  width: "60%",            // Réduit la largeur à 60% du parent au lieu de 100%
  marginTop: "8px",
  padding: "10px",
  backgroundColor: "transparent",
  color: "#009fe3",
  border: "2px solid #009fe3",
  borderRadius: "6px",
  cursor: "pointer",
  display: "block",        // Permet au bouton d'être un bloc
  marginLeft: "auto",      // Centre le bouton horizontalement
  marginRight: "auto"
};

// --- Styles CSS-in-JS pour garantir une mise en page propre ---
const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #f0f0f0",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  height: "100%"
};

const imageContainerStyle = {
  width: "100%",
  height: "180px",
  overflow: "hidden",
  backgroundColor: "#f9f9f9"
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const contentStyle = {
  padding: "12px",
  flexGrow: 1
};

const titleStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
  margin: "0 0 8px 0",
  lineHeight: "1.4"
};

const priceContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const priceStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#009fe3"
};

const oldPriceStyle = {
  fontSize: "12px",
  color: "#999",
  textDecoration: "line-through"
};

const discountBadgeStyle = {
  display: "inline-block",
  marginTop: "8px",
  backgroundColor: "#ffebee",
  color: "#d32f2f",
  fontSize: "11px",
  fontWeight: "700",
  padding: "2px 8px",
  borderRadius: "4px"
};


export default ProductCard;