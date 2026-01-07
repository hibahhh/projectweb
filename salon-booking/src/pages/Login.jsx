import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';

function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        setIsLoading(false);

        if (result.success) {
            if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user-dashboard');
            }
        } else {
            setError(result.message || 'Invalid email or password');
        }
    };

    // If already logged in, redirect
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center">
                    <div className="text-6xl mb-4">👋</div>
                    <h2 className="text-3xl font-bold text-stone-800 mb-4">
                        Welcome back, {user.name}!
                    </h2>
                    <p className="text-stone-600 mb-6">
                        You're already logged in.
                    </p>
                    <div className="space-y-3">
                        {user.role === 'admin' ? (
                            <button
                                onClick={() => navigate('/admin')}
                                className="btn-primary w-full"
                            >
                                Go to Admin Dashboard
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/user-dashboard')}
                                    className="btn-primary w-full"
                                >
                                    Go to My Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/booking')}
                                    className="btn-secondary w-full"
                                >
                                    Book Appointment
                                </button>
                            </>
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
                    <div className="inline-block w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mb-4">
                        <span className="text-white text-3xl">🔐</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                            Welcome Back
                        </span>
                    </h1>
                    <p className="text-stone-600">Login to manage your appointments</p>
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

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-stone-200">
                        <p className="text-center text-stone-600 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                    <h3 className="font-bold text-amber-900 mb-2">🔑 Demo Credentials</h3>
                    <div className="text-amber-800 text-sm space-y-2">
                        <div>
                            <p className="font-semibold">Admin Access:</p>
                            <p>Email: admin@salon.com</p>
                            <p>Password: admin123</p>
                        </div>
                        <div className="mt-2">
                            <p className="font-semibold">User Access:</p>
                            <p>Email: user@example.com</p>
                            <p>Password: user123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
