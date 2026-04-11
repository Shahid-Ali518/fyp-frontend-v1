import apiClient from "@/api/apiClient";
import { ApiResponse } from "@/types/apiResponse";
import { UserLogin, UserRegister, AuthResponse } from "@/types/auth";

export const AuthService = {
  // Now sends UserDTO directly as the request body
  async register(userData: UserRegister): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>("/api/auth/register", userData);
    return response.data;
  },

  // Sends LoginRequestDTO directly
  async login(loginData: UserLogin): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/api/auth/login", loginData);
    
    if (response.data.data?.access_token) {
      localStorage.setItem("token", response.data.data.access_token);
      // Helpful for UI conditional rendering (e.g., Hide 'Admin Panel' for users)
      localStorage.setItem("role", response.data.data.role);
      localStorage.setItem("username", response.data.data.username); 
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }
};