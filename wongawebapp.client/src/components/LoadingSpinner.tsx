import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    fullScreen?: boolean;
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'indigo-600',
    fullScreen = false,
    message = 'Loading...'
}) => {
    const sizeClasses = {
        small: 'h-6 w-6 border-2',
        medium: 'h-12 w-12 border-4',
        large: 'h-16 w-16 border-4',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center">
            <div className={`${sizeClasses[size]} border-gray-200 border-t-${color} rounded-full animate-spin`} />
            {message && <p className="mt-4 text-gray-600 animate-pulse">{message}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
};