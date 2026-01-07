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
    { id: 2, email: 'user@example.com', password: 'user123', role: 'customer', name: 'John Doe' }
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

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
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
    const newBooking = {
        id: bookings.length + 1,
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
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
