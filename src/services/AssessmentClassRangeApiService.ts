import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/apiResponse";
import { AssessmentClassRangeDTO } from "../types/assessment_class_range";

export const ClassRangeApiService = {
  // POST /api/assessment-class-ranges/{category_id}
  addAll: async (category_id: string, ranges: AssessmentClassRangeDTO[]): Promise<ApiResponse> => {
    const response = await apiClient.post(`/api/assessment-class-ranges/${category_id}/add-all`, ranges);
    return response.data;
  },

  // GET /api/assessment-class-ranges/by-category-id/{category_id}
  getByCategory: async (category_id: string): Promise<ApiResponse<AssessmentClassRangeDTO[]>> => {
    const response = await apiClient.get(`/api/assessment-class-ranges/by-category-id/${category_id}`);
    return response.data;
  },

    // PUT /api/assessment-class-ranges/{id}
    update: async (range_id: string, data: AssessmentClassRangeDTO): Promise<ApiResponse> => {
        const response = await apiClient.put(`/api/assessment-class-ranges/${range_id}`, data);
        return response.data;
    },

  // DELETE /api/assessment-class-ranges/{id}
  delete: async (category_id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/api/assessment-class-ranges/${category_id}`);
    return response.data;
  }
};