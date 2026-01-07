import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(formData.email, formData.password);

        if (result.success) {
            if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/booking');
            }
        } else {
            setError('Invalid email or password');
        }
    };

    // If already logged in, redirect
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center">
                    <div className="text-6xl mb-4">👋</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome back, {user.name}!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You're already logged in.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/booking')}
                            className="btn-primary w-full"
                        >
                            Book Appointment
                        </button>
                        {user.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="btn-secondary w-full"
                            >
                                Go to Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-block w-16 h-16 bg-gradient-to-br from-primary-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-white text-3xl">🔐</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                            Welcome Back
                        </span>
                    </h1>
                    <p className="text-gray-600">Login to manage your appointments</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-primary w-full text-lg">
                            Login
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <a href="#" className="text-primary-600 font-semibold hover:underline">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <h3 className="font-bold text-yellow-900 mb-2">🔑 Demo Credentials</h3>
                    <div className="text-yellow-800 text-sm space-y-2">
                        <div>
                            <p className="font-semibold">Admin Access:</p>
                            <p>Email: admin@salon.com</p>
                            <p>Password: admin123</p>
                        </div>
                        <div className="mt-2">
                            <p className="font-semibold">Customer Access:</p>
                            <p>Email: any email</p>
                            <p>Password: any password</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
