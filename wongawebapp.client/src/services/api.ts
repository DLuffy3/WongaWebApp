import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async register(data: RegisterRequest): Promise<User> {
        const response = await api.post<User>('/auth/register', data);
        return response.data;
    },

    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', data);
        if (response.data.token) {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};

export const userService = {
    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/users/users');
        return response.data;
    },
};