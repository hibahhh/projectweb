# Supabase Integration - Setup Instructions

## ✅ Completed
- ✅ Installed @supabase/supabase-js package
- ✅ Updated backend/server.js with Supabase integration
- ✅ Removed all mock data from backend
- ✅ Created SQL setup script

## 🎯 Next Steps - Database Setup

### Step 1: Create Supabase Tables

1. **Go to your Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/jnoqdufzytezbbfyilyn

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Script**
   - Copy the entire contents of `backend/supabase-setup.sql`
   - Paste it into the SQL editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Tables Created**
   - Click on "Table Editor" in the left sidebar
   - You should see 3 tables:
     - ✅ users
     - ✅ login_logs
     - ✅ bookings

### Step 2: Start the Backend Server

```bash
cd backend
npm start
```

The server should start on http://localhost:3001 with Supabase connection.

### Step 3: Test the Integration

**Default Login Credentials:**
- **Admin Account:**
  - Email: admin@salon.com
  - Password: admin123

- **User Account:**
  - Email: user@example.com
  - Password: user123

## 📊 API Endpoints (No Changes to Frontend Needed)

All existing API endpoints work the same way, now using real database:

### Authentication
- `POST /api/auth/signup` - Creates user in Supabase
- `POST /api/auth/login` - Validates from Supabase + logs to login_logs
- `POST /api/auth/forgot-password` - Password recovery (mock email)

### Bookings
- `GET /api/bookings` - Fetch all bookings (admin)
- `GET /api/bookings/user/:email` - Fetch user's bookings
- `POST /api/bookings` - Create booking in Supabase
- `PATCH /api/bookings/:id` - Update booking status (admin confirm/reject)
- `DELETE /api/bookings/:id` - Delete booking (user cancel)

### Admin Dashboard
- `GET /api/admin/stats` - Get real-time statistics:
  - Total users count
  - Total logins count
  - Total bookings count
  - Pending/Confirmed/Completed booking counts

### Services
- `GET /api/services` - Still using static data (no database needed)

## 🔍 Database Schema

### users table
```sql
id (BIGSERIAL)
name (VARCHAR)
email (VARCHAR) - UNIQUE
password (VARCHAR)
role (VARCHAR) - 'admin' or 'user'
created_at (TIMESTAMPTZ)
```

### login_logs table
```sql
id (BIGSERIAL)
user_id (BIGINT) - FK to users.id
login_time (TIMESTAMPTZ)
```

### bookings table
```sql
id (BIGSERIAL)
user_id (BIGINT) - FK to users.id
customerName (VARCHAR)
email (VARCHAR)
phone (VARCHAR)
service (VARCHAR)
date (DATE)
time (VARCHAR)
status (VARCHAR) - 'pending', 'confirmed', 'completed'
notes (TEXT)
created_at (TIMESTAMPTZ)
```

## 🔐 Security Notes

⚠️ **Important for Production:**
1. The current implementation uses **plain text passwords** for academic purposes
2. For production, implement:
   - Password hashing (bcrypt)
   - Supabase Auth instead of custom authentication
   - Environment variables for credentials
   - Proper RLS (Row Level Security) policies

## 🎨 Frontend - No Changes Required

The frontend remains **exactly the same** because:
- All API endpoints maintain the same structure
- Request/response formats unchanged
- Authentication flow identical
- Only the data source changed (mock → Supabase)

## ✨ What Changed

### Before (Mock Data)
```javascript
let bookings = [...]; // In-memory array
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});
```

### After (Supabase)
```javascript
app.get('/api/bookings', async (req, res) => {
    const { data } = await supabase
        .from('bookings')
        .select('*');
    res.json(data);
});
```

## 🧪 Testing Checklist

After setup, test these features:

- [ ] User signup (creates user in database)
- [ ] User login (creates login_log entry)
- [ ] Create booking (inserts into bookings table)
- [ ] View bookings (fetches from database)
- [ ] Admin confirm/reject booking (updates status)
- [ ] User cancel booking (deletes from database)
- [ ] Admin dashboard stats (shows real counts)

## 🚀 Quick Verify

Test your setup with curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Get admin stats
curl http://localhost:3001/api/admin/stats

# Get all bookings
curl http://localhost:3001/api/bookings
```

## 📝 Notes

- The `user_id` field in bookings table links to the actual user
- Login logs track every successful login
- All operations are now persistent (survive server restarts)
- Admin dashboard shows real-time statistics from the database

---

**You're all set!** Just run the SQL script in Supabase and start the server. ✨
