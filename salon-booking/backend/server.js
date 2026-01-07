import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data
let users = [
    { id: 1, email: 'admin@salon.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: 2, email: 'user@example.com', password: 'user123', role: 'user', name: 'John Doe' }
];

let services = [
    {
        id: 1,
        name: 'Hair Styling',
        description: 'Professional haircuts, styling, and treatments for all hair types',
        price: '$50 - $150',
        duration: '60-90 min',
        category: 'Hair'
    },
    {
        id: 2,
        name: 'Hair Coloring',
        description: 'Full color, highlights, balayage, and color correction services',
        price: '$80 - $250',
        duration: '120-180 min',
        category: 'Hair'
    },
    {
        id: 3,
        name: 'Manicure & Pedicure',
        description: 'Complete nail care with polish, gel, or acrylic options',
        price: '$30 - $80',
        duration: '45-60 min',
        category: 'Nails'
    },
    {
        id: 4,
        name: 'Facial Treatment',
        description: 'Deep cleansing, anti-aging, and hydrating facial treatments',
        price: '$60 - $120',
        duration: '60 min',
        category: 'Skincare'
    },
    {
        id: 5,
        name: 'Massage Therapy',
        description: 'Relaxing full-body massage to relieve stress and tension',
        price: '$70 - $140',
        duration: '60-90 min',
        category: 'Wellness'
    }
];

let bookings = [
    {
        id: 1,
        customerName: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 (555) 123-4567',
        service: 'Hair Styling',
        date: '2026-01-10',
        time: '10:00 AM',
        status: 'confirmed',
        notes: 'First time customer'
    },
    {
        id: 2,
        customerName: 'Mike Chen',
        email: 'mike@example.com',
        phone: '+1 (555) 987-6543',
        service: 'Massage Therapy',
        date: '2026-01-11',
        time: '2:00 PM',
        status: 'pending',
        notes: ''
    },
    {
        id: 3,
        customerName: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 (555) 456-7890',
        service: 'Facial Treatment',
        date: '2026-01-09',
        time: '11:00 AM',
        status: 'completed',
        notes: 'Regular customer'
    }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Salon Booking API is running' });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Signup
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role: 'user'
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ success: true, user: userWithoutPassword });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = users.find(u => u.email === email);

    if (user) {
        // In a real app, send email here
        res.json({ success: true, message: 'Password reset instructions sent to your email' });
    } else {
        // Don't reveal if email exists for security
        res.json({ success: true, message: 'If that email exists, password reset instructions have been sent' });
    }
});

// Get all services
app.get('/api/services', (req, res) => {
    res.json(services);
});

// Get service by ID
app.get('/api/services/:id', (req, res) => {
    const service = services.find(s => s.id === parseInt(req.params.id));
    if (service) {
        res.json(service);
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
});

// Get all bookings (admin only)
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// Get bookings by user email
app.get('/api/bookings/user/:email', (req, res) => {
    const { email } = req.params;
    const userBookings = bookings.filter(b => b.email === email);
    res.json(userBookings);
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (booking) {
        res.json(booking);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
});

// Create new booking
app.post('/api/bookings', (req, res) => {
    const { customerName, email, phone, service, date, time, notes } = req.body;

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

    const newBooking = {
        id: bookings.length + 1,
        customerName,
        email,
        phone,
        service,
        date,
        time,
        notes: notes || '',
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    res.status(201).json({ success: true, booking: newBooking });
});

// Update booking status
app.patch('/api/bookings/:id', (req, res) => {
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(req.params.id));

    if (bookingIndex !== -1) {
        bookings[bookingIndex] = {
            ...bookings[bookingIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        res.json(bookings[bookingIndex]);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(req.params.id));

    if (bookingIndex !== -1) {
        const deletedBooking = bookings.splice(bookingIndex, 1);
        res.json({ message: 'Booking deleted', booking: deletedBooking[0] });
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
});

// Get available time slots for a date
app.get('/api/availability/:date', (req, res) => {
    const { date } = req.params;
    const allSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
        '5:00 PM', '6:00 PM', '7:00 PM'
    ];

    const bookedSlots = bookings
        .filter(b => b.date === date)
        .map(b => b.time);

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ date, availableSlots, bookedSlots });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Salon Booking API running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
});
