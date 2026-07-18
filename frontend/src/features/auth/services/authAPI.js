import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

export const register = async ({ username, email, password }) => {
    const response = await api.post('/auth/user/register', { username, email, password });
    return response.data;
};

export const login = async ({ email, password }) => {
    const response = await api.post('/auth/user/login', { email, password });
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/user/logout');
    return response.data;
};

export const forgotPassword = async ({ email }) => {
    const response = await api.post('/auth/user/forgot-password', { email });
    return response.data;
};

export const resetPassword = async ({ token, password }) => {
    const response = await api.post(`/auth/user/reset-password/${token}`, { password });
    return response.data;
};

export const googleAuth = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/user/google`;
};

export const getMe = async () => {
    const response = await api.get('/user/get-me');
    return response.data;
};

export const UserUpdateProfile = async ({ username, linkedlnURL, GithubURL, userImage }) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('linkedlnURL', linkedlnURL);
    formData.append('GithubURL', GithubURL);
    if (userImage) {
        formData.append('userImage', userImage);
    }
    const response = await api.post('/user/update-me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const UserDeleteAccount = async () => {
    const response = await api.post('/user/account-delete');
    return response.data;
}