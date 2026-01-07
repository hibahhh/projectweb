# 💇 Glamour Salon - Online Booking System

A comprehensive salon booking management system built with React, Node.js, and Express. This project demonstrates full-stack development with role-based access control, CRUD operations, data visualization, and modern UI/UX design.

## ✨ Features

### 🔐 Authentication & Authorization
- **User Signup** - New users can create accounts with email validation
- **User Login** - Secure login with email and password
- **Password Recovery** - Forgot password functionality with email verification
- **Role-Based Access Control** - Two distinct roles:
  - **Admin**: Full access to manage all bookings
  - **User**: Can create and manage their own bookings
- **Protected Routes** - Automatic redirection based on user role
- **Logout** - Secure session termination

### 👤 User Features
- **User Dashboard** - Personalized dashboard showing:
  - Total bookings count
  - Confirmed bookings count
  - Pending bookings count
  - List of all user's appointments
- **Create Bookings** - Book appointments with:
  - Service selection
  - Date and time picker
  - Contact information
  - Additional notes
- **View Booking Status** - Real-time status updates (Pending/Confirmed/Rejected)
- **Cancel Bookings** - Users can cancel their pending bookings

### 👨‍� Admin Features
- **Admin Dashboard** - Comprehensive management interface with:
  - Statistics cards (Total, Pending, Confirmed, Rejected)
  - Interactive charts (Pie chart and Bar chart)
  - Search functionality
  - Filter by status
  - CSV export capability
- **Booking Management**:
  - View all bookings from all users
  - Confirm pending bookings
  - Reject bookings
  - Delete bookings
- **Search & Filter**:
  - Search by customer name, service, or email
  - Filter by status (All/Pending/Confirmed/Rejected)
- **Data Export** - Export bookings to CSV format

### 📊 Data Visualization
- **Pie Chart** - Visual representation of bookings by status
- **Bar Chart** - Status overview with booking counts
- Built with Chart.js for interactive, responsive charts

### ✅ Form Validation
**Client-Side Validation:**
- Required field validation
- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Phone number validation
- Date validation (future dates only)

**Server-Side Validation:**
- Duplicate email check
- Email format verification
- Password strength requirements
- Required fields enforcement
- Date validation

### 🎨 Modern UI/UX Design
- **Neutral Salon Aesthetic** - Soft beige, taupe, and warm gray color palette
- **Responsive Design** - Mobile and desktop optimized
- **Smooth Animations** - Hover effects and transitions
- **Glassmorphism Effects** - Modern card designs with backdrop blur
- **Loading States** - User feedback during async operations
- **Error Handling** - Clear error messages and validation feedback

### 📱 Pages
1. **Home** - Landing page with salon introduction
2. **Services** - Display of available salon services
3. **Booking** - Appointment booking form (protected)
4. **Login** - User authentication
5. **Signup** - New user registration
6. **Forgot Password** - Password recovery
7. **User Dashboard** - User's personal booking management (protected)
8. **Admin Dashboard** - Admin booking management interface (protected)

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **React-ChartJS-2** - React wrapper for Chart.js
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```
The backend server will run on `http://localhost:3001`

### Frontend Setup
```bash
# Navigate to project root
cd salon-booking

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will run on `http://localhost:5173`

## 🔑 Demo Credentials

### Admin Access
- **Email**: admin@salon.com
- **Password**: admin123

### User Access
- **Email**: user@example.com
- **Password**: user123

## � API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Password recovery

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID

### Bookings
- `GET /api/bookings` - Get all bookings (Admin only)
- `GET /api/bookings/user/:email` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Availability
- `GET /api/availability/:date` - Get available time slots

## 🎯 Academic Requirements Met

✅ **User Authentication** - Complete signup, login, logout, password recovery  
✅ **Role-Based Access Control** - Admin and User roles with protected routes  
✅ **CRUD Operations** - Create, Read, Update, Delete bookings  
✅ **Search & Filter** - Search by name/service, filter by status  
✅ **Form Validation** - Client-side and server-side validation  
✅ **Data Visualization** - Charts showing booking statistics  
✅ **Data Export** - CSV export functionality  
✅ **Responsive Design** - Mobile and desktop support  
✅ **Modern UI** - Neutral, elegant salon aesthetic  

## 🚀 Features Breakdown

### CRUD Operations
1. **Create** - Users can create new bookings
2. **Read** - Users view their bookings, admins view all bookings
3. **Update** - Admins can update booking status (confirm/reject)
4. **Delete** - Users can cancel bookings, admins can delete any booking

### Role-Based Access
- **Users** cannot access `/admin` route
- **Admins** cannot access `/user-dashboard` route
- Automatic redirection based on role
- Protected booking route requires authentication

### Booking Status Flow
1. User creates booking → Status: **Pending**
2. Admin reviews booking → Can **Confirm** or **Reject**
3. Status updates reflect immediately on user dashboard
4. Users can only cancel **Pending** bookings

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly interface
- Optimized navigation for small screens

## 🎨 Color Palette
```css
Primary Colors:
- primary-50: #faf8f5 (Lightest beige)
- primary-100: #f5f1ea
- primary-200: #e8dfd0
- primary-300: #d4c4ab
- primary-400: #bda788
- primary-500: #a68a64 (Base taupe)
- primary-600: #8b7355
- primary-700: #6d5a44
- primary-800: #4a3d2e
- primary-900: #2d251c (Darkest brown)
```

## 🔒 Security Features
- Password minimum length enforcement
- Email validation
- Protected routes
- Role-based authorization
- Input sanitization
- Server-side validation

## 📝 Future Enhancements
- Email notifications
- SMS reminders
- Payment integration
- Advanced scheduling (recurring appointments)
- Customer reviews and ratings
- Service provider selection
- Real-time availability checking
- Database integration (MongoDB/PostgreSQL)

## 👨‍💻 Development

### Project Structure
```
salon-booking/
├── backend/
│   ├── server.js          # Express server
│   └── package.json       # Backend dependencies
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Booking.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── UserDashboard.jsx
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## 🐛 Known Limitations
- Uses in-memory storage (data resets on server restart)
- No email actually sent for password recovery
- No real-time updates (requires page refresh)
- Basic authentication (no JWT tokens)

## 📄 License
This project is created for academic purposes.

## 🤝 Contributing
This is an academic project. Contributions are welcome for educational purposes.

---

**Built with ❤️ for academic excellence**
