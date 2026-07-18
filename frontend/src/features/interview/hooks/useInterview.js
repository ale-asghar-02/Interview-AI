import { useContext, useEffect } from 'react';
import { InterviewContext } from '../InterviewContext.jsx';
import { generateInterviewReport, getSingleReport, getAllReports, deleteSingleReport, generateResumePdf, getInterviewReportStats } from '../services/interviewAPI.js';
import { toast } from "sonner";
import Swal from "sweetalert2";

export const useInterview = () => {
    const { loading, setLoading, report, setReport, reports, setReports, deleteReport, setDeleteReport, reportStats, setReportStats } = useContext(InterviewContext);

    const handleGenerateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(data);
            toast.success("Interview report generated successfully!");
            return data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to generate report. Please try again.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleSingleReport = async (reportID) => {
        setLoading(true);
        try {
            const data = await getSingleReport(reportID);
            setReport(data);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch report. Please try again.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReport = async (reportId) => {
        const result = await Swal.fire({
            title: "Delete Report",
            text: "Are you sure you want to delete this report? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return false;

        setLoading(true);
        try {
            const data = await deleteSingleReport(reportId);
            setDeleteReport(data);
            setReports(prev => prev.filter(r => r._id !== reportId));
            toast.success("Report deleted successfully!");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete report. Please try again.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateResumePdf = async (interviewID) => {
        if (!interviewID) return;
        setLoading(true);
        try {
            const data = await generateResumePdf({ interviewID });
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${interviewID}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Resume PDF downloaded successfully!");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to download resume PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReportStats = async () => {
        setLoading(true);
        try {
            const data = await getInterviewReportStats();
            setReportStats(data);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch report stats. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getReportData = async () => {
            setLoading(true);
            try {
                const data = await getAllReports();
                if (data && data.interviewReports) {
                    setReports(data.interviewReports);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to fetch reports. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        getReportData();
    }, []);

    return { loading, report, reports, deleteReport, reportStats, handleGenerateReport, handleSingleReport, handleDeleteReport, handleGenerateResumePdf, fetchReportStats };
};