-- ✅ COMPLETE DATABASE FIX - Run this in Supabase SQL Editor
-- This will completely reset and fix all database issues

-- Step 1: Drop all existing tables and policies to start fresh
DROP POLICY IF EXISTS "Allow public all on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public all on login_logs" ON login_logs;
DROP POLICY IF EXISTS "Allow public all on services" ON services;
DROP POLICY IF EXISTS "Allow public update on users" ON users;
DROP POLICY IF EXISTS "Allow public insert on users" ON users;
DROP POLICY IF EXISTS "Allow public read on users" ON users;
DROP POLICY IF EXISTS "Allow public read access on users" ON users;
DROP POLICY IF EXISTS "Allow public insert access on users" ON users;
DROP POLICY IF EXISTS "Allow public update access on users" ON users;
DROP POLICY IF EXISTS "Allow public read access on services" ON services;
DROP POLICY IF EXISTS "Allow public insert access on services" ON services;
DROP POLICY IF EXISTS "Allow public update access on services" ON services;
DROP POLICY IF EXISTS "Allow public delete access on services" ON services;
DROP POLICY IF EXISTS "Allow public insert access on login_logs" ON login_logs;
DROP POLICY IF EXISTS "Allow public read access on login_logs" ON login_logs;
DROP POLICY IF EXISTS "Allow public all access on bookings" ON bookings;

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS login_logs CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Create all tables with proper structure

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Login logs table
CREATE TABLE login_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
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

-- Step 3: Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Step 4: Insert default users
INSERT INTO users (name, email, password, role) VALUES
    ('Admin User', 'admin@salon.com', 'admin123', 'admin'),
    ('John Doe', 'user@example.com', 'user123', 'user');

-- Step 5: Insert default services
INSERT INTO services (name, description, price, duration, category) VALUES
    ('Hair Styling', 'Professional haircuts, styling, and treatments for all hair types', '$50 - $150', '60-90 min', 'Hair'),
    ('Hair Coloring', 'Full color, highlights, balayage, and color correction services', '$80 - $250', '120-180 min', 'Hair'),
    ('Manicure & Pedicure', 'Complete nail care with polish, gel, or acrylic options', '$30 - $80', '45-60 min', 'Nails'),
    ('Facial Treatment', 'Deep cleansing, anti-aging, and hydrating facial treatments', '$60 - $120', '60 min', 'Skincare'),
    ('Massage Therapy', 'Relaxing full-body massage to relieve stress and tension', '$70 - $140', '60-90 min', 'Wellness');

-- Step 6: Insert sample bookings for testing
INSERT INTO bookings (user_id, customerName, email, phone, service, date, time, status, notes) VALUES
    (2, 'Sarah Johnson', 'sarah@example.com', '+1 (555) 123-4567', 'Hair Styling', '2026-01-10', '10:00 AM', 'confirmed', 'First time customer'),
    (2, 'Mike Chen', 'mike@example.com', '+1 (555) 987-6543', 'Massage Therapy', '2026-01-11', '2:00 PM', 'pending', ''),
    (2, 'Emily Davis', 'emily@example.com', '+1 (555) 456-7890', 'Facial Treatment', '2026-01-12', '11:00 AM', 'pending', 'Regular customer');

-- Step 7: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies for public access (using anon key)
-- Users policies
CREATE POLICY "users_select_policy" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_policy" ON users FOR UPDATE USING (true);

-- Services policies (full CRUD access)
CREATE POLICY "services_select_policy" ON services FOR SELECT USING (true);
CREATE POLICY "services_insert_policy" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "services_update_policy" ON services FOR UPDATE USING (true);
CREATE POLICY "services_delete_policy" ON services FOR DELETE USING (true);

-- Login logs policies
CREATE POLICY "login_logs_select_policy" ON login_logs FOR SELECT USING (true);
CREATE POLICY "login_logs_insert_policy" ON login_logs FOR INSERT WITH CHECK (true);

-- Bookings policies (full CRUD access)
CREATE POLICY "bookings_select_policy" ON bookings FOR SELECT USING (true);
CREATE POLICY "bookings_insert_policy" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_update_policy" ON bookings FOR UPDATE USING (true);
CREATE POLICY "bookings_delete_policy" ON bookings FOR DELETE USING (true);

-- Step 9: Verify everything
SELECT 
    '✅ Database setup complete!' as status,
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM services) as services_count,
    (SELECT COUNT(*) FROM bookings) as bookings_count;
