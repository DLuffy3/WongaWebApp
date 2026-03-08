import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import { BackgroundSlideshow } from '../components/BackgroundSlideshow';
import { LoadingOverlay } from '../components/LoadingOverlay';
import logo from '../assets/wonga-logo.svg';
import bgImage1 from '../assets/bg-image1.jpg';
import bgImage2 from '../assets/bg-image2.jpg';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, authLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const error = err as { response?: { data?: string } };
                setError(error.response?.data || 'Invalid email or password');
            } else {
                setError('Invalid email or password');
            }
        }
    };

    const backgroundImages = [bgImage1, bgImage2];

    return (
        <>
            <LoadingOverlay show={authLoading} message="Signing in..." />

            <BackgroundSlideshow images={backgroundImages} interval={6000}>
                <div className="w-full max-w-md">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <img src={logo} alt="Logo" className="h-16 w-auto mx-auto mb-4" />
                            </div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Welcome!
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-600">Please Login Below</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        disabled={authLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        disabled={authLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-500 text-sm text-center p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed relative"
                            >
                                {authLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            <div className="text-center">
                                <Link to="/register" className={`text-sm text-indigo-600 hover:text-indigo-500 font-medium ${authLoading ? 'pointer-events-none opacity-50' : ''}`} >
                                    Don't have an account? Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </BackgroundSlideshow>
        </>
    );
};