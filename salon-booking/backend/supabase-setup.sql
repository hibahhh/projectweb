-- Supabase Database Setup for Salon Booking System
-- Run this SQL in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create login_logs table
CREATE TABLE IF NOT EXISTS login_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@salon.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample user (password: user123)
INSERT INTO users (name, email, password, role) 
VALUES ('John Doe', 'user@example.com', 'user123', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert default services
INSERT INTO services (name, description, price, duration, category) VALUES
    ('Hair Styling', 'Professional haircuts, styling, and treatments for all hair types',' $50 - $150', '60-90 min', 'Hair'),
    ('Hair Coloring', 'Full color, highlights, balayage, and color correction services', '$80 - $250', '120-180 min', 'Hair'),
    ('Manicure & Pedicure', 'Complete nail care with polish, gel, or acrylic options', '$30 - $80', '45-60 min', 'Nails'),
    ('Facial Treatment', 'Deep cleansing, anti-aging, and hydrating facial treatments', '$60 - $120', '60 min', 'Skincare'),
    ('Massage Therapy', 'Relaxing full-body massage to relieve stress and tension', '$70 - $140', '60-90 min', 'Wellness')
ON CONFLICT DO NOTHING;

-- Optional: Insert some sample bookings for testing
INSERT INTO bookings (user_id, customerName, email, phone, service, date, time, status, notes) 
VALUES 
    (2, 'Sarah Johnson', 'sarah@example.com', '+1 (555) 123-4567', 'Hair Styling', '2026-01-10', '10:00 AM', 'confirmed', 'First time customer'),
    (2, 'Mike Chen', 'mike@example.com', '+1 (555) 987-6543', 'Massage Therapy', '2026-01-11', '2:00 PM', 'pending', ''),
    (2, 'Emily Davis', 'emily@example.com', '+1 (555) 456-7890', 'Facial Treatment', '2026-01-09', '11:00 AM', 'completed', 'Regular customer')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're using anon key)
-- Note: In production, you should implement proper authentication with Supabase Auth

-- Policy for users table
CREATE POLICY "Allow public read access on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on users" ON users FOR UPDATE USING (true);

-- Policy for services table
CREATE POLICY "Allow public read access on services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on services" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on services" ON services FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on services" ON services FOR DELETE USING (true);

-- Policy for login_logs table
CREATE POLICY "Allow public insert access on login_logs" ON login_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on login_logs" ON login_logs FOR SELECT USING (true);

-- Policy for bookings table
CREATE POLICY "Allow public all access on bookings" ON bookings FOR ALL USING (true);

-- Confirm setup
SELECT 'Database setup complete!' as message;
