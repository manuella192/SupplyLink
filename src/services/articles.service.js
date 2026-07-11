import api from "./api";

export const getHomepage  = ()             => api.get("/articles/homepage");
export const getArticles  = (params = {}) => api.get("/articles", { params });
export const getArticle   = (id)           => api.get(`/articles/${id}`);
export const getMyArticles= ()             => api.get("/articles/me/list");
export const createArticle= (formData)     => api.post("/articles", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateArticle= (id, formData) => api.put(`/articles/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteArticle= (id)           => api.delete(`/articles/${id}`);
export const toggleArticle= (id)           => api.patch(`/articles/${id}/toggle`);
