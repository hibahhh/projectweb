# Backend Architecture - Supabase Integration

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                    [No Changes Required]                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests (same endpoints)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                         │
│                     [Updated with Supabase]                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Routes (No changes to endpoints)                        │   │
│  │  • POST /api/auth/signup                                │   │
│  │  • POST /api/auth/login                                 │   │
│  │  • GET  /api/bookings                                   │   │
│  │  • POST /api/bookings                                   │   │
│  │  • PATCH /api/bookings/:id                              │   │
│  │  • DELETE /api/bookings/:id                             │   │
│  │  • GET  /api/admin/stats                                │   │
│  └─────────────────┬───────────────────────────────────────┘   │
│                    │                                            │
│                    │ Supabase Client                            │
│                    ▼                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Database Operations (Replaced mock data)                │   │
│  │  • await supabase.from('users').insert(...)             │   │
│  │  • await supabase.from('bookings').select(...)          │   │
│  │  • await supabase.from('login_logs').insert(...)        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ Supabase SDK
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                            │
│          https://jnoqdufzytezbbfyilyn.supabase.co              │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    users     │  │ login_logs   │  │   bookings   │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ id           │  │ id           │  │ id           │          │
│  │ name         │  │ user_id (FK) │  │ user_id (FK) │          │
│  │ email        │  │ login_time   │  │ customerName │          │
│  │ password     │  └──────────────┘  │ email        │          │
│  │ role         │                    │ phone        │          │
│  │ created_at   │                    │ service      │          │
│  └──────────────┘                    │ date         │          │
│                                      │ time         │          │
│                                      │ status       │          │
│                                      │ notes        │          │
│                                      │ created_at   │          │
│                                      └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. User Signup Flow
```
Frontend → POST /api/auth/signup
           ↓
Backend  → supabase.from('users').insert({ name, email, password, role: 'user' })
           ↓
Database → INSERT INTO users (name, email, password, role)
           ↓
Backend  → Return { success: true, user: {...} }
           ↓
Frontend → Redirect to login
```

### 2. User Login Flow
```
Frontend → POST /api/auth/login
           ↓
Backend  → supabase.from('users').select('*').eq('email', email).eq('password', password)
           ↓
Database → SELECT * FROM users WHERE email = ? AND password = ?
           ↓
Backend  → supabase.from('login_logs').insert({ user_id, login_time })
           ↓
Database → INSERT INTO login_logs (user_id, login_time)
           ↓
Backend  → Return { success: true, user: {...} }
           ↓
Frontend → Store user, redirect to dashboard
```

### 3. Create Booking Flow
```
Frontend → POST /api/bookings
           ↓
Backend  → Validate data
           ↓
Backend  → supabase.from('bookings').insert({ user_id, customerName, ... })
           ↓
Database → INSERT INTO bookings (user_id, customerName, email, service, date, time, status)
           ↓
Backend  → Return { success: true, booking: {...} }
           ↓
Frontend → Show success message
```

### 4. Admin Confirm/Reject Booking
```
Frontend → PATCH /api/bookings/:id (with { status: 'confirmed' })
           ↓
Backend  → supabase.from('bookings').update({ status }).eq('id', id)
           ↓
Database → UPDATE bookings SET status = 'confirmed' WHERE id = ?
           ↓
Backend  → Return updated booking
           ↓
Frontend → Refresh bookings list
```

### 5. Admin Dashboard Statistics
```
Frontend → GET /api/admin/stats
           ↓
Backend  → supabase.from('users').select('*', { count: 'exact', head: true })
           ↓
Backend  → supabase.from('login_logs').select('*', { count: 'exact', head: true })
           ↓
Backend  → supabase.from('bookings').select('*', { count: 'exact', head: true })
           ↓
Database → COUNT queries on each table
           ↓
Backend  → Return { totalUsers, totalLogins, totalBookings, ... }
           ↓
Frontend → Display statistics in dashboard
```

## Key Changes Summary

### ❌ Removed (Mock Data)
```javascript
let users = [...]
let bookings = [...]
bookings.push(...)
bookings.filter(...)
users.find(...)
```

### ✅ Added (Supabase)
```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(URL, KEY)

await supabase.from('users').select('*')
await supabase.from('bookings').insert([...])
await supabase.from('login_logs').insert([...])
```

## Environment

- **Backend**: Node.js + Express (ES Modules)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom (email/password)
- **API Style**: RESTful
- **Frontend**: React (unchanged)
