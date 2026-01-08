-- Check the actual structure of the bookings table
-- Run this in Supabase SQL Editor to see what columns exist

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
