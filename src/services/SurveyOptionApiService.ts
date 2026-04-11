
import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/apiResponse";
import { SurveyOptionDTO } from "../types/survey_option";


export const SurveyOptionApiService = {
  // POST /api/options/{category_id}/add-all
  addAll: async (category_id: string, options: SurveyOptionDTO[]): Promise<ApiResponse> => {
    const response = await apiClient.post(`/api/survey-options/${category_id}/add-all`, options);
    return response.data;
  },

  // GET /api/options/by-category/{category_id}
  getByCategory: async (category_id : string): Promise<ApiResponse<SurveyOptionDTO[]>> => {
    const response = await apiClient.get(`/api/survey-options/by-category/${category_id}`);
    return response.data;
  },

  // DELETE /api/options/{option_id}
  delete: async (option_id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/api/survey-options/${option_id}`);
    return response.data;
  },

  // PUT /api/options/{option_id}
  update: async (option_id: string, data: SurveyOptionDTO): Promise<ApiResponse> => {
    const response = await apiClient.put(`/api/survey-options/${option_id}`, data);
    return response.data;
  }
};