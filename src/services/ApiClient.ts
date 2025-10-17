import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

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

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = ApiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error?.response?.data?.message;

        if (
          message === "invalid token" &&
          location?.pathname !== "/home/index"
        ) {
          logout();
          navigate("/login", { replace: true });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      ApiClient.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate]);
};
