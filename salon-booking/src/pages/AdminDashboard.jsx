import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Redirect if not admin
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'admin') {
            navigate('/user-dashboard');
            return;
        }

        fetchAllBookings();
    }, [user, navigate]);

    const fetchAllBookings = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/bookings');
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                alert(`Booking ${newStatus} successfully`);
                fetchAllBookings();
            }
        } catch (error) {
            alert('Error updating booking status');
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to delete this booking?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Booking deleted successfully');
                fetchAllBookings();
            }
        } catch (error) {
            alert('Error deleting booking');
        }
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Status', 'Notes'];
        const csvData = filteredBookings.map(b => [
            b.id,
            b.customerName,
            b.email || '',
            b.phone || '',
            b.service,
            b.date,
            b.time,
            b.status,
            b.notes || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter and search logic
    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' || booking.status === filter;
        const matchesSearch = searchTerm === '' ||
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.email && booking.email.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        rejected: bookings.filter(b => b.status === 'rejected').length
    };

    // Chart data
    const pieChartData = {
        labels: ['Pending', 'Confirmed', 'Rejected'],
        datasets: [{
            data: [stats.pending, stats.confirmed, stats.rejected],
            backgroundColor: ['#fbbf24', '#10b981', '#ef4444'],
            borderColor: ['#f59e0b', '#059669', '#dc2626'],
            borderWidth: 2
        }]
    };

    const barChartData = {
        labels: ['Pending', 'Confirmed', 'Rejected'],
        datasets: [{
            label: 'Number of Bookings',
            data: [stats.pending, stats.confirmed, stats.rejected],
            backgroundColor: ['#fbbf24', '#10b981', '#ef4444'],
        }]
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-stone-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-stone-800 mb-2">Admin Dashboard</h1>
                    <p className="text-stone-600">Manage all salon bookings and appointments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Bookings" value={stats.total} icon="📊" color="primary" />
                    <StatCard title="Pending" value={stats.pending} icon="⏳" color="yellow" />
                    <StatCard title="Confirmed" value={stats.confirmed} icon="✅" color="green" />
                    <StatCard title="Rejected" value={stats.rejected} icon="❌" color="red" />
                </div>

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card">
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Bookings by Status</h3>
                        <div className="h-64 flex items-center justify-center">
                            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Status Overview</h3>
                        <div className="h-64">
                            <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="card mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        {/* Search */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by customer name, service, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            className="btn-secondary whitespace-nowrap"
                        >
                            📥 Export CSV
                        </button>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <FilterButton
                            active={filter === 'all'}
                            onClick={() => setFilter('all')}
                            label="All Bookings"
                            color="primary"
                        />
                        <FilterButton
                            active={filter === 'pending'}
                            onClick={() => setFilter('pending')}
                            label="Pending"
                            color="yellow"
                        />
                        <FilterButton
                            active={filter === 'confirmed'}
                            onClick={() => setFilter('confirmed')}
                            label="Confirmed"
                            color="green"
                        />
                        <FilterButton
                            active={filter === 'rejected'}
                            onClick={() => setFilter('rejected')}
                            label="Rejected"
                            color="red"
                        />
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="card overflow-hidden">
                    <h2 className="text-2xl font-bold text-stone-800 mb-6">
                        Bookings ({filteredBookings.length})
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-stone-50 border-b-2 border-stone-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Service</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200">
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-stone-500">
                                            <div className="text-4xl mb-2">📭</div>
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map(booking => (
                                        <BookingRow
                                            key={booking.id}
                                            booking={booking}
                                            onStatusUpdate={handleStatusUpdate}
                                            onDelete={handleDeleteBooking}
                                        />
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
        primary: 'from-primary-600 to-primary-700',
        yellow: 'from-yellow-500 to-yellow-600',
        green: 'from-green-500 to-green-600',
        red: 'from-red-500 to-red-600'
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

function FilterButton({ active, onClick, label, color }) {
    const colorClasses = {
        primary: active ? 'bg-primary-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
        yellow: active ? 'bg-yellow-500 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
        green: active ? 'bg-green-500 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
        red: active ? 'bg-red-500 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
    };

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${colorClasses[color]}`}
        >
            {label}
        </button>
    );
}

function BookingRow({ booking, onStatusUpdate, onDelete }) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        confirmed: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <tr className="hover:bg-stone-50 transition-colors">
            <td className="px-6 py-4 text-sm font-semibold text-stone-900">
                #{booking.id}
            </td>
            <td className="px-6 py-4 text-sm text-stone-900">
                {booking.customerName}
            </td>
            <td className="px-6 py-4 text-sm text-stone-700">
                <div>{booking.email}</div>
                <div className="text-xs text-stone-500">{booking.phone}</div>
            </td>
            <td className="px-6 py-4 text-sm text-stone-700">
                {booking.service}
            </td>
            <td className="px-6 py-4 text-sm text-stone-700">
                {new Date(booking.date).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-sm text-stone-700">
                {booking.time}
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                    {booking.status === 'pending' && (
                        <>
                            <button
                                onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                                className="text-green-600 hover:text-green-800 font-medium text-sm"
                            >
                                ✓ Confirm
                            </button>
                            <button
                                onClick={() => onStatusUpdate(booking.id, 'rejected')}
                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                                ✗ Reject
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => onDelete(booking.id)}
                        className="text-stone-600 hover:text-stone-800 font-medium text-sm"
                    >
                        🗑 Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default AdminDashboard;
