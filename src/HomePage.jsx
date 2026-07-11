import React, { useState, useRef } from "react";
import ProductCard from "./components/ProductCard";
import Accueil from "./pages/Accueil";
import Categorie from "./pages/Categorie";
import Profil from "./pages/Profil";
import Panier from "./pages/Panier";
// En haut de HomePage.jsx, avec les autres imports
import ChatPage from "./pages/ChatPage"; // Ajuste le chemin selon l'endroit où tu as créé le fichier
import DiscussionCenter from "./pages/DiscussionCenter"; // Ajuste le chemin si ton fichier est dans un autre dossier
import "./App.css";

const HomePage = () => {
  // États principaux de l'application
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [chatProduct, setChatProduct] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  

  // Tableau complet des produits de SupplyLink
  const products = [
    { 
      id: 1, 
      name: "Lampe de table de chevet", 
      price: "248 dh", 
      oldPrice: "275.55 dh", 
      discount: "-10%", 
      rating: 4, 
      image: "/assets/lampe.jpg",
      sales: "148 ce mois-ci",
      warranty: "6 mois SupplyLink",
      category: "Décoration"
    },
    { 
      id: 2, 
      name: "Canapé blanc avec detail en bois", 
      price: "2319 dh", 
      oldPrice: "2575.00 dh", 
      discount: "-10%", 
      rating: 4, 
      image: "/assets/canape.jpg",
      sales: "34 ce mois-ci",
      warranty: "12 mois SupplyLink",
      category: "Meubles"
    },
    { 
      id: 3, 
      name: "Table à manger avec 4 chaises", 
      price: "1899 dh", 
      oldPrice: "2110.00 dh", 
      discount: "-10%", 
      rating: 4, 
      image: "/assets/table.jpg",
      sales: "52 ce mois-ci",
      warranty: "24 mois SupplyLink",
      category: "Meubles"
    },
    { 
      id: 4, 
      name: "Bureau en bois moderne", 
      price: "2100 dh", 
      oldPrice: "2333.00 dh", 
      discount: "-10%", 
      rating: 4, 
      image: "/assets/bureau.jpg",
      sales: "89 ce mois-ci",
      warranty: "6 mois SupplyLink",
      category: "Meubles"
    },
    { 
      id: 5, 
      name: "Lit double avec sommier tapissier", 
      price: "4500 dh", 
      oldPrice: "5000.00 dh", 
      discount: "-10%", 
      rating: 5, 
      image: "/assets/lit.jpg",
      sales: "12 ce mois-ci",
      warranty: "12 mois SupplyLink",
      category: "Meubles"
    },
    { 
      id: 6, 
      name: "Armoire de rangement 3 portes", 
      price: "3200 dh", 
      oldPrice: "3555.00 dh", 
      discount: "-10%", 
      rating: 4, 
      image: "/assets/armoire.jpg",
      sales: "27 ce mois-ci",
      warranty: "18 mois SupplyLink",
      category: "Meubles"
    },
    { 
      id: 7, 
      name: "Four encastrable multifonction", 
      price: "2899 dh", 
      oldPrice: "3220.00 dh", 
      discount: "-10%", 
      rating: 5, 
      image: "/assets/four.jpg",
      sales: "65 ce mois-ci",
      warranty: "24 mois SupplyLink",
      category: "Cuisine"
    },
    { 
      id: 8, 
      name: "Réfrigérateur combiné NoFrost", 
      price: "5400 dh", 
      oldPrice: "6000.00 dh", 
      discount: "-10%", 
      rating: 4, 
      image: "/assets/frigo.jpg",
      sales: "18 ce mois-ci",
      warranty: "12 mois SupplyLink",
      category: "Cuisine"
    }
  ];

  // Gestion du panier (initialisé avec un article par défaut)
  const [cartItems, setCartItems] = useState([
    {
      id: 3,
      name: "Table à manger avec 4 chaises",
      price: 1899,
      image: "/assets/table.jpg",
      quantity: 1,
      warranty: "24 mois SupplyLink"
    }
  ]);
  
  const scrollContainerRef = useRef(null);

  // Filtrage des produits selon la catégorie sélectionnée
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  // Fonctions de gestion de l'application
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setActiveTab("home");
    scrollToTop();
  };

  const handleAddToCart = (product, selectedQty) => {
    const numericPrice = typeof product.price === "string" 
      ? parseInt(product.price.replace(/[^\d]/g, ""), 10) 
      : product.price;

    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + selectedQty } 
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: numericPrice,
            image: product.image,
            warranty: product.warranty,
            quantity: selectedQty
          }
        ];
      }
    });

    setNotification(`Article "${product.name}" ajouté au panier !`);
    setTimeout(() => setNotification(""), 2000);
  };
  const handleContact = (product) => {
  // 1. Vérification de sécurité : si le produit est invalide, on arrête tout
  if (!product) {
    console.error("Erreur : Aucun produit n'a été transmis à handleContact.");
    return;
  }

  // 2. Mise à jour de la liste des conversations (si ce produit n'y est pas déjà)
  // On utilise une condition pour ne pas dupliquer la même discussion
  setConversations((prevConversations) => {
    const isAlreadyAdded = prevConversations.find((c) => c.id === product.id);
    if (isAlreadyAdded) {
      return prevConversations;
    }
    return [...prevConversations, product];
  });

  // 3. On définit le produit comme étant celui actuellement en cours de discussion
  // C'est cette ligne qui permet à ChatPage de savoir quoi afficher
  setSelectedConv(product);

  // 4. On change l'onglet actif pour afficher l'interface de discussion
  setActiveTab("discussion");
};

  const updateCartQuantity = (id, amount) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeCartItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="pc-layout" style={{ position: "relative" }}>
      
      {/* ─── HEADER GLOBAL COMPACT PC ─── */}
      <header className="main-header">
        <div className="header-container">
          <div 
            className="logo-section" 
            onClick={() => { setSelectedProduct(null); setSelectedCategory(null); setActiveTab("home"); }} 
            style={{ cursor: 'pointer' }}
          >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#009fe3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span className="brand-name">SupplyLink</span>
          </div>
          
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Rechercher sur SupplyLink" className="search-input" />
            <span className="camera-icon">📷</span>
          </div>

          <div className="header-actions">
            <div className="message-icon" onClick={() => setActiveTab("discussion")} style={{ cursor: "pointer" }}> 
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={activeTab === "panier" ? "#ff4d4f" : "#009fe3"} strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ─── ZONE DE CONTENU DYNAMIQUE MULTI-PAGES ─── */}
      <div className="page-content scrollable-area" ref={scrollContainerRef}>
        
        {activeTab === "home" && (
          <Accueil 
            filteredProducts={filteredProducts}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onOpenChat={(product) => {
    setChatProduct(product); // On mémorise le produit
    setActiveTab("discussion"); // On change d'onglet, ce qui affiche ChatPage
    
  }}
  onOpenChat={handleContact}
          />
        )}

        {activeTab === "categories" && (
          <Categorie onCategorySelect={handleCategorySelect} />
        )}

        {activeTab === "profil" && (
          <Profil setNotification={setNotification} />
        )}

        {activeTab === "panier" && (
          <Panier 
            cartItems={cartItems}
            updateCartQuantity={updateCartQuantity}
            removeCartItem={removeCartItem}
            setSelectedProduct={(prod) => { setSelectedProduct(prod); setActiveTab("home"); scrollToTop(); }}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "discussion" && (
  selectedConv ? (
    // Si un produit est sélectionné, on affiche la page de chat
    <ChatPage 
      product={selectedConv} 
      onBack={() => {
        setSelectedConv(null); // On remet à null pour retourner à la liste
      }} 
    />
  ) : (
    // Sinon, on affiche la liste des discussions (le centre)
    <DiscussionCenter 
      conversations={conversations} 
      onSelectConv={(conv) => setSelectedConv(conv)} 
      onBackToHome={() => setActiveTab("home")}
    />
  )
)}

      </div>

      {/* ─── SYSTEME DE NOTIFICATION POPUP FLOATING ─── */}
      {notification && (
        <div style={{
          position: "fixed",
          bottom: "90px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#009fe3", 
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          zIndex: 3000,
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span>🛒</span> {notification}
        </div>
      )}

      {/* ─── FOOTER FIXED NAVIGATION ─── */}
      <footer className="pc-footer">
        <div className="footer-links">
          <button 
            className={activeTab === "home" ? "active" : ""} 
            onClick={() => { setActiveTab("home"); setSelectedProduct(null); }}
          >
            Accueil
          </button>
          <button 
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => { setActiveTab("categories"); setSelectedProduct(null); }}
          >
            Catégories
          </button>
          <button 
            className={activeTab === "profil" ? "active" : ""} 
            onClick={() => { setActiveTab("profil"); setSelectedProduct(null); }}
          >
            Profil
          </button>
          <button 
            className={activeTab === "panier" ? "active" : ""} 
            onClick={() => setActiveTab("panier")}
          >
            Panier
          </button>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;