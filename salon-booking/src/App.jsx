import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ManageServices from './pages/ManageServices';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Context
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, role: data.user.role };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={
              <ProtectedRoute requireAuth={true}>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={
              <ProtectedRoute requireAuth={true} requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <ProtectedRoute requireAuth={true} requireRole="admin">
                <ManageServices />
              </ProtectedRoute>
            } />
            <Route path="/user-dashboard" element={
              <ProtectedRoute requireAuth={true} requireRole="user">
                <UserDashboard />
              </ProtectedRoute>
            } />
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
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-[#E8DAD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-extrabold tracking-tight text-[#3A2F2F]">
              BookMy<span className="text-[#C98C8C]">Salon</span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-[#7A6E6E] hover:text-[#C98C8C] font-medium transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-[#7A6E6E] hover:text-[#C98C8C] font-medium transition-colors">
              Services
            </Link>
            <Link to="/booking" className="text-[#7A6E6E] hover:text-[#C98C8C] font-medium transition-colors">
              Book Now
            </Link>
            {user?.role === 'admin' && (
              <>
                <Link to="/admin" className="text-[#7A6E6E] hover:text-[#C98C8C] font-medium transition-colors">
                  Admin Dashboard
                </Link>
                <Link to="/admin/services" className="text-[#7A6E6E] hover:text-[#C98C8C] font-medium transition-colors">
                  Manage Services
                </Link>
              </>
            )}
            {user?.role === 'user' && (
              <Link to="/user-dashboard" className="text-[#7A6E6E] hover:text-[#C98C8C] font-medium transition-colors">
                My Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-[#7A6E6E] font-medium">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-[#F1E6E2] hover:bg-[#E8DAD5] text-[#3A2F2F] px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default App;

