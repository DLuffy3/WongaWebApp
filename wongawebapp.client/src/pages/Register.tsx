import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import { BackgroundSlideshow } from '../components/BackgroundSlideshow';
import { LoadingOverlay } from '../components/LoadingOverlay';
import logo from '../assets/wonga-logo.svg';
import bgImage1 from '../assets/bg-image1.jpg';
import bgImage2 from '../assets/bg-image2.jpg';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, authLoading } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsSubmitting(false);
            return;
        }

        try {
            await register(formData.firstName, formData.lastName, formData.email, formData.password);
            setSuccessMessage('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const error = err as { response?: { data?: string } };
                setError(error.response?.data || 'Registration failed');
            } else {
                setError('Registration failed');
            }
        }
    };

    const backgroundImages = [bgImage1, bgImage2];

    return (
        <>
            <LoadingOverlay show={authLoading} message="Creating your account..." />

            <BackgroundSlideshow images={backgroundImages} interval={6000}>
                <div className="w-full max-w-md">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={logo}
                                    alt="Company Logo"
                                    className="h-16 w-auto"
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Create Account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Join us today
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        name="firstName"
                                        type="text"
                                        required
                                        disabled={authLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <input
                                        name="lastName"
                                        type="text"
                                        required
                                        disabled={authLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <input
                                name="email"
                                type="email"
                                required
                                disabled={authLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <input
                                name="password"
                                type="password"
                                required
                                disabled={authLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                                placeholder="Password (min. 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                disabled={authLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />

                            {error && (
                                <div className="bg-red-50 text-red-500 text-sm text-center p-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-green-50 text-green-600 text-sm text-center p-3 rounded-lg">
                                    {successMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={authLoading || isSubmitting}
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {authLoading || isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className={`text-sm text-indigo-600 hover:text-indigo-500 font-medium ${authLoading ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    Already have an account? Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </BackgroundSlideshow>
        </>
    );
};