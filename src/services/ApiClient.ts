import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "https://staging-api.casan.id/api";

const ApiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

// **Request Interceptor** (Attach Token)
ApiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await JSON.parse(localStorage.getItem("token") || "");

      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// **Response Interceptor** (Handle Errors)
ApiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Return response if successful
  (error) => {
    if (error.response) {
      // Server responded with a status code other than 2xx
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        // Optionally, handle token refresh or logout
      } else if (error.response.status === 500) {
        console.error("Server error! Please try again later.");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error! Please check your connection.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default ApiClient;
