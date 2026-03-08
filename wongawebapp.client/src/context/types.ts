import type { User } from '../types';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    authLoading: boolean;
    logoutLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}