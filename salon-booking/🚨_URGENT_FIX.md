# 🚨 URGENT FIX - Supabase Not Working

## ❌ Current Problem:
- Login fails: 401 (Unauthorized)
- Signup fails: 500 (Internal Server Error)
- **Root Cause**: Supabase database tables NOT created yet!

## ✅ SOLUTION - Run This SQL Script NOW:

### Option 1: Copy-Paste (FASTEST - 2 minutes)

1. **Login to Supabase**: https://supabase.com/dashboard
2. **Navigate to your project**: https://supabase.com/dashboard/project/jnoqdufzytezbbfyilyn
3. **Click "SQL Editor"** in left sidebar
4. **Click "+ New Query"**
5. **Copy the ENTIRE SQL script below** and paste it:

```sql
-- Supabase Database Setup for Salon Booking System

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS login_logs CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create login_logs table
CREATE TABLE login_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    customerName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Insert admin user
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@salon.com', 'admin123', 'admin');

-- Insert test user
INSERT INTO users (name, email, password, role) 
VALUES ('John Doe', 'user@example.com', 'user123', 'user');

-- Insert default services
INSERT INTO services (name, description, price, duration, category) VALUES
    ('Hair Styling', 'Professional haircuts, styling, and treatments for all hair types', '$50 - $150', '60-90 min', 'Hair'),
    ('Hair Coloring', 'Full color, highlights, balayage, and color correction services', '$80 - $250', '120-180 min', 'Hair'),
    ('Manicure & Pedicure', 'Complete nail care with polish, gel, or acrylic options', '$30 - $80', '45-60 min', 'Nails'),
    ('Facial Treatment', 'Deep cleansing, anti-aging, and hydrating facial treatments', '$60 - $120', '60 min', 'Skincare'),
    ('Massage Therapy', 'Relaxing full-body massage to relieve stress and tension', '$70 - $140', '60-90 min', 'Wellness');

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public all on services" ON services FOR ALL USING (true);
CREATE POLICY "Allow public all on login_logs" ON login_logs FOR ALL USING (true);
CREATE POLICY "Allow public all on bookings" ON bookings FOR ALL USING (true);

SELECT 'Database setup complete!' as message;
```

6. **Click "RUN"** (or press Ctrl+Enter)
7. **Wait for "Success"** message

### Option 2: Use the SQL File

1. Open file: `backend/supabase-setup.sql`
2. Copy ALL contents
3. Follow steps 1-7 above

## ✅ After Running SQL:

### Test Immediately:

1. **Refresh your app**: http://localhost:5173
2. **Try Login**:
   - Email: `admin@salon.com`
   - Password: `admin123`
3. **Should work!** ✅

### What You'll See:

✅ **Login works** - Redirects to Admin Dashboard  
✅ **Admin Dashboard** shows:
   - Total Users: 2
   - Total Logins: 1 (your login)
   - Total Bookings: 0
✅ **Manage Services** - Can add/edit/delete services  
✅ **Booking** - Can create bookings  
✅ **Everything persists!**

## 🔍 Verify Tables Created:

1. In Supabase, click **"Table Editor"**
2. Should see 4 tables:
   - ✅ users (2 rows)
   - ✅ services (5 rows)
   - ✅ login_logs (0 rows - will populate on login)
   - ✅ bookings (0 rows - add via booking page)

## ⏱️ Time Required:
**2 minutes total**

## 🎯 After SQL Runs:

Everything will work:
- ✅ Login/Signup
- ✅ Admin dashboard
- ✅ Booking page
- ✅ Service management
- ✅ User dashboard
- ✅ All statistics

---

## 🚨 IF STILL NOT WORKING AFTER SQL:

Check these:

1. **Backend running?** 
   - Should see: `🚀 Salon Booking API running on http://localhost:3001`
   - Should see: `🗄️ Connected to Supabase`

2. **Frontend running?**
   - Should see: `Local: http://localhost:5173/`

3. **Check browser console** (F12):
   - Should NOT see 500 or 401 errors after SQL runs

4. **Verify Supabase credentials** in `backend/server.js`:
   ```javascript
   const SUPABASE_URL = 'https://jnoqdufzytezbbfyilyn.supabase.co';
   const SUPABASE_ANON_KEY = 'sb_publishable_MQylqUTv6BGn_tzGiV9_Yg_lb-KJ5qS';
   ```

---

**🎉 AFTER RUNNING SQL SCRIPT, EVERYTHING WILL WORK! 🎉**
