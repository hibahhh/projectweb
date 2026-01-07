import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.message || 'Failed to send reset instructions');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="card">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">🔑</span>
                        </div>
                        <h2 className="text-3xl font-bold text-stone-800 mb-2">Forgot Password?</h2>
                        <p className="text-stone-600">
                            No worries! Enter your email and we'll send you reset instructions.
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-green-600 text-3xl">✓</span>
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">Check Your Email</h3>
                            <p className="text-stone-600 mb-6">
                                We've sent password reset instructions to <strong>{email}</strong>
                            </p>
                            <Link to="/login" className="btn-primary inline-block">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`input-field ${error ? 'border-red-500' : ''}`}
                                    placeholder="your.email@example.com"
                                />
                                {error && (
                                    <p className="text-red-500 text-sm mt-1">{error}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
