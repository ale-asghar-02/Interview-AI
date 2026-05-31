import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);
    formData.append('resume', resumeFile);

    const response = await api.post('/ai/interview/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getSingleReport = async (reportID) => {
    const response = await api.get(`/ai/interview/report/${reportID}`);
    return response.data;
};

export const getAllReports = async () => {
    const response = await api.get('/ai/interview/reports');
    return response.data;
};

export const deleteSingleReport = async (reportID) => {
    const response = await api.post(`/ai/interview/report/delete/${reportID}`);
    return response.data;
};

export const generateResumePdf = async ({ interviewID }) => {
    const response = await api.post(`/ai/interview/resume/pdf/${interviewID}`, {}, {
        responseType: 'arraybuffer'
    });
    return response.data;
};

export const getInterviewReportStats = async () => {
    const response = await api.get('/ai/interview/report/stats');
    return response.data;
};