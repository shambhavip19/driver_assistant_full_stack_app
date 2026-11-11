import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const fetchOverview = () => api.get("/overview").then((response) => response.data);
export const fetchTrips = () => api.get("/trips").then((response) => response.data);
export const fetchExpenses = () => api.get("/expenses").then((response) => response.data);
export const fetchInsights = () => api.get("/insights").then((response) => response.data);
export const fetchVehicleProfile = () => api.get("/vehicle-profile").then((response) => response.data);
export const fetchDemandMap = () => api.get("/demand-map").then((response) => response.data);
export const fetchWaitMove = () => api.get("/wait-vs-move").then((response) => response.data);
export const fetchSettings = () => api.get("/settings").then((response) => response.data);
export const evaluateRide = (payload: Record<string, unknown>) =>
  api.post("/ride-evaluator", payload).then((response) => response.data);
