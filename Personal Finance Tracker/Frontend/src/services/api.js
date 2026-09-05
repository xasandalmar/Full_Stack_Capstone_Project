import axios from "axios";

// Helper function to resolve and normalize the API base URL
const getApiBaseUrl = () => {
  const envUrl =
    import.meta.env.VITE_API_URL ||
    (typeof process !== "undefined" && process.env.REACT_APP_API_URL);

  if (!envUrl) {
    return "http://localhost:5000/api";
  }

  // Remove leading/trailing whitespace and trailing slashes
  let cleanUrl = envUrl.trim().replace(/\/+$/, "");

  // Automatically append /api if not already present
  if (!cleanUrl.endsWith("/api")) {
    cleanUrl += "/api";
  }

  return cleanUrl;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  // Normalize config.url to prevent double /api/api prefixes
  if (config.url && config.url.startsWith("/api/")) {
    config.url = config.url.replace(/^\/api/, "");
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error("[API Error]", error.response || error.message || error);
    }
    return Promise.reject(error);
  }
);

export default api;