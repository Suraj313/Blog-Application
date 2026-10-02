import axios from "axios";

export const API_BASE_URL =
  typeof __API_BASE_URL__ !== "undefined"
    ? __API_BASE_URL__
    : "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
