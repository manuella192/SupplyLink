import React from "react";
import PromoBanner from "../components/PromoBanner";
import ProductCard from "../components/ProductCard";


const AccueilFournisseur = ({ products, onPromote }) => {
  return (
    <div className="home-container" style={{ width: "100%", boxSizing: "border-box" }}>
      
      <PromoBanner />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "30px 0 20px 0" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
          Mes Articles Récemment Publiés
        </h2>
        <span style={{ fontSize: "13px", color: "#666", backgroundColor: "#f5f5f7", padding: "4px 12px", borderRadius: "20px" }}>
          {products.length} {products.length > 1 ? "articles" : "article"}
        </span>
      </div>

      <div className="products-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "24px",
        width: "100%"
      }}>
        {products.map((product) => (
          <div 
            key={product.id} 
            style={{ 
              backgroundColor: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* On appelle ProductCard une seule fois pour gérer l'affichage de l'image et des détails */}
            <ProductCard product={product} />

            {/* Footer de la carte avec statistiques et action */}
            <div style={{ 
              backgroundColor: "#fafafa", 
              padding: "14px 16px", 
              borderTop: "1px solid #f0f0f2", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px" }}>📊</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>
                  {product.visitors.toLocaleString()} <span style={{ fontWeight: "400", color: "#888" }}>visiteurs</span>
                </span>
              </div>

              <button 
                onClick={(e) => {
    e.stopPropagation(); 
    onPromote(product); // On envoie l'objet entier
  }}
                style={{ 
                  backgroundColor: "#009fe3", color: "#fff", border: "none", borderRadius: "20px", 
                  padding: "6px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer"
                }}
              >
                Promouvoir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccueilFournisseur;