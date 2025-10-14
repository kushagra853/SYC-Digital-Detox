import axios from "axios";

declare const process: { env?: { API_URL?: string } } | undefined;

const api = axios.create({
  baseURL:
    (typeof process !== "undefined" && process.env?.API_URL) ||
    "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
