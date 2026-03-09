import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const profileService = {
    async uploadPicture(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/profile/picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data.url;
    },

    async removePicture(): Promise<void> {
        await api.delete('/profile/picture');
    }
};