
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
  takeAudioBasedAssessment: async (attempt_id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`api/test-attempts/voice-based/${attempt_id}`);
    return response.data;
  },

  // GET /api/test-attempts/{attempt_id}
  getTestAttemptById: async (attempt_id: string): Promise<ApiResponse<TestAttempt>> =>{
    const response = await apiClient.get(`/api/test-attempts/${attempt_id}`)
    return response.data
  },

  // POST /api/test-attempts/start-attempt/{category_id}
  startAttempt: async (category_id: string): Promise<ApiResponse<TestAttempt>> => {
    const response = await apiClient.post(`/api/test-attempts/start-attempt/${category_id}`);
    return response.data;
  },

  // Delete attempt (for testing purposes)
  deleteAttempt: async (attempt_id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/api/test-attempts/${attempt_id}`);
    return response.data;
  },

  // Cancel attempt (for user-initiated cancellation)
  cancelAttempt: async (attempt_id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/api/test-attempts/cancel/${attempt_id}`);
    return response.data;
  }


}