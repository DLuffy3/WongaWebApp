import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { authService } from '../services/api';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        setAuthLoading(true);
        try {
            const response = await authService.login({ email, password });
            setUser(response.user);
            await new Promise(resolve => setTimeout(resolve, 800));
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        setAuthLoading(true);
        try {
            await authService.register({ firstName, lastName, email, password });
            await login(email, password);
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        setLogoutLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            authService.logout();
            setUser(null);
        } finally {
            setLogoutLoading(false);
        }
    };

    const value = {
        user,
        loading,
        authLoading,
        logoutLoading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};