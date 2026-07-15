import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Truck, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./LivreurLayout.css";

const LivreurLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="app-shell lv-shell">
      <header className="app-header lv-header">
        <div className="lv-header-inner">
          <Link to="/" className="lv-logo" style={{ textDecoration: "none" }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
              stroke="#009fe3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="lv-logo-text">
              SupplyLink
              <span className="lv-logo-badge">Livreur</span>
            </span>
          </Link>

          <div className="lv-header-right">
            <div className="lv-user">
              <div className="lv-avatar">{user?.prenom?.[0]?.toUpperCase() || "L"}</div>
              <span className="lv-user-name">{user?.prenom} {user?.nom}</span>
            </div>
            <button className="lv-logout-btn" onClick={handleLogout} aria-label="Déconnexion">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="app-body lv-body">
        <Outlet />
      </main>

      <nav className="app-nav lv-nav">
        <Link
          to="/livreur"
          className={`lv-nav-item ${location.pathname === "/livreur" ? "active" : ""}`}
        >
          <Truck size={22} strokeWidth={location.pathname === "/livreur" ? 2.5 : 1.8} />
          <span>Livraisons</span>
        </Link>
      </nav>
    </div>
  );
};

export default LivreurLayout;
