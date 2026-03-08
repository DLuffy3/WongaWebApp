import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import { BackgroundSlideshow } from '../components/BackgroundSlideshow';
import logo from '../assets/wonga-logo.svg';
import bgImage1 from '../assets/bg-image1.jpg';
import bgImage2 from '../assets/bg-image2.jpg';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data || 'Invalid credentials');
        }
    };

    return (
        <BackgroundSlideshow images={[bgImage1, bgImage2]} interval={6000}>
            <div className="w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <img src={logo} alt="Logo" className="h-16 w-auto mx-auto mb-4" />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Welcome!
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-600">Please Login Below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
                            Sign In
                        </button>

                        <div className="text-sm text-center">
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Don't have an account? Register
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </BackgroundSlideshow>
    );
};