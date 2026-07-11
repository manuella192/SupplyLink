import React, { useState, createContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart, Package, User,
  Search, X, LogIn, Mail, Phone, MapPin,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./ClientLayout.css";

export const CartContext = createContext({ count: 0 });

const NAV = [
  { to: "/panier",    icon: ShoppingCart, label: "Panier",    auth: true },
  { to: "/commandes", icon: Package,      label: "Commandes", auth: true },
  { to: "/profil",    icon: User,         label: "Profil",    auth: true },
];

const ClientLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const [search,      setSearch]      = useState("");
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [cartCount]                   = useState(0);

  const isActive   = (to) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  const isCatalogue = location.pathname.startsWith("/catalogue") || location.pathname.startsWith("/produit");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/catalogue?q=${encodeURIComponent(search.trim())}`);
    setSearchOpen(false);
    setSearch("");
  };

  return (
    <CartContext.Provider value={{ count: cartCount }}>
      <div className="app-shell">

        {/* ══ HEADER ══ */}
        <header className="app-header cl-header">
          <div className="cl-header-inner">

            {/* Logo */}
            <Link to="/" className="cl-logo">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none"
                stroke="#009fe3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span className="cl-logo-text">SupplyLink</span>
            </Link>

            {/* Barre de recherche — centrée */}
            <form className="cl-search-desktop" onSubmit={handleSearch}>
              <Search size={16} className="cl-search-icon" />
              <input
                type="search"
                placeholder="Rechercher un article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="cl-search-input"
              />
              {search && (
                <button type="button" className="cl-search-clear" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Droite : nav + panier + connexion */}
            <div className="cl-header-right">
              <nav className="cl-header-nav">
                <Link to="/"          className={`cl-hnav-link ${isActive("/") ? "active" : ""}`}>Accueil</Link>
                <Link to="/catalogue" className={`cl-hnav-link ${isCatalogue ? "active" : ""}`}>Catalogue</Link>
              </nav>

              <button className="cl-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Rechercher">
                <Search size={20} />
              </button>

              <Link to="/panier" className="cl-icon-btn cl-cart-btn" aria-label="Panier">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="cl-cart-badge">{cartCount}</span>}
              </Link>

              {isAuthenticated ? (
                <Link to="/profil" className="cl-avatar-link">
                  <div className="cl-avatar">{user?.prenom?.[0]?.toUpperCase() || "U"}</div>
                </Link>
              ) : (
                <Link to="/login" className="cl-login-link">
                  <LogIn size={16} />
                  <span>Connexion</span>
                </Link>
              )}
            </div>
          </div>

          {/* Overlay recherche mobile */}
          {searchOpen && (
            <div className="cl-search-overlay">
              <form onSubmit={handleSearch} className="cl-search-overlay-inner">
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={20} />
                </button>
                <input
                  autoFocus
                  type="search"
                  placeholder="Rechercher sur SupplyLink..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="cl-search-input"
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Search size={14} />
                </button>
              </form>
            </div>
          )}
        </header>

        {/* ══ CONTENU ══ */}
        <main className="app-body cl-body">
          <Outlet />
        </main>

        {/* ══ FOOTER ══ */}
        <footer className="cl-footer">
          <div className="cl-footer-inner">

            {/* Col 1 — Brand */}
            <div className="cl-footer-col cl-footer-brand-col">
              <div className="cl-footer-logo">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                  stroke="#009fe3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>SupplyLink</span>
              </div>
              <p className="cl-footer-tagline">
                Votre marketplace de mobilier, décoration et électroménager au Maroc.
              </p>
              <div className="cl-footer-socials">
                <a href="#" className="cl-footer-social" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="cl-footer-social" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 — Navigation */}
            <div className="cl-footer-col">
              <h4 className="cl-footer-col-title">Navigation</h4>
              <ul className="cl-footer-links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/catalogue">Catalogue</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Col 3 — Aide */}
            <div className="cl-footer-col">
              <h4 className="cl-footer-col-title">Aide & Informations</h4>
              <ul className="cl-footer-links">
                <li><Link to="/contact">Service client</Link></li>
                <li><a href="#">Conditions générales de vente</a></li>
                <li><a href="#">Politique de retour</a></li>
                <li><a href="#">Mentions légales</a></li>
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div className="cl-footer-col">
              <h4 className="cl-footer-col-title">Contact</h4>
              <ul className="cl-footer-contact-list">
                <li><Mail size={13} /><span>contact@supplylink.ma</span></li>
                <li><Phone size={13} /><span>+212 6 00 00 00 00</span></li>
                <li><MapPin size={13} /><span>Casablanca, Maroc</span></li>
              </ul>
            </div>
          </div>

          <div className="cl-footer-bottom">
            <span>© 2026 SupplyLink. Tous droits réservés.</span>
            <a href="#">Politique de confidentialité</a>
          </div>
        </footer>

        {/* ══ NAV MOBILE FIXE (actions auth uniquement) ══ */}
        {isAuthenticated && (
          <nav className="app-nav cl-nav">
            {NAV.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`cl-nav-item ${isActive(to) ? "active" : ""}`}
              >
                <Icon size={22} strokeWidth={isActive(to) ? 2.5 : 1.8} />
                <span>{label}</span>
                {to === "/panier" && cartCount > 0 && (
                  <span className="cl-nav-badge">{cartCount}</span>
                )}
              </Link>
            ))}
          </nav>
        )}

      </div>
    </CartContext.Provider>
  );
};

export default ClientLayout;
