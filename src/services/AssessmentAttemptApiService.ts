
import { TestAttempt } from "@/types/test_attempt";
import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/apiResponse";


export const AssessmentAttemptApiService = {

  takeOptionBasedAssessment: async (payload: {
    category_id: string;
    answers: { question_id: string; option_id: string }[]
  }): Promise<ApiResponse<TestAttempt>> => {

    // Updated path to match your APIRouter prefix + route
    const response = await apiClient.post("/api/test-attempts/option-based", payload);

    return response.data;
  },

  // POST /api/test-attempts/start/
  takeAudioBasedAssessment: async (data: { category_id: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/api/attempts/start/", data);
    return response.data;
  },

  // GET /api/test-attempts/{attempt_id}
  getTestAttemptById: async (attempt_id: string): Promise<ApiResponse<TestAttempt>> =>{
    const response = await apiClient.get(`/api/test-attempts/${attempt_id}`)
    return response.data
  }

}