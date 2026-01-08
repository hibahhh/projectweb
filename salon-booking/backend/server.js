import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3001;

// Supabase Configuration
const SUPABASE_URL = 'https://jnoqdufzytezbbfyilyn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MQylqUTv6BGn_tzGiV9_Yg_lb-KJ5qS';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Salon Booking API is running with Supabase' });
});

// Authentication - Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        // Check user credentials
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (error || !users) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Log the login
        await supabase
            .from('login_logs')
            .insert([{ user_id: users.id, login_time: new Date().toISOString() }]);

        // Return user without password
        const { password: _, ...userWithoutPassword } = users;
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        // Create new user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([
                {
                    name,
                    email,
                    password,
                    role: 'user'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Signup error:', error);
            return res.status(500).json({ success: false, message: 'Error creating user' });
        }

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: 'Server error during signup' });
    }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        // Don't reveal if email exists for security
        res.json({ success: true, message: 'If that email exists, password reset instructions have been sent' });
    } catch (err) {
        res.json({ success: true, message: 'If that email exists, password reset instructions have been sent' });
    }
});

// Get all services
app.get('/api/services', async (req, res) => {
    try {
        const { data: services, error } = await supabase
            .from('services')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching services:', error);
            return res.status(500).json({ message: 'Error fetching services' });
        }

        res.json(services || []);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get service by ID
app.get('/api/services/:id', async (req, res) => {
    try {
        const { data: service, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new service (Admin only)
app.post('/api/services', async (req, res) => {
    const { name, description, price, duration, category } = req.body;

    if (!name || !description || !price || !duration || !category) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        const { data: newService, error } = await supabase
            .from('services')
            .insert([{ name, description, price, duration, category }])
            .select()
            .single();

        if (error) {
            console.error('Error creating service:', error);
            return res.status(500).json({ success: false, message: 'Error creating service' });
        }

        res.status(201).json({ success: true, service: newService });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update service (Admin only)
app.patch('/api/services/:id', async (req, res) => {
    try {
        const { data: updatedService, error } = await supabase
            .from('services')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ success: true, service: updatedService });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete service (Admin only)
app.delete('/api/services/:id', async (req, res) => {
    try {
        const { data: deletedService, error } = await supabase
            .from('services')
            .delete()
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service deleted', service: deletedService });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings (admin only)
app.get('/api/bookings', async (req, res) => {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching bookings:', error);
            return res.status(500).json({ message: 'Error fetching bookings' });
        }

        res.json(bookings || []);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get bookings by user email
app.get('/api/bookings/user/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user bookings:', error);
            return res.status(500).json({ message: 'Error fetching bookings' });
        }

        res.json(bookings || []);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const { data: booking, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
    const { customerName, email, phone, service, date, time, notes, user_id } = req.body;

    // Server-side validation
    if (!customerName || !email || !phone || !service || !date || !time) {
        return res.status(400).json({
            success: false,
            message: 'All required fields must be filled'
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Phone validation (basic)
    if (phone.length < 10) {
        return res.status(400).json({
            success: false,
            message: 'Phone number must be at least 10 characters'
        });
    }

    // Date validation (must be today or future)
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
        return res.status(400).json({
            success: false,
            message: 'Booking date must be today or in the future'
        });
    }

    try {
        const { data: newBooking, error } = await supabase
            .from('bookings')
            .insert([
                {
                    user_id,
                    customername: customerName,  // PostgreSQL uses lowercase column names
                    email,
                    phone,
                    service,
                    date,
                    time,
                    notes: notes || '',
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating booking:', error);
            return res.status(500).json({ success: false, message: 'Error creating booking' });
        }

        res.status(201).json({ success: true, booking: newBooking });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update booking status (admin confirm/reject)
app.patch('/api/bookings/:id', async (req, res) => {
    try {
        const { data: updatedBooking, error } = await supabase
            .from('bookings')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(updatedBooking);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete booking (user cancel)
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const { data: deletedBooking, error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking deleted', booking: deletedBooking });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get available time slots for a date
app.get('/api/availability/:date', async (req, res) => {
    const { date } = req.params;
    const allSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
        '5:00 PM', '6:00 PM', '7:00 PM'
    ];

    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('time')
            .eq('date', date);

        if (error) {
            console.error('Error fetching availability:', error);
            return res.status(500).json({ message: 'Error fetching availability' });
        }

        const bookedSlots = bookings.map(b => b.time);
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        res.json({ date, availableSlots, bookedSlots });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Dashboard Statistics
app.get('/api/admin/stats', async (req, res) => {
    try {
        // Get total users count
        const { count: totalUsers, error: usersError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        // Get total login count
        const { count: totalLogins, error: loginsError } = await supabase
            .from('login_logs')
            .select('*', { count: 'exact', head: true });

        // Get total bookings count
        const { count: totalBookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });

        // Get bookings by status
        const { data: allBookings, error: statusError } = await supabase
            .from('bookings')
            .select('status');

        const pendingCount = allBookings?.filter(b => b.status === 'pending').length || 0;
        const confirmedCount = allBookings?.filter(b => b.status === 'confirmed').length || 0;
        const completedCount = allBookings?.filter(b => b.status === 'completed').length || 0;

        res.json({
            totalUsers: totalUsers || 0,
            totalLogins: totalLogins || 0,
            totalBookings: totalBookings || 0,
            pendingBookings: pendingCount,
            confirmedBookings: confirmedCount,
            completedBookings: completedCount
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Salon Booking API running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Connected to Supabase`);
});
