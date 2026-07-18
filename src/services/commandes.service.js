import api from "./api";

export const createCommande        = (payload)    => api.post("/commandes", payload);
export const verifyStripePayment   = (sessionId)  => api.post("/commandes/verify-stripe", { sessionId });
export const getMyCommandes   = ()           => api.get("/commandes/me");
export const getCommandesAdmin= (params={}) => api.get("/commandes", { params });
export const advanceCommande  = (id)         => api.patch(`/commandes/${id}/advance`);

export const createAvis = (payload) => api.post("/avis", payload);

export const createLitige        = (payload)        => api.post("/litiges", payload);
export const getLitigesAdmin     = ()               => api.get("/litiges");
export const validateLitige      = (id)             => api.patch(`/litiges/${id}/validate`);
export const resolveLitige       = (id, codeRetrait) => api.patch(`/litiges/${id}/resolve`, { codeRetrait });
export const rejectLitige        = (id)             => api.patch(`/litiges/${id}/reject`);
export const getLitigesLivreur   = ()               => api.get("/litiges/livreur");
export const recupereLitige      = (id)             => api.patch(`/litiges/${id}/recupere`);

export const createPromoCheckout  = (data)               => api.post("/promotions", data);
export const verifyPromoPayment   = (sessionId, promoId) => api.post("/promotions/verify-stripe", { sessionId, promoId });
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
