import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/authAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateProfile, setUpdateProfile] = useState('');
    const [deleteAccount, setDeleteAccount] = useState(false);

    useEffect(() => {
        const getMeUserData = async () => {
            try {
                const data = await getMe();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };
        getMeUserData();
    }, []);

    const value = {
        user, setUser,
        loading, setLoading,
        updateProfile, setUpdateProfile,
        deleteAccount, setDeleteAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};