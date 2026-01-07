import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useState } from 'react';

function AdminDashboard() {
    const { user, bookings } = useAuth();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    // Redirect if not admin
    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You need admin privileges to access this page.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary w-full"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length
    };

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </span>
                    </h1>
                    <p className="text-gray-600">Manage all salon bookings and appointments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Bookings"
                        value={stats.total}
                        icon="📊"
                        color="blue"
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pending}
                        icon="⏳"
                        color="yellow"
                    />
                    <StatCard
                        title="Confirmed"
                        value={stats.confirmed}
                        icon="✅"
                        color="green"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon="🎉"
                        color="purple"
                    />
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'all'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Bookings
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('confirmed')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'confirmed'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Confirmed
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'completed'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Service</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            <div className="text-4xl mb-2">📭</div>
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map(booking => (
                                        <BookingRow key={booking.id} booking={booking} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        yellow: 'from-yellow-500 to-yellow-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600'
    };

    return (
        <div className={`card bg-gradient-to-br ${colorClasses[color]} text-white`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-90 mb-1">{title}</p>
                    <p className="text-4xl font-bold">{value}</p>
                </div>
                <div className="text-5xl opacity-80">{icon}</div>
            </div>
        </div>
    );
}

function BookingRow({ booking }) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        completed: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                #{booking.id}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
                {booking.customerName}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700">
                {booking.service}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700">
                {booking.date}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700">
                {booking.time}
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View
                    </button>
                    <button className="text-green-600 hover:text-green-800 font-medium text-sm">
                        Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                        Cancel
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default AdminDashboard;
