# 🏥 DocSpot - Seamless Appointment Booking for Health

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-ISC-purple)

## Overview

DocSpot is a comprehensive full-stack appointment booking platform designed to revolutionize how patients interact with healthcare providers. Built with modern web technologies, it offers a seamless experience for patients to browse, book, and manage medical appointments while providing doctors and administrators with powerful management tools.

### 🎯 Key Highlights

- ✅ **Intuitive User Interface** - Beautiful, responsive Bootstrap-based design
- ✅ **Role-Based Access** - Separate workflows for patients, doctors, and admins
- ✅ **Real-time Management** - Instant appointment booking, cancellation, and rescheduling
- ✅ **Doctor Verification** - Admin approval workflow for healthcare providers
- ✅ **Secure Authentication** - JWT-based user authentication
- ✅ **Document Management** - Upload medical documents during booking
- ✅ **Mobile Responsive** - Works seamlessly on all devices

---

## 🚀 Quick Start

### Automated Setup (Recommended)

**Windows:**
```bash
START.bat
```

**Mac/Linux:**
```bash
bash START.ps1
```

### Manual Setup

See [SETUP.md](./SETUP.md) for detailed step-by-step instructions.

---

## 📋 Features

### 👥 **Patient Features**

- **User Registration & Login**
  - Secure signup with email verification
  - Password encryption with bcryptjs
  - JWT-based session management

- **Browse & Search Doctors**
  - Real-time search by name or specialization
  - Filter doctors by availability
  - View doctor details (specialization, experience, consultation fee)
  - See only verified/approved doctors

- **Book Appointments**
  - Select preferred date and time
  - Upload medical documents/history (optional)
  - Instant booking confirmation
  - Real-time availability updates

- **Manage Appointments**
  - View all upcoming appointments
  - Detailed appointment information
  - Reschedule appointments
  - Cancel appointments with status tracking
  - Appointment status tracking (Booked, Completed, Cancelled)

### 👨‍⚕️ **Doctor Features**

- **Registration & Profile**
  - Register with specialization, experience, and fees
  - Profile approval by admin
  - Edit profile information

- **Dashboard**
  - View all assigned appointments
  - See patient information and contact details
  - Access uploaded patient documents
  - Statistics (pending, completed, total appointments)

- **Appointment Management**
  - Mark appointments as completed
  - Cancel appointments if needed
  - Track appointment history
  - Manage patient consultations

### 👨‍💼 **Admin Features**

- **Doctor Management**
  - Review doctor registrations
  - Approve/reject doctors
  - View all registered healthcare providers
  - Filter by approval status
  - Doctor statistics

- **Platform Oversight**
  - Monitor all appointments
  - Ensure compliance with platform policies
  - View system statistics
  - Manage user accounts

---

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI components
- **React Router v6** - Client-side navigation
- **Bootstrap 5** - Responsive design framework
- **Axios** - HTTP client for API calls
- **Context API** - State management for authentication

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing

### DevOps
- **npm** - Package management
- **CORS** - Cross-origin request handling

---

## 📁 Project Structure

```
DocSpot_Full_Project_Complete/
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html              # Main HTML file
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js           # Navigation component
│   │   ├── context/
│   │   │   └── AuthContext.js      # Authentication state
│   │   ├── pages/
│   │   │   ├── Home.js             # Landing page
│   │   │   ├── Login.js            # User login
│   │   │   ├── Register.js         # User registration
│   │   │   ├── Doctors.js          # Browse doctors
│   │   │   ├── MyAppointments.js   # Patient appointments
│   │   │   ├── DoctorDashboard.js  # Doctor panel
│   │   │   └── AdminDashboard.js   # Admin panel
│   │   ├── App.js                  # Main app component
│   │   └── index.js                # React entry point
│   └── package.json
│
├── server/                          # Express Backend
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Doctor.js               # Doctor schema
│   │   └── Appointment.js          # Appointment schema
│   ├── routes/
│   │   ├── userRoutes.js           # /api/users endpoints
│   │   ├── doctorRoutes.js         # /api/doctors endpoints
│   │   └── appointmentRoutes.js    # /api/appointments endpoints
│   ├── .env.example                # Environment variables template
│   ├── server.js                   # Main server file
│   └── package.json
│
├── SETUP.md                         # Detailed setup guide
├── README.md                        # This file
├── START.bat                        # Windows startup script
├── START.ps1                        # PowerShell startup script
└── package.json                     # Workspace config
```

---

## 🔐 Authentication & Security

- **Password Security**: Passwords hashed with bcryptjs (salt rounds: 10)
- **JWT Tokens**: 24-hour expiration for secure session management
- **Role-Based Access Control**: Different permissions for patient, doctor, admin
- **Request Validation**: Input validation on all endpoints
- **CORS Protection**: Enabled for secure cross-origin requests

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("patient" | "doctor" | "admin")
}
```

### Doctors Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  specialization: String,
  experience: Number,
  fees: Number,
  approved: Boolean (default: false)
}
```

### Appointments Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: Doctor),
  date: String (YYYY-MM-DD),
  time: String (HH:MM),
  document: String (Base64 encoded),
  status: String ("Booked" | "Completed" | "Cancelled")
}
```

---

## 🧪 Testing

### Demo Credentials

**Admin Account:**
- Email: `admin@docspot.com`
- Password: `admin123`

### Test Workflow

1. **Admin Approval Process**
   - Login as admin
   - Navigate to Admin Dashboard
   - Wait for doctor registrations
   - Click "Approve" button

2. **Doctor Registration**
   - Go to Register page
   - Select "Healthcare Provider (Doctor)"
   - Fill in specialization, experience, fees
   - Wait for admin approval

3. **Patient Booking**
   - Register as patient
   - Login to browse doctors
   - Search and select doctor
   - Choose date, time, upload documents
   - Confirm booking

4. **Appointment Management**
   - View appointments in "My Appointments"
   - Reschedule by changing date/time
   - Cancel if needed

---

## 🐛 Error Handling

The application includes comprehensive error handling:

- **Frontend**: User-friendly error alerts and validation messages
- **Backend**: Detailed error responses with HTTP status codes
- **Database**: Connection error handling and retry logic
- **Authentication**: Invalid token and unauthorized access handling

---

## 📚 API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user info (protected)

### Doctor Routes (`/api/doctors`)
- `GET /` - List approved doctors (public)
- `GET /all` - List all doctors (admin only)
- `PATCH /:id/approve` - Approve doctor (admin only)
- `PUT /:id` - Update doctor profile (doctor only)

### Appointment Routes (`/api/appointments`)
- `POST /` - Create appointment (patient only)
- `GET /` - Get user's appointments
- `PATCH /:id/status` - Update appointment status (doctor/admin)
- `PATCH /:id` - Reschedule appointment (patient only)

---

## 🚀 Deployment

### Production Checklist

- [ ] Update JWT_SECRET in environment variables
- [ ] Configure MongoDB Atlas cloud database
- [ ] Enable HTTPS for frontend and backend
- [ ] Set up email notifications
- [ ] Configure file storage (AWS S3) for documents
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Set up monitoring and logging
- [ ] Configure CORS for production domain

---

## 🔄 Future Enhancements

- 📧 Email notifications for appointment confirmations
- 📱 SMS reminders before appointments
- 💳 Payment gateway integration
- ⭐ Doctor ratings and reviews
- 📸 Doctor profile pictures
- 🎥 Telehealth/video consultation support
- 📋 Prescription management
- 📊 Analytics dashboard
- 🔔 Push notifications
- 🌍 Multi-language support

---

## 🤝 Support & Contribution

For issues, questions, or contributions:

1. Check the [SETUP.md](./SETUP.md) troubleshooting section
2. Review error messages and logs carefully
3. Ensure MongoDB is running and accessible
4. Verify all dependencies are installed

---

## 📄 License

This project is licensed under the ISC License.

---

## 📝 Notes

- Document uploads are stored as Base64 strings in the database
- For production, migrate to file storage services
- Default admin account is created automatically on first server start
- All timestamps use browser local time
- Email notifications not yet implemented

---

**Built with ❤️ using MERN Stack**

*Last Updated: March 1, 2026*

