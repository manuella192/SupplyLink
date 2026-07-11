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

export const createPromo   = (payload) => api.post("/promotions", payload);
export const confirmPromo  = (promoId) => api.post("/promotions/confirm", { promoId });
export const getMyPromos   = ()        => api.get("/promotions/me");
export const getPromosAdmin= ()        => api.get("/promotions");
export const cancelPromo   = (id)      => api.delete(`/promotions/${id}`);

export const getUsers     = (params={}) => api.get("/users", { params });
export const toggleUser   = (id)        => api.patch(`/users/${id}/toggle`);
