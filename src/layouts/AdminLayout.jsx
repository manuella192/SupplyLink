import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, ShoppingBag, Package,
  TrendingUp, AlertTriangle, LogOut, Menu, X
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./AdminLayout.css";

const NAV = [
  { to: "/admin",               icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/admin/utilisateurs",  icon: Users,           label: "Utilisateurs"    },
  { to: "/admin/commandes",     icon: ShoppingBag,     label: "Commandes"       },
  { to: "/admin/articles",      icon: Package,         label: "Articles"        },
  { to: "/admin/promotions",    icon: TrendingUp,      label: "Promotions"      },
  { to: "/admin/litiges",       icon: AlertTriangle,   label: "Litiges"         },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const loc      = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (to) =>
    to === "/admin"
      ? loc.pathname === "/admin"
      : loc.pathname.startsWith(to);

  const handleLogout = () => { logout(); navigate("/login"); };

  const currentLabel = NAV.find((n) => isActive(n.to))?.label || "Admin";

  return (
    <div className="admin-shell">
      {/* Overlay mobile */}
      {open && <div className="sidebar-overlay open" onClick={() => setOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="adm-sidebar-header">
          <Link to="/" className="adm-logo" style={{ textDecoration: "none" }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
              stroke="#009fe3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <div>
              <span className="adm-logo-name">SupplyLink</span>
              <span className="adm-logo-sub">Administration</span>
            </div>
          </Link>
          <button className="adm-close-btn" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="adm-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`adm-nav-item ${isActive(to) ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} strokeWidth={isActive(to) ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-user">
            <div className="adm-avatar">{user?.prenom?.[0]?.toUpperCase() || "A"}</div>
            <div className="adm-user-info">
              <span className="adm-user-name">{user?.prenom} {user?.nom}</span>
              <span className="adm-user-role">Administrateur</span>
            </div>
          </div>
          <button className="adm-logout" onClick={handleLogout} aria-label="Déconnexion">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="admin-main">
        {/* Topbar mobile */}
        <div className="adm-topbar">
          <button className="adm-menu-btn" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
          <span className="adm-topbar-title">{currentLabel}</span>
          <div className="adm-avatar-sm">{user?.prenom?.[0]?.toUpperCase() || "A"}</div>
        </div>

        <div className="adm-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
