import React, { useRef, useState } from 'react';
import { profileService } from '../services/profileService';

interface Props {
    currentUrl?: string | null;
    userName: string;
    onUpdate: (url: string) => void;
    onRemove: () => void;
}

export const ProfilePicture: React.FC<Props> = ({
    currentUrl,
    userName,
    onUpdate,
    onRemove
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = () => {
        return userName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File must be less than 5MB');
            return;
        }

        setError('');
        setIsUploading(true);

        try {
            const url = await profileService.uploadPicture(file);
            onUpdate(url);
        } catch (err) {
            setError('Upload failed');
            console.error(err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = async () => {
        if (!confirm('Remove profile picture?')) return;

        setIsUploading(true);
        try {
            await profileService.removePicture();
            onRemove();
        } catch (err) {
            setError('Remove failed');
        } finally {
            setIsUploading(false);
        }
    };

    const imageUrl = currentUrl ? `https://localhost:7177${currentUrl}` : undefined;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                {/* Image or Initials */}
                <div className="w-full h-full rounded-full overflow-hidden bg-indigo-100 border-4 border-white shadow-lg">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={userName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                            <span className="text-3xl font-bold text-white">
                                {getInitials()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Upload/Remove Buttons */}
                {!isUploading && (
                    <div className="absolute bottom-0 right-0 flex space-x-1">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg"
                            title="Upload picture"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        {currentUrl && (
                            <button
                                onClick={handleRemove}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                                title="Remove picture"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Loading Spinner */}
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};