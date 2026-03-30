import axios from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/components/types/apiResponse";

const apiClient = axios.create({
  baseURL: "http://localhost:8000", // Update with your FastAPI URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Attach Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Auto-map and Global Error Handling
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns 200/201, return the data directly
    return response;
  },
  (error) => {
    
    const status = error.response?.status;
    const data = error.response?.data as ApiResponse;
    
    // Professional Error Mapping
    const errorMessage = data?.message || "An unexpected error occurred";

    if (status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      // Optional: window.location.href = "/login";
    } else if (status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (status === 400) {
      toast.warning(errorMessage);
    } else {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default apiClient;