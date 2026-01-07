import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// Auth Context
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: 'Sarah Johnson',
      service: 'Hair Styling',
      date: '2026-01-10',
      time: '10:00 AM',
      status: 'confirmed'
    },
    {
      id: 2,
      customerName: 'Mike Chen',
      service: 'Massage Therapy',
      date: '2026-01-11',
      time: '2:00 PM',
      status: 'pending'
    }
  ]);

  const login = (email, password) => {
    // Mock authentication
    if (email === 'admin@salon.com' && password === 'admin123') {
      setUser({ email, role: 'admin', name: 'Admin User' });
      return { success: true, role: 'admin' };
    } else if (email && password) {
      setUser({ email, role: 'customer', name: email.split('@')[0] });
      return { success: true, role: 'customer' };
    }
    return { success: false };
  };

  const logout = () => {
    setUser(null);
  };

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: bookings.length + 1,
      status: 'pending'
    };
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, bookings, addBooking }}>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">✂</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
              Glamour Salon
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Services
            </Link>
            <Link to="/booking" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Book Now
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default App;
