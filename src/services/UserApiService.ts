
import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/apiResponse";
import { UserSummaryDTO, UserHistoryDTO } from "../types/user";


export const UserApiService = {
  
  getAllUsers: async (): Promise<ApiResponse<UserSummaryDTO[]>> => {
    const response = await apiClient.get<ApiResponse<UserSummaryDTO[]>>("/api/users/admin/all");
    return response.data;
  },

  // get user history by admin (for admin user management)
  getUserHistory: async (userId: string): Promise<ApiResponse<UserHistoryDTO[]>> => {
    const response = await apiClient.get<ApiResponse<UserHistoryDTO[]>>(`/api/users/admin/${userId}/history`);
    return response.data;
  },

  /**
   * Toggle user status or delete user (Optional Admin features)
   */
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/users/admin/${userId}`);
    return response.data;
  },

  // get user history by user (for user dashboard)
  // NEW: Standard user calling their own history profile route
  getSelfProfileHistory: async (): Promise<ApiResponse<UserHistoryDTO>> => {
    const response = await apiClient.get<ApiResponse<UserHistoryDTO>>("/api/users/npkm run devprofile-history");
    return response.data;
  },
};