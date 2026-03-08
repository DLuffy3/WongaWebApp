import React from 'react';
import logo from '../assets/wonga-logo.svg';

interface LoadingOverlayProps {
    message?: string;
    show: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    message = 'Authenticating...',
    show
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-fade-in-up">
                <div className="flex flex-col items-center">
                    <img src={logo} alt="Logo" className="h-16 w-auto mb-6" />
                    <p className="text-lg font-medium text-gray-700 mb-4">{message}</p>
                    <div className="flex space-x-2 mb-6">
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-indigo-600 h-1.5 rounded-full animate-progress"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};