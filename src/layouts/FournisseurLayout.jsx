import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingBag, TrendingUp, User, LogOut, Users
} from "lucide-react";
import { useAuth, ROLES } from "../contexts/AuthContext";
import "./FournisseurLayout.css";

const NAV = [
  { to: "/fournisseur",            icon: LayoutDashboard, label: "Accueil"     },
  { to: "/fournisseur/articles",   icon: Package,         label: "Articles"    },
  { to: "/fournisseur/commandes",  icon: ShoppingBag,     label: "Commandes"   },
  { to: "/fournisseur/promotions", icon: TrendingUp,      label: "Promotions"  },
  { to: "/fournisseur/profil",     icon: User,            label: "Profil"      },
];

const FournisseurLayout = () => {
  const { user, logout, hasRole, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to) =>
    to === "/fournisseur"
      ? location.pathname === "/fournisseur"
      : location.pathname.startsWith(to);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell fn-shell">
      {/* ── HEADER ── */}
      <header className="app-header fn-header">
        <div className="fn-header-inner">
          <div className="fn-logo">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
              stroke="#009fe3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="fn-logo-text">
              SupplyLink
              <span className="fn-logo-badge">Vendeur</span>
            </span>
          </div>

          <div className="fn-header-right">
            {/* Switch vers espace client si l'utilisateur a les deux rôles */}
            {hasRole(ROLES.CLIENT) && (
              <button
                className="fn-switch-btn"
                onClick={() => { switchRole(ROLES.CLIENT); navigate("/"); }}
              >
                <Users size={14} />
                Espace client
              </button>
            )}

            <div className="fn-user-info">
              <div className="fn-avatar">
                {user?.prenom?.[0]?.toUpperCase() || "V"}
              </div>
              <div className="fn-user-details">
                <span className="fn-user-name">{user?.prenom} {user?.nom}</span>
                <span className="fn-user-role">Vendeur</span>
              </div>
            </div>

            <button className="fn-logout-btn" onClick={handleLogout} aria-label="Déconnexion">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENU ── */}
      <main className="app-body fn-body">
        <Outlet />
      </main>

      {/* ── NAV BOTTOM ── */}
      <nav className="app-nav fn-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`fn-nav-item ${isActive(to) ? "active" : ""}`}
          >
            <Icon size={22} strokeWidth={isActive(to) ? 2.5 : 1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default FournisseurLayout;
