import axios from "axios";

// Replace with your actual backend URL
const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // If you use cookies for admin auth
});


