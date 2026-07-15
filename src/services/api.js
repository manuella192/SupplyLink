import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
});

// Attacher le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sl_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur réponse : rediriger vers /login si 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sl_token");
      localStorage.removeItem("sl_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
