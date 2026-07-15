import api from "./api";

export const getHomepage  = ()             => api.get("/articles/homepage");
export const getArticles  = (params = {}) => api.get("/articles", { params });
export const getArticle   = (id)           => api.get(`/articles/${id}`);
export const getMyArticles= ()             => api.get("/articles/me/list");
export const createArticle= (formData)     => api.post("/articles", formData);
export const updateArticle= (id, formData) => api.put(`/articles/${id}`, formData);
export const deleteArticle= (id)           => api.delete(`/articles/${id}`);
export const toggleArticle    = (id)           => api.patch(`/articles/${id}/toggle`);
export const getAdminArticles = (params = {}) => api.get("/articles/admin/list", { params });
export const recordView       = (id)           => api.post(`/articles/${id}/view`);
export const getMyStats       = ()             => api.get("/articles/me/stats");
