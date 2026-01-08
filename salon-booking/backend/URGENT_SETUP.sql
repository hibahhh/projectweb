-- Supabase Database Setup - CLEAN VERSION FOR URGENT FIX
-- Copy this ENTIRE script and run it in Supabase SQL Editor

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

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@salon.com', 'admin123', 'admin');

-- Insert test user (password: user123)
INSERT INTO users (name, email, password, role) 
VALUES ('John Doe', 'user@example.com', 'user123', 'user');

-- Insert default services
INSERT INTO services (name, description, price, duration, category) VALUES
    ('Hair Styling', 'Professional haircuts, styling, and treatments for all hair types', '$50 - $150', '60-90 min', 'Hair'),
    ('Hair Coloring', 'Full color, highlights, balayage, and color correction services', '$80 - $250', '120-180 min', 'Hair'),
    ('Manicure & Pedicure', 'Complete nail care with polish, gel, or acrylic options', '$30 - $80', '45-60 min', 'Nails'),
    ('Facial Treatment', 'Deep cleansing, anti-aging, and hydrating facial treatments', '$60 - $120', '60 min', 'Skincare'),
    ('Massage Therapy', 'Relaxing full-body massage to relieve stress and tension', '$70 - $140', '60-90 min', 'Wellness');

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (for public access with anon key)
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public all on services" ON services FOR ALL USING (true);
CREATE POLICY "Allow public all on login_logs" ON login_logs FOR ALL USING (true);
CREATE POLICY "Allow public all on bookings" ON bookings FOR ALL USING (true);

-- Confirm completion
SELECT 'Database setup complete! 4 tables created, 2 users added, 5 services added.' as message;
