import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Redirect if not logged in or not a user
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'admin') {
            navigate('/admin');
            return;
        }

        fetchUserBookings();
    }, [user, navigate]);

    const fetchUserBookings = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/bookings/user/${user.email}`);
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Booking cancelled successfully');
                fetchUserBookings();
            }
        } catch (error) {
            alert('Error cancelling booking');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${styles[status] || styles.pending}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-stone-600">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-stone-800 mb-2">My Dashboard</h1>
                    <p className="text-stone-600">Welcome back, {user?.name}!</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-stone-600 text-sm font-semibold">Total Bookings</p>
                                <p className="text-3xl font-bold text-stone-800 mt-1">{bookings.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📅</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-stone-600 text-sm font-semibold">Confirmed</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {bookings.filter(b => b.status === 'confirmed').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-stone-600 text-sm font-semibold">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">
                                    {bookings.filter(b => b.status === 'pending').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/booking')}
                        className="btn-primary"
                    >
                        + Book New Appointment
                    </button>
                </div>

                {/* Bookings List */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-stone-800 mb-6">My Appointments</h2>

                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <p className="text-stone-600 text-lg mb-4">No bookings yet</p>
                            <button
                                onClick={() => navigate('/booking')}
                                className="btn-primary"
                            >
                                Book Your First Appointment
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-stone-800">
                                                    {booking.service}
                                                </h3>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                            <div className="space-y-1 text-stone-600">
                                                <p className="flex items-center gap-2">
                                                    <span className="font-semibold">📅 Date:</span>
                                                    {new Date(booking.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="font-semibold">⏰ Time:</span>
                                                    {booking.time}
                                                </p>
                                                {booking.notes && (
                                                    <p className="flex items-center gap-2">
                                                        <span className="font-semibold">📝 Notes:</span>
                                                        {booking.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
