-- RUN THIS IN SUPABASE SQL EDITOR TO FIX THE ERRORS
-- This removes the blocking RLS policies and creates proper ones

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "public_users" ON users;
DROP POLICY IF EXISTS "public_services" ON services;
DROP POLICY IF EXISTS "public_logs" ON login_logs;
DROP POLICY IF EXISTS "public_bookings" ON bookings;

DROP POLICY IF EXISTS "Allow public read on users" ON users;
DROP POLICY IF EXISTS "Allow public insert on users" ON users;
DROP POLICY IF EXISTS "Allow public update on users" ON users;
DROP POLICY IF EXISTS "Allow public all on services" ON services;
DROP POLICY IF EXISTS "Allow public read access on services" ON services;
DROP POLICY IF EXISTS "Allow public insert access on services" ON services;
DROP POLICY IF EXISTS "Allow public update access on services" ON services;
DROP POLICY IF EXISTS "Allow public delete access on services" ON services;
DROP POLICY IF EXISTS "Allow public all on login_logs" ON login_logs;
DROP POLICY IF EXISTS "Allow public insert access on login_logs" ON login_logs;
DROP POLICY IF EXISTS "Allow public read access on login_logs" ON login_logs;
DROP POLICY IF EXISTS "Allow public all on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public all access on bookings" ON bookings;

-- Step 2: Disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable with proper permissive policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create permissive policies that allow everything
CREATE POLICY "allow_all_users" ON users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_services" ON services FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_login_logs" ON login_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_bookings" ON bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

SELECT 'RLS policies fixed!' as message;
