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

// API functions
export const getUserSubmissions = async (userId: string) => {
  const response = await api.get(`/uploads/submissions/${userId}`);
  return response.data;
};

export const getUserStats = async (userId: string) => {
  const response = await api.get(`/uploads/stats/${userId}`);
  return response.data;
};

export const getUserTotalScreenTime = async (userId: string) => {
  const response = await api.get(`/uploads/total-screen-time/${userId}`);
  return response.data;
};

// Admin API functions
export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getDailyStandings = async () => {
  const response = await api.get("/admin/daily-standings");
  return response.data;
};

export const getOverallStandings = async () => {
  const response = await api.get("/admin/overall-standings");
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getWeeklyStandings = async () => {
  const response = await api.get("/admin/weekly-standings");
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export default api;
