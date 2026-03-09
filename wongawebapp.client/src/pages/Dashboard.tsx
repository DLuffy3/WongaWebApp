import React, { useEffect, useState } from 'react';
import { useAuth } from '../context';
import { userService } from '../services/api';
import { ProfilePicture } from '../components/ProfilePicture';
import { LoadingOverlay } from '../components/LoadingOverlay';
import type { User } from '../types';
import logo from '../assets/wonga-logo.svg';

export const Dashboard: React.FC = () => {
    const { user, logout, logoutLoading } = useAuth();
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserDetails();
    }, []);

    const loadUserDetails = async () => {
        try {
            const details = await userService.getCurrentUser();
            setUserDetails(details);
        } catch (error) {
            console.error('Failed to load user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePictureUpdate = (url: string) => {
        setUserDetails(prev => prev ? { ...prev, profilePictureUrl: url } : null);

        const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        storedUser.profilePictureUrl = url;
        sessionStorage.setItem('user', JSON.stringify(storedUser));
    };

    const handlePictureRemove = () => {
        setUserDetails(prev => prev ? { ...prev, profilePictureUrl: null } : null);

        const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        delete storedUser.profilePictureUrl;
        sessionStorage.setItem('user', JSON.stringify(storedUser));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const displayUser = userDetails || user;

    return (
        <>
            <LoadingOverlay show={logoutLoading} message="Signing out..." />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <img src={logo} alt="Logo" className="h-8 w-auto mr-3" />
                                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-700 mr-4">
                                    Welcome, {displayUser?.firstName}!
                                </span>
                                <button
                                    onClick={logout}
                                    disabled={logoutLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {logoutLoading ? 'Signing out...' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="mb-8 flex justify-center">
                            <ProfilePicture
                                currentUrl={displayUser?.profilePictureUrl}
                                userName={`${displayUser?.firstName} ${displayUser?.lastName}`}
                                onUpdate={handlePictureUpdate}
                                onRemove={handlePictureRemove}
                            />
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:px-6 bg-indigo-50">
                                <h3 className="text-lg font-medium text-gray-900">User Information</h3>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">First name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {displayUser?.firstName}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Last name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {displayUser?.lastName}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {displayUser?.email}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};