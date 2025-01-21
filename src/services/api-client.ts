import axios from "axios";

// Create an Axios instance with default settings
const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // timeout: 10000, // 10 seconds timeout
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
});

// Request interceptor (for authentication tokens)
ApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors globally)
ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default ApiClient;
