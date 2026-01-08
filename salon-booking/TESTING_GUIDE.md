# Testing Guide - Supabase Integration

## Prerequisites
- ✅ SQL script executed in Supabase
- ✅ Backend server running (`npm start` in backend folder)
- ✅ Frontend running (default Vite dev server)

## Test Scenarios

### 🧪 Test 1: Health Check
**Purpose:** Verify backend is running with Supabase

**Steps:**
1. Open browser or use curl:
   ```
   http://localhost:3001/api/health
   ```

**Expected Result:**
```json
{
  "status": "OK",
  "message": "Salon Booking API is running with Supabase"
}
```

---

### 🧪 Test 2: User Signup
**Purpose:** Verify new user creation in database

**Steps:**
1. Go to Signup page in frontend
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123"
3. Click "Sign Up"

**Expected Result:**
- Success message appears
- Redirected to login page
- Check Supabase Table Editor → users table should have new row

**Database Verification:**
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

---

### 🧪 Test 3: User Login
**Purpose:** Verify login with database lookup + login log creation

**Steps:**
1. Go to Login page
2. Enter credentials:
   - Email: "admin@salon.com"
   - Password: "admin123"
3. Click "Login"

**Expected Result:**
- Success message
- Redirected to Admin Dashboard
- Check Supabase → login_logs table should have new entry

**Database Verification:**
```sql
-- Check login was logged
SELECT * FROM login_logs ORDER BY login_time DESC LIMIT 5;

-- Should show user_id = 1 (admin) with recent timestamp
```

---

### 🧪 Test 4: Create Booking (User)
**Purpose:** Verify booking creation in database

**Steps:**
1. Login as user (user@example.com / user123)
2. Go to Booking page
3. Fill booking form:
   - Name: "Jane Doe"
   - Email: "jane@example.com"
   - Phone: "+1234567890"
   - Service: "Hair Styling"
   - Date: (future date)
   - Time: "2:00 PM"
4. Submit

**Expected Result:**
- Success message
- Booking appears in user's bookings list
- Status: "pending"

**Database Verification:**
```sql
SELECT * FROM bookings WHERE email = 'jane@example.com';
```

---

### 🧪 Test 5: Admin View All Bookings
**Purpose:** Verify fetching all bookings from database

**Steps:**
1. Login as admin (admin@salon.com / admin123)
2. Go to Admin Dashboard
3. View bookings table

**Expected Result:**
- All bookings from database displayed
- Shows booking details, status, actions

**API Test:**
```bash
curl http://localhost:3001/api/bookings
```

---

### 🧪 Test 6: Admin Confirm Booking
**Purpose:** Verify status update in database

**Steps:**
1. Admin Dashboard → Find pending booking
2. Click "Confirm" button
3. Confirm action

**Expected Result:**
- Status changes to "confirmed"
- UI updates immediately
- Database updated

**Database Verification:**
```sql
SELECT id, service, status FROM bookings WHERE status = 'confirmed';
```

---

### 🧪 Test 7: Admin Reject Booking
**Purpose:** Verify status update to rejected

**Steps:**
1. Admin Dashboard → Find pending booking
2. Click "Reject" button
3. Confirm action

**Expected Result:**
- Status changes to "rejected"
- UI updates

**Database Verification:**
```sql
SELECT id, service, status FROM bookings WHERE status = 'rejected';
```

---

### 🧪 Test 8: User Cancel Booking
**Purpose:** Verify deletion from database

**Steps:**
1. Login as user
2. User Dashboard → View bookings
3. Click "Cancel" on a booking
4. Confirm deletion

**Expected Result:**
- Booking removed from list
- Success message

**Database Verification:**
```sql
-- Booking should be deleted
SELECT * FROM bookings WHERE id = <deleted_booking_id>;
-- Should return 0 rows
```

---

### 🧪 Test 9: Admin Dashboard Statistics
**Purpose:** Verify real-time stats from database

**Steps:**
1. Login as admin
2. View Admin Dashboard top section

**Expected Result:**
- Total Users: (count from database)
- Total Logins: (count from database)
- Total Bookings: (count from database)
- Pending/Confirmed/Completed counts

**API Test:**
```bash
curl http://localhost:3001/api/admin/stats
```

**Expected Response:**
```json
{
  "totalUsers": 2,
  "totalLogins": 5,
  "totalBookings": 10,
  "pendingBookings": 3,
  "confirmedBookings": 5,
  "completedBookings": 2
}
```

**Database Verification:**
```sql
-- Count users
SELECT COUNT(*) FROM users;

-- Count logins
SELECT COUNT(*) FROM login_logs;

-- Count bookings by status
SELECT status, COUNT(*) FROM bookings GROUP BY status;
```

---

### 🧪 Test 10: Availability Check
**Purpose:** Verify time slot availability from database

**Steps:**
1. Go to Booking page
2. Select a date
3. View available time slots

**Expected Result:**
- Shows only unbooked slots for that date
- Booked slots are hidden/disabled

**Database Verification:**
```sql
SELECT time FROM bookings WHERE date = '2026-01-10';
-- Returned times should NOT appear in available slots
```

---

### 🧪 Test 11: User Bookings Filter
**Purpose:** Verify per-user booking retrieval

**Steps:**
1. Login as user
2. View User Dashboard

**Expected Result:**
- Only shows bookings for logged-in user's email
- Other users' bookings NOT visible

**API Test:**
```bash
curl http://localhost:3001/api/bookings/user/user@example.com
```

---

### 🧪 Test 12: Duplicate Email Prevention
**Purpose:** Verify unique email constraint

**Steps:**
1. Try to signup with existing email (admin@salon.com)

**Expected Result:**
- Error: "Email already registered"
- User NOT created

---

## Database Queries for Verification

### Check All Tables
```sql
-- Users
SELECT id, name, email, role FROM users;

-- Login Logs
SELECT id, user_id, login_time FROM login_logs ORDER BY login_time DESC LIMIT 10;

-- Bookings
SELECT id, customerName, service, date, time, status FROM bookings ORDER BY created_at DESC;
```

### Statistics Queries
```sql
-- Total counts
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM login_logs) as total_logins,
    (SELECT COUNT(*) FROM bookings) as total_bookings;

-- Bookings by status
SELECT status, COUNT(*) as count FROM bookings GROUP BY status;
```

---

## Troubleshooting

### Issue: "Error creating booking"
**Check:**
- user_id field is optional; can be NULL
- All required fields are filled
- Date is valid format (YYYY-MM-DD)

### Issue: "Invalid credentials"
**Check:**
- Email exists in users table
- Password matches exactly (case-sensitive)
- Run: `SELECT email, password FROM users;`

### Issue: "Error fetching bookings"
**Check:**
- Supabase RLS policies are set correctly
- Tables are created with correct names
- Backend has correct SUPABASE_URL and KEY

### Issue: Stats showing 0
**Check:**
- Tables have data: `SELECT COUNT(*) FROM users;`
- No errors in backend console
- API endpoint working: `curl http://localhost:3001/api/admin/stats`

---

## Success Criteria

✅ All tests pass  
✅ Data persists after server restart  
✅ No frontend code changes needed  
✅ Admin can manage all bookings  
✅ Users can only see their bookings  
✅ Stats reflect real database counts  
✅ Login logs track every login  

---

## Next Steps (Production Ready)

1. **Security:**
   - Implement password hashing (bcrypt)
   - Use environment variables for credentials
   - Implement JWT tokens
   - Use Supabase Auth

2. **Features:**
   - Email notifications
   - Password reset functionality
   - User profile editing
   - Booking history export

3. **Performance:**
   - Add database indexes
   - Implement caching
   - Optimize queries
