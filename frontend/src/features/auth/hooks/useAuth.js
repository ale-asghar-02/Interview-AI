import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { login, register, logout, forgotPassword, resetPassword, googleAuth, UserUpdateProfile, UserDeleteAccount } from "../services/authAPI";
import { toast } from "sonner";
import Swal from "sweetalert2";

export const useAuth = () => {
    const { user, setUser, loading, setLoading, updateProfile, setUpdateProfile, deleteAccount, setDeleteAccount} = useContext(AuthContext);

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            toast.success("Registration successful!");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            toast.success("Logged in successfully!");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid email or password.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            toast.success("Logged out successfully!");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleForgetPassword = async ({ email }) => {
        setLoading(true);
        try {
            const data = await forgotPassword({ email });
            toast.success("Password reset link has been sent to your email.");
            return data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send reset email. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async ({ token, password }) => {
        setLoading(true);
        try {
            const data = await resetPassword({ token, password });
            toast.success("Password reset successfully! Please login.");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to reset password. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        googleAuth();
    };

    const handleProfileUpdate = async ({ username, linkedlnURL, GithubURL, userImage }) => {
        setLoading(true);
        try {
            const data = await UserUpdateProfile({ username, linkedlnURL, GithubURL, userImage });
            setUser(data.user);
            setUpdateProfile(data);
            toast.success("Profile updated successfully!");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUserDeleteAccount = async () => {
        setLoading(true);
        try {
            const data = await UserDeleteAccount();
            setUser(null);
            setDeleteAccount(true);
            toast.success("Account deleted successfully!");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete account. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
      const handlePageShow = async (event) => {
        if (event.persisted) {
          try {
            const data = await getMe();
            setUser(data && data.user ? data.user : null);
          } catch (error) {
            setUser(null);
          }
        }
      };

      window.addEventListener('pageshow', handlePageShow);
      return () => window.removeEventListener('pageshow', handlePageShow);
    }, [setUser]);
  
    return { user, updateProfile, loading, handleRegister, handleLogin, handleLogout, handleForgetPassword, handleResetPassword, handleGoogleAuth, handleProfileUpdate, handleUserDeleteAccount };
};