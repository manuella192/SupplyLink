import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth, ROLES } from "./contexts/AuthContext";

// Layouts
import ClientLayout     from "./layouts/ClientLayout";
import FournisseurLayout from "./layouts/FournisseurLayout";
import AdminLayout      from "./layouts/AdminLayout";

// Pages auth
import Login    from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Pages client
import Accueil         from "./pages/client/Accueil";
import Catalogue       from "./pages/client/Catalogue";
import ProductDetail   from "./pages/client/ProductDetail";
import PanierPage      from "./pages/client/PanierPage";
import CommandesClient from "./pages/client/CommandesClient";
import ProfilClient    from "./pages/client/ProfilClient";
import Contact        from "./pages/client/Contact";

// Pages fournisseur
import DashboardFournisseur from "./pages/fournisseur/DashboardFournisseur";
import ArticlesFournisseur  from "./pages/fournisseur/ArticlesFournisseur";
import CommandesFournisseur from "./pages/fournisseur/CommandesFournisseur";
import PromotionsFournisseur from "./pages/fournisseur/PromotionsFournisseur";
import ProfilFournisseur    from "./pages/fournisseur/ProfilFournisseur";

// Pages admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UsersAdmin     from "./pages/admin/UsersAdmin";
import CommandesAdmin from "./pages/admin/CommandesAdmin";
import ArticlesAdmin  from "./pages/admin/ArticlesAdmin";
import PromosAdmin    from "./pages/admin/PromosAdmin";
import LitigesAdmin   from "./pages/admin/LitigesAdmin";

// -------------------------------------------------------------------
// Gardiens de routes
// -------------------------------------------------------------------

const RequireAuth = ({ children, allowedRoles }) => {
  const { isAuthenticated, activeRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(activeRole))
    return <Navigate to="/" replace />;
  return children;
};

const RedirectIfAuth = ({ children }) => {
  const { isAuthenticated, activeRole } = useAuth();
  if (!isAuthenticated) return children;
  if (activeRole === ROLES.ADMIN)       return <Navigate to="/admin" replace />;
  if (activeRole === ROLES.FOURNISSEUR) return <Navigate to="/fournisseur" replace />;
  return <Navigate to="/" replace />;
};

// -------------------------------------------------------------------
// Arbre de routes
// -------------------------------------------------------------------

const AppRoutes = () => (
  <Routes>
    {/* Auth */}
    <Route path="/login"    element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
    <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

    {/* Espace client (public + authentifié) */}
    <Route element={<ClientLayout />}>
      <Route index element={<Accueil />} />
      <Route path="catalogue" element={<Catalogue />} />
      <Route path="produit/:slug" element={<ProductDetail />} />
      <Route path="contact" element={<Contact />} />
      <Route path="panier" element={
        <RequireAuth allowedRoles={[ROLES.CLIENT]}>
          <PanierPage />
        </RequireAuth>
      } />
      <Route path="commandes" element={
        <RequireAuth allowedRoles={[ROLES.CLIENT]}>
          <CommandesClient />
        </RequireAuth>
      } />
      <Route path="profil" element={
        <RequireAuth allowedRoles={[ROLES.CLIENT]}>
          <ProfilClient />
        </RequireAuth>
      } />
    </Route>

    {/* Espace fournisseur */}
    <Route path="fournisseur" element={
      <RequireAuth allowedRoles={[ROLES.FOURNISSEUR]}>
        <FournisseurLayout />
      </RequireAuth>
    }>
      <Route index element={<DashboardFournisseur />} />
      <Route path="articles"   element={<ArticlesFournisseur />} />
      <Route path="commandes"  element={<CommandesFournisseur />} />
      <Route path="promotions" element={<PromotionsFournisseur />} />
      <Route path="profil"     element={<ProfilFournisseur />} />
    </Route>

    {/* Espace admin */}
    <Route path="admin" element={
      <RequireAuth allowedRoles={[ROLES.ADMIN]}>
        <AdminLayout />
      </RequireAuth>
    }>
      <Route index element={<DashboardAdmin />} />
      <Route path="utilisateurs" element={<UsersAdmin />} />
      <Route path="commandes"    element={<CommandesAdmin />} />
      <Route path="articles"     element={<ArticlesAdmin />} />
      <Route path="promotions"   element={<PromosAdmin />} />
      <Route path="litiges"      element={<LitigesAdmin />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
