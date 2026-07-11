import React, { useState } from "react";

const GestionArticle = ({ products, onAddProduct, onDeleteProduct }) => {
  // Définition de la vue courante : "list" pour le catalogue ou "add" pour le formulaire de création
  const [view, setView] = useState("list"); 
  
  // Modèle d'état initial pour l'ajout d'un produit complet
  const [newProduct, setNewProduct] = useState({ 
    name: "", description: "", price: "", category: "", quantity: "", image: null 
  });

  // Gestion de la lecture de l'image locale importée par l'utilisateur
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Traitement du formulaire d'envoi et publication
  const handlePublish = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert("Veuillez remplir au moins le nom et le prix du produit.");
      return;
    }
    
    // Injection de l'objet produit formaté
    onAddProduct({
      id: Date.now(),
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category || "Général",
      quantity: newProduct.quantity || 1,
      image: newProduct.image || "/assets/canape.jpg", // Image de remplacement automatique si vide
      rating: 5,
      visitors: 0
    });

    // Réinitialisation de l'état local et retour à la liste
    setNewProduct({ name: "", description: "", price: "", category: "", quantity: "", image: null });
    setView("list");
  };

  // Rendu complet du formulaire d'ajout (Si l'état view === "add")
  if (view === "add") {
    return (
      <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
          <button onClick={() => setView("list")} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#009fe3", padding: "0 10px" }}>‹</button>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#009fe3", flex: 1, textAlign: "center", margin: 0, marginRight: "34px" }}>Ajouter Un Nouvel Article</h2>
        </div>

        <form onSubmit={handlePublish} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Nom du Produit *</label>
            <input type="text" style={inputStyle} value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ex: Armoire Premium en chêne" />
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Description</label>
            <textarea style={{ ...inputStyle, height: "90px", resize: "none" }} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Décrivez les dimensions, matériaux, état..." />
          </div>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Prix de vente *</label>
              <div style={{ position: "relative" }}>
                <input type="number" style={{ ...inputStyle, paddingRight: "40px" }} value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="0.00" />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontWeight: "700", color: "#9ca3af", fontSize: "14px" }}>DH</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Quantité dispo</label>
              <input type="number" style={inputStyle} value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} placeholder="1" />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Catégorie de produit</label>
            <input type="text" style={inputStyle} value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="Ex: Mobilier, Luminaire..." />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Image du produit</label>
            <label style={{ 
              border: "2px dashed #009fe3", borderRadius: "12px", padding: "24px", 
              textAlign: "center", backgroundColor: "#f9fafb", cursor: "pointer", display: "block", transition: "all 0.2s"
            }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              {newProduct.image ? (
                <div>
                  <p style={{ fontSize: "13px", color: "#10b981", margin: "0 0 12px 0", fontWeight: "700" }}>✓ Image chargée avec succès</p>
                  <img src={newProduct.image} alt="Aperçu" style={{ width: "100%", maxHeight: "140px", objectFit: "contain", borderRadius: "6px" }} />
                </div>
              ) : (
                <div style={{ padding: "10px 0" }}>
                  <span style={{ display: "block", fontSize: "28px", marginBottom: "8px" }}>📁</span>
                  <span style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#1f2937" }}>Parcourir vos fichiers</span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Formats acceptés: JPG, PNG, WEBP</span>
                </div>
              )}
            </label>
          </div>

          <button type="submit" style={{ backgroundColor: "#009fe3", color: "#fff", border: "none", borderRadius: "25px", padding: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 159, 227, 0.2)", marginTop: "10px" }}>
            Mettre en vente l'article
          </button>
        </form>
      </div>
    );
  }

  // Rendu complet du tableau / liste de gestion des articles (Si l'état view === "list")
  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #f3f4f6", paddingBottom: "15px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>Gestion de mes stocks</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0 0" }}>Pilotez et supprimez vos références de la plateforme</p>
        </div>
        <button onClick={() => setView("add")} style={{ backgroundColor: "#009fe3", border: "none", color: "#ffffff", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "13px", fontWeight: "700", boxShadow: "0 2px 6px rgba(0,159,227,0.15)" }}>
          ➕ Nouvel Article
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ display: "flex", gap: "16px", alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: "16px" }}>
            <img src={product.image} alt={product.name} style={{ width: "75px", height: "75px", objectFit: "cover", borderRadius: "10px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }} />
            
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", backgroundColor: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
                {product.category || "Général"}
              </span>
              <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1f2937", margin: "6px 0 4px 0" }}>{product.name}</h4>
              <span style={{ color: "#009fe3", fontWeight: "700", fontSize: "15px" }}>{product.price} <span style={{ fontSize: "12px", fontWeight: "500" }}>DH</span></span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button 
                onClick={() => onDeleteProduct(product.id)} 
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", padding: "8px", borderRadius: "50%", transition: "background-color 0.2s" }}
                title="Supprimer le produit"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Feuille de style interne pour la standardisation des inputs du formulaire
const inputStyle = { 
  width: "100%", 
  padding: "11px 14px", 
  border: "1px solid #d1d5db", 
  borderRadius: "10px", 
  boxSizing: "border-box", 
  outline: "none",
  fontSize: "14px",
  color: "#1f2937",
  backgroundColor: "#fff",
  transition: "border-color 0.2s"
};

export default GestionArticle;