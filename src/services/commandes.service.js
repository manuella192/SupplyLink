import api from "./api";

export const createCommande   = (payload)    => api.post("/commandes", payload);
export const getMyCommandes   = ()           => api.get("/commandes/me");
export const getCommandesAdmin= (params={}) => api.get("/commandes", { params });
export const advanceCommande  = (id)         => api.patch(`/commandes/${id}/advance`);

export const createAvis = (payload) => api.post("/avis", payload);

export const createLitige    = (payload) => api.post("/litiges", payload);
export const getLitigesAdmin = ()        => api.get("/litiges");
export const resolveLitige   = (id, codeRetrait) => api.patch(`/litiges/${id}/resolve`, { codeRetrait });
export const rejectLitige    = (id)              => api.patch(`/litiges/${id}/reject`);

export const createPromoCheckout = (data) => api.post("/promotions", data);
export const getMyPromos         = ()    => api.get("/promotions/me");
export const getPromosAdmin      = ()    => api.get("/promotions");
export const cancelPromo         = (id) => api.delete(`/promotions/${id}`);

export const getFournisseurCommandes = () => api.get("/commandes/fournisseur");
export const getFournisseurStats     = () => api.get("/commandes/fournisseur/stats");
export const getLivreurCommandes     = () => api.get("/commandes/livreur");

export const getUsers              = (params={}) => api.get("/users", { params });
export const toggleUser            = (id)        => api.patch(`/users/${id}/toggle`);
export const createFournisseurUser = (data)      => api.post("/users/fournisseur", data);
export const createLivreurUser     = (data)      => api.post("/users/livreur", data);
