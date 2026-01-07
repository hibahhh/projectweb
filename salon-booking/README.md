# 💇‍♀️ Salon Online Booking System (MVP)

A minimal viable product for a salon booking system with React frontend and Node.js backend.

## 🚀 Features

### Frontend (React + Tailwind CSS)
- **Home Page**: Beautiful landing page with hero section and features
- **Services Page**: Filterable service catalog with detailed information
- **Booking Page**: Comprehensive appointment booking form
- **Login Page**: Mock authentication system
- **Admin Dashboard**: Booking management with statistics and filters

### Backend (Node.js + Express)
- RESTful API with in-memory data storage
- Mock authentication
- Service management
- Booking CRUD operations
- Availability checking

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Install Frontend Dependencies

```bash
cd salon-booking
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend Server (Terminal 1)

```bash
cd backend
npm start
```

The backend will run on `http://localhost:3001`

### Start Frontend Development Server (Terminal 2)

```bash
cd salon-booking
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 🔐 Demo Credentials

### Admin Access
- **Email**: admin@salon.com
- **Password**: admin123

### Customer Access
- **Email**: Any valid email
- **Password**: Any password

## 📁 Project Structure

```
salon-booking/
├── backend/
│   ├── server.js          # Express server with API routes
│   └── package.json       # Backend dependencies
├── src/
│   ├── pages/
│   │   ├── Home.jsx       # Landing page
│   │   ├── Services.jsx   # Services catalog
│   │   ├── Booking.jsx    # Booking form
│   │   ├── Login.jsx      # Authentication
│   │   └── AdminDashboard.jsx  # Admin panel
│   ├── App.jsx            # Main app with routing
│   ├── index.css          # Tailwind styles
│   └── main.jsx           # Entry point
├── package.json
└── README.md
```

## 🎨 UI Features

- Responsive design for all screen sizes
- Modern gradient color scheme (purple/pink)
- Smooth animations and transitions
- Glassmorphism effects
- Interactive hover states
- Premium aesthetic design

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Availability
- `GET /api/availability/:date` - Get available time slots

## ⚠️ Limitations (MVP)

This is a minimal viable product with the following limitations:

- ✗ No payment integration
- ✗ No email notifications
- ✗ No database (in-memory storage only)
- ✗ No advanced scheduling features
- ✗ Data resets on server restart

## 🎯 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Payment gateway integration
- Email notifications
- SMS reminders
- Advanced calendar view
- Customer reviews and ratings
- Multi-location support
- Staff management

## 📝 Notes

- All data is stored in memory and will be lost when the server restarts
- The authentication is mock-based for demonstration purposes
- No actual security measures are implemented in this MVP

## 🤝 Contributing

This is an MVP project. Feel free to fork and enhance!

## 📄 License

MIT License - Feel free to use this project for learning and development.
