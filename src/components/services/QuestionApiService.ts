import { UUID } from "crypto";
import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/apiResponse";
import { QuestionDTO } from "../types/question";

export const QuestionApiService = {

    // POST /{category_id}/list
    addQuestionsList: async (category_id: string, questions: QuestionDTO[]): Promise<ApiResponse> => {
        const response = await apiClient.post(`/api/questions/${category_id}/list`, questions);
        return response.data;
    },

    // POST /{category_id}/upload-pdf
    uploadPdf: async (category_id: string, file: File): Promise<ApiResponse> => {
        const formData = new FormData();
        formData.append("pdf", file); // Must match 'pdf: UploadFile' in FastAPI
        const response = await apiClient.post(`/api/questions/${category_id}/upload-pdf`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    // GET /category/{category_id}
    getByCategory: async (category_id: string): Promise<ApiResponse<QuestionDTO[]>> => {
        const response = await apiClient.get(`/api/questions/category/${category_id}`);
        return response.data;
    },

    // GET /{question_id}
    getById: async (question_id: string): Promise<ApiResponse<QuestionDTO>> => {
        const response = await apiClient.get(`/api/questions/${question_id}`);
        return response.data;
    },

    // PUT /{question_id}
    update: async (question_id: string, data: QuestionDTO): Promise<ApiResponse> => {
        const response = await apiClient.put(`/api/questions/${question_id}`, data);
        return response.data;
    },

    // DELETE /{question_id}
    delete: async (question_id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/api/questions/${question_id}`);
        return response.data;
    },

    // Utility: Construct Audio URL
    // Since your controller returns raw bytes, we point the <audio> tag to this URL
    getAudioUrl: (questionId: string) => {
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        return `${baseURL}/api/questions/${questionId}/audio`;
    }
};