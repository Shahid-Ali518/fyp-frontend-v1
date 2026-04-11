import apiClient from "../api/apiClient";

export const ReportApiService = {

  downloadReportPDF: async (attemptId: string): Promise<void> => {
    const response = await apiClient.get(`/api/reports/${attemptId}/pdf`, {
      responseType: 'blob', // CRITICAL: Tells Axios to handle binary data
    });

    // Create a hidden link, click it, and remove it to trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Assessment_Report_${attemptId}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};