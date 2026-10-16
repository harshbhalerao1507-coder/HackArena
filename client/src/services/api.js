import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const baseURL = rawBaseURL.endsWith("/api")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL,
});

export default api;