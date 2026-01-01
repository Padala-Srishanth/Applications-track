
import axios from 'axios';

// We assume the server is running on port 5003 based on previous attempts.
// In a real app, this would be in an environment variable.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (name, email, password) => {
    return await api.post('/register', { name, email, password });
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const createApplication = async (data: any) => {
    return await api.post('/applications', data);
};

export const getApplication = async (id: string) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
};

export const updateApplication = async (id: string, data: any) => {
    return await api.put(`/applications/${id}`, data);
};

export const deleteApplication = async (id: string) => {
    return await api.delete(`/applications/${id}`);
};

export const getApplications = async () => {
    const response = await api.get('/applications');
    return response.data;
};

export default api;
