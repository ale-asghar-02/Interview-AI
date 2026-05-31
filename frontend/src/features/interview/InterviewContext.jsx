import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children}) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [deleteReport, setDeleteReport] = useState(null)
    const [reportStats, setReportStats] = useState("");

    const value = {
        loading , setLoading,
        report , setReport,
        reports , setReports,
        deleteReport , setDeleteReport,
        reportStats , setReportStats
    }

    return (
        <InterviewContext.Provider value={ value }>
            {children}
        </InterviewContext.Provider>
    )
}