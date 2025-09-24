import axios from "axios";

const API_BASE = "http://localhost:8080/api";

// Endpoints
export const getSchools = () => axios.get(`${API_BASE}/schools`);
export const getRequests = () => axios.get(`${API_BASE}/requests`);
export const getInventories = () => axios.get(`${API_BASE}/inventories`);
export const getDeliveries = () => axios.get(`${API_BASE}/deliveries`);
