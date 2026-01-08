import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

function Booking() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);

    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        email: user?.email || '',
        phone: '',
        service: '',
        date: '',
        time: '',
        notes: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/services');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
        '5:00 PM', '6:00 PM', '7:00 PM'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            alert('Please login to book an appointment');
            navigate('/login');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    user_id: user?.id
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitted(true);
                // Redirect to user dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/user-dashboard');
                }, 3000);
            } else {
                setError(data.message || 'Failed to create booking. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Booking Confirmed!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your appointment has been successfully booked. We'll send you a confirmation email shortly.
                    </p>
                    <div className="bg-primary-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-gray-600 mb-1">Service</p>
                        <p className="font-semibold text-gray-800 mb-3">{formData.service}</p>
                        <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                        <p className="font-semibold text-gray-800">{formData.date} at {formData.time}</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary w-full"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                            Book Your Appointment
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Fill out the form below and we'll get you scheduled
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Full Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="label">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        {/* Service Selection */}
                        <div>
                            <label className="label">Select Service *</label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Choose a service...</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.name}>
                                        {service.name} - {service.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date and Time */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Preferred Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Preferred Time *</label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="">Choose a time...</option>
                                    {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label className="label">Additional Notes (Optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="4"
                                className="input-field resize-none"
                                placeholder="Any special requests or preferences..."
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Booking...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-2">📋 Booking Policy</h3>
                    <ul className="text-blue-800 space-y-1 text-sm">
                        <li>• Please arrive 10 minutes before your appointment</li>
                        <li>• Cancellations must be made 24 hours in advance</li>
                        <li>• A confirmation email will be sent to your registered email</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Booking;
