import { UUID } from "crypto";
import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/apiResponse";
import { AssessmentDTO } from "../types/assessment";


export const AssessmentApiService = {

  // GET /api/categories/
  getAll: async (): Promise<ApiResponse<AssessmentDTO[]>> => {
    const response = await apiClient.get("/api/categories/");
    return response.data;
  },

  // GET /api/categories/{id}
  getById: async (category_id: string): Promise<ApiResponse<AssessmentDTO>> => {
    const response = await apiClient.get(`/api/categories/${category_id}/with-detail`);
    return response.data;
  },

  // GET with detailed info (class ranges, questions, options)
    getDetailedById: async (category_id: string): Promise<ApiResponse<AssessmentDTO>> => {
        const response = await apiClient.get(`/api/categories/${category_id}/with-detail`);
        return response.data;
    },

  // POST /api/categories/
  create: async (data: AssessmentDTO): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/api/categories/", data);
    return response.data;
  },

  // DELETE /api/categories/{id}
  delete: async (category_id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/api/categories/${category_id}`);
    return response.data;
  }
};