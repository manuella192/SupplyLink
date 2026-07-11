import React from "react";
import ProductCard from "../components/ProductCard";

const Accueil = ({ 
  filteredProducts, 
  selectedProduct, 
  setSelectedProduct, 
  quantity, 
  setQuantity, 
  handleAddToCart, 
  selectedCategory, 
  setSelectedCategory ,
  onOpenChat

}) => {

  // Liste des catégories pour la navigation
  const categories = [
    { name: "Mobilier", image: "/assets/burreau1.jpg" },
    { name: "Électroménager", image: "/assets/four.jpg" },
    { name: "Décoration", image: "/assets/lampe.jpg" },
    { name: "Luminaires", image: "/assets/lampe.jpg" },
  ];

  // 1. VUE DÉTAILLÉE
  if (selectedProduct) {
    return (
      <>
        <div className="product-detail-view">
          <div className="detail-image-panel">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="detail-main-img" />
            <button className="back-floating-btn" onClick={() => setSelectedProduct(null)}>‹</button>
            <button className="search-floating-btn">🔍</button>
            <div className="carousel-indicators">
              <div className="indicator active"></div>
              <div className="indicator"></div>
              <div className="indicator"></div>
            </div>
          </div>

          <div className="detail-info-panel">
            <div className="detail-header-row">
              <div>
                <h2 className="detail-title">{selectedProduct.name} sur pied - 40w</h2>
                <span className="stock-badge">En stock - Disponible immédiatement</span>
              </div>
              <button className="share-btn">📤</button>
            </div>

            <div className="product-extended-info">
              <p className="product-description-text">
                Sublimez votre espace intérieur avec cette pièce unique. Conçue avec des matériaux durables et des finitions soignées pour garantir esthétique et robustesse au quotidien.
              </p>
              <div className="specs-grid">
                <div className="spec-item"><strong>Nombre de ventes :</strong> {selectedProduct.sales || "N/A"}</div>
                <div className="spec-item"><strong>Matériaux :</strong> Haute Qualité Certifiée</div>
                <div className="spec-item"><strong>Garantie :</strong> {selectedProduct.warranty}</div>
                <div className="spec-item"><strong>Disponibilité :</strong> Nationale</div>
              </div>
            </div>

            <div className="purchase-section">
              <div className="price-block">
                <div className="current-price-row">
                  <span className="price-main">{selectedProduct.price ? selectedProduct.price.split(' ')[0] : selectedProduct.price}</span>
                  <span className="price-currency">
                    <span className="cents">00</span>
                    <span className="currency">dh</span>
                  </span>
                  <span className="discount-tag">{selectedProduct.discount || "-10%"}</span>
                </div>
                <span className="old-price">{selectedProduct.oldPrice || ""}</span>
              </div>

              <div className="actions-block">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input type="text" value={quantity} readOnly />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <button className="order-btn" onClick={() => handleAddToCart(selectedProduct, quantity)}>
                  Ajouter au panier
                </button>
              </div>
            </div>

            <div className="detail-reassurance-box">
  {/* On remplace la balise <a> (mailto) par le <button> qui appelle onOpenChat */}
  <button 
  className="contact-btn"
  onClick={() => onOpenChat(selectedProduct)}
  style={{
    width: "60%",            // Largeur contrôlée
    maxWidth: "250px",       // Empêche le bouton de devenir trop large sur grand écran
    marginTop: "12px",
    padding: "10px 15px",
    backgroundColor: "transparent",
    color: "#009fe3",
    border: "2px solid #009fe3",
    borderRadius: "8px",      // Arrondi plus doux (8px au lieu de 6px)
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    fontWeight: "700",        // Texte en gras pour mieux ressortir
    fontSize: "14px",
    transition: "all 0.3s ease", // Animation fluide pour le survol
    boxShadow: "0 2px 4px rgba(0, 159, 227, 0.1)" // Ombre très légère et colorée
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#009fe3";
    e.target.style.color = "#ffffff";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#009fe3";
  }}
>
  Contacter le vendeur
</button>
              <div className="reassurance-row">
                <span className="icon">🚚</span>
                <p><strong>Livraison gratuite</strong> pour la premiere commande</p>
              </div>
              <div className="reassurance-row">
                <span className="icon">🕒</span>
                <p><strong>Livraison sur une semaine</strong> apresa la commande</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="section-divider-title">D'autres articles susceptibles de vous plaire</h3>
        <main className="product-grid">
          {filteredProducts.filter(p => p.id !== selectedProduct.id).slice(0, 4).map((p) => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ cursor: 'pointer' }}>
              <ProductCard product={p} />
            </div>
          ))}
        </main>
      </>
    );
  }

  // 2. VUE D'ACCUEIL
  return (
    <>
      {!selectedCategory && (
        <section className="hero-section" style={{ 
          background: "linear-gradient(160deg, #009fe3 0%, #005a8d 100%)",
          color: "white", 
          padding: "70px 20px", 
          textAlign: "center", 
          borderRadius: "0 0 60px 60px",
          marginBottom: "40px",
          boxShadow: "0 15px 35px rgba(0, 120, 180, 0.4)",
          position: "relative",
          overflow: "hidden"
        }}>
          <h1 style={{ 
            fontSize: "3rem", 
            marginBottom: "15px", 
            fontWeight: "900", 
            letterSpacing: "-1px",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}>
            SupplyLink 
          </h1>
          <p style={{ 
            fontSize: "1.25rem", 
            opacity: "0.9", 
            maxWidth: "500px", 
            margin: "0 auto",
            lineHeight: "1.4"
          }}>
            L'excellence et le design pour votre intérieur.
          </p>
        </section>
      )}

      {/* SECTION CAROUSEL D'ARTICLES DÉFILANTS */}
      {!selectedCategory && (
        <section className="scrolling-products" style={{ 
          padding: "20px 0 40px 20px" 
        }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#333" }}>Nos meilleures ventes</h3>
          <div style={{ 
            display: "flex", 
            gap: "20px", 
            overflowX: "auto",
            paddingBottom: "10px",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}>
            {filteredProducts.map((p) => (
              <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ 
                flex: "0 0 200px",
                cursor: 'pointer' 
              }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedCategory && (
        <div style={{ padding: "0 20px 20px", textAlign: "center" }}>
          <button onClick={() => setSelectedCategory(null)} style={{ 
            background: "#fff", 
            border: "1px solid #009fe3", 
            color: "#009fe3", 
            padding: "8px 20px", 
            borderRadius: "20px", 
            cursor: "pointer", 
            fontWeight: "600" 
          }}>
            ← Retour aux collections
          </button>
        </div>
      )}

      {/* SECTION CATÉGORIES */}
      <section className="categories-nav" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(5, 1fr)", 
        gap: "15px", 
        padding: "20px" 
      }}>
        {categories.map((cat) => (
          <div key={cat.name} onClick={() => setSelectedCategory(cat.name)} style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            cursor: "pointer" 
          }}>
            <div style={{ 
              width: "65px", 
              height: "65px", 
              borderRadius: "50%", 
              overflow: "hidden",
              marginBottom: "8px",
              border: "1px solid #eee"
            }}>
              <img 
                src={cat.image} 
                alt={cat.name} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            <span style={{ 
              fontSize: "0.8rem", 
              fontWeight: "600", 
              color: "#333", 
              textAlign: "center" 
            }}>
              {cat.name}
            </span>
          </div>
        ))}
      </section>

      <section className="premium-reassurance" style={{ 
        display: "flex", 
        justifyContent: "space-around", 
        padding: "30px", 
        backgroundColor: "#f9f9f9", 
        margin: "20px 20px", 
        borderRadius: "15px" 
      }}>
        <div className="reassurance-item">✨ <strong>Qualité Certifiée</strong></div>
        <div className="reassurance-item">🚚 <strong>Livraison Express</strong></div>
        <div className="reassurance-item">🛡️ <strong>Garantie 24 Mois</strong></div>
        <div className="reassurance-item">🔒 <strong>Paiement Sécurisé</strong></div>
      </section>

      <section style={{ textAlign: "center", padding: "40px 20px 20px" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#333" }}>
          {selectedCategory ? `Collection : ${selectedCategory}` : "Découvrez notre sélection"}
        </h2>
      </section>

      <main className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ cursor: 'pointer' }}>
              <ProductCard product={p} />
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>Aucun article disponible.</div>
        )}
      </main>
    </>
  );
};

export default Accueil;