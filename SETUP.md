# Setup & Installation Guide

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)  
- MongoDB (v4.0+) running locally on port 27017

## Backend Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Ensure MongoDB is Running
MongoDB should be accessible at `mongodb://127.0.0.1:27017/docspot`

**On Windows:**
- If MongoDB is installed, run: `mongod`
- Or use MongoDB Atlas cloud database (update connection string in server.js)

**On Mac:**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

### 3. Start Backend Server
```bash
npm start
# or
node server.js
```

Expected output:
```
MongoDB Connected
Default admin created: admin@docspot.com / admin123
Server running on port 5000
```

If you see errors:
- **"Cannot connect to MongoDB"**: Ensure MongoDB is running
- **"Port 5000 already in use"**: Change port in server.js line 34
- **"Email already registered"**: Database already has admin; this is expected

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at: `http://localhost:3000`

If port 3000 is in use, use: `npm start -- --port 3001`

---

## Testing the Application

### Demo Accounts

**Admin Account:**
- Email: `admin@docspot.com`
- Password: `admin123`

### Test Flow

1. **Admin Login** (admin@docspot.com / admin123)
   - Go to Admin Dashboard
   - Approve doctors when they register

2. **Register as Doctor**
   - Register → Choose "Healthcare Provider (Doctor)"
   - Fill in: Name, Email, Password, Specialization, Experience, Fees
   - Wait for admin approval

3. **Register as Patient**
   - Register → Choose "Patient"
   - Fill in: Name, Email, Password

4. **Patient Workflow**
   - Login as patient
   - Go to "Browse Doctors"
   - Search or filter doctors
   - Click "Book Appointment"
   - Select date, time, upload documents (optional)
   - Confirm booking
   - View appointments in "My Appointments"
   - Reschedule or cancel as needed

5. **Doctor Workflow**
   - Login as doctor (after admin approval)
   - Go to "Doctor Dashboard"
   - View patient appointments
   - Mark as "Completed" or "Cancel"

---

## Troubleshooting

### Backend Issues

**Error: "EADDRINUSE :::5000"**
- Port 5000 is in use. Kill process:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

**Error: "Cannot connect to MongoDB"**
- Ensure MongoDB service is running
- Check connection string in `server/server.js`
- Try connecting directly: `mongo mongodb://127.0.0.1:27017/docspot`

**Error: "ValidationError" when uploading documents**
- Document is stored as Base64 string
- For production, use file storage service (AWS S3, etc.)

### Frontend Issues

**Error: "proxy" not set**
- The app assumes backend is on `localhost:5000`
- If backend is elsewhere, update base URL in component API calls

**Cannot reach server**
- Ensure backend is running (`npm start` in server folder)
- Check if port 5000 is accessible
- Verify no firewall is blocking connections

**AuthContext is undefined**
- Ensure App.js wraps Navbar inside AuthProvider and BrowserRouter
- Check that auth context is properly imported

---

## Project Structure

```
DocSpot_Full_Project_Complete/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Home, Login, Register, Doctors, MyAppointments, etc.
│   │   ├── components/    # Navbar
│   │   ├── context/       # AuthContext for authentication
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── server/                # Express backend
    ├── models/            # User, Doctor, Appointment schemas
    ├── routes/            # API endpoints
    ├── middleware/        # Authentication middleware  
    ├── server.js          # Main server file
    └── package.json
```

---

## Database Collections

After first run, MongoDB will have:

- **users**: Stores patient (role: "patient") and doctor (role: "doctor") user accounts
- **doctors**: Stores doctor profiles linked to users via userId
- **appointments**: Stores appointment bookings

---

## Environment Variables (Optional)

Create a `.env` file in the server folder:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/docspot
JWT_SECRET=your-secret-key
NODE_ENV=development
```

Currently, these are not required - defaults are used.

---

## Features Implemented

✅ User registration (patients & doctors)
✅ JWT-based authentication
✅ Role-based access control (patient, doctor, admin)
✅ Browse and search approved doctors
✅ Book appointments with date/time/documents
✅ View, cancel, and reschedule appointments
✅ Doctor appointment management dashboard
✅ Admin dashboard to approve doctors
✅ Responsive Bootstrap UI
✅ Error handling and validation
✅ Loading states

---

## Future Enhancements

- Email notifications for appointments
- SMS reminders
- Payment integration
- Doctor ratings and reviews
- File upload to cloud storage (AWS S3)
- Real-time availability calendar
- Prescription management
- Telehealth integration

---

For issues or questions, check server/package.json and client/package.json for all installed dependencies.
