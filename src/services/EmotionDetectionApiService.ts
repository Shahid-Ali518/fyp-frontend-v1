import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/apiResponse";


export const EmotionDetectionApiService = {

  // POST /api/emotion-detection/upload-audio
    predictEmotion: async (formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/api/emotions/predict-emotion", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
  }

}