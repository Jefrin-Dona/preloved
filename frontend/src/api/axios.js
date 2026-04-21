import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("📤 Request with token:", {
      endpoint: config.url,
      tokenPrefix: token.substring(0, 20) + "...",
      hasAuth: !!config.headers.Authorization
    });
  } else {
    console.warn("⚠️ No token found in localStorage");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("❌ 403 Forbidden - Authorization failed", {
        url: error.config?.url,
        token: localStorage.getItem("token") ? "Present" : "Missing",
        headers: error.config?.headers
      });
    }
    return Promise.reject(error);
  }
);

export default api;