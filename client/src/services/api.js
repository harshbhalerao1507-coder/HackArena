import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    throw new Error("VITE_API_URL is not configured");
}

const api = axios.create({
    baseURL: baseURL.replace(/\/+$/, "").endsWith("/api")
        ? baseURL.replace(/\/+$/, "")
        : `${baseURL.replace(/\/+$/, "")}/api`
});

export default api;