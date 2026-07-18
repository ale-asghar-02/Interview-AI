import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/authAPI";
import Loading from "../../routes/Loading";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // sirf initial getMe() ke liye
    const [loading, setLoading] = useState(false);        // login/register/etc actions ke liye
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
                setAuthLoading(false);
            }
        };
        getMeUserData();
    }, []);

    if (authLoading) { return <Loading /> }

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