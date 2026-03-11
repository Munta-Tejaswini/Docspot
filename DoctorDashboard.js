import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function DoctorDashboard() {
  const { token, user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user && user.role === "doctor") {
      axios
        .get("http://localhost:5000/api/appointments", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setAppointments(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token, user]);

  const updateStatus = (id, status) => {
    axios.patch(
      `http://localhost:5000/api/appointments/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => {
      setAppointments(prev => prev.map(a => (a._id === id ? res.data : a)));
      alert(`Appointment marked as ${status}`);
    }).catch(err => {
      alert(err.response?.data?.message || "Failed to update");
    });
  };

  if (!user || user.role !== "doctor") {
    return <div className="container mt-5"><div className="alert alert-warning" role="alert">Please log in as a doctor to view this dashboard.</div></div>;
  }

  const bookedAppointments = appointments.filter(a => a.status === "Booked");
  const completedAppointments = appointments.filter(a => a.status === "Completed");

  return (
    <div>
      <div className="bg-success text-white py-4 mb-4">
        <div className="container">
          <h2 className="fw-bold mb-1">Doctor Dashboard</h2>
          <p className="mb-0">Manage your appointments and patient care</p>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-warning fw-bold">{bookedAppointments.length}</h3>
                <p className="text-muted mb-0">Pending Appointments</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-success fw-bold">{completedAppointments.length}</h3>
                <p className="text-muted mb-0">Completed Consultations</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-info fw-bold">{appointments.length}</h3>
                <p className="text-muted mb-0">Total Appointments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="alert alert-info text-center py-5" role="alert">
            <h5>No appointments scheduled</h5>
            <p>Your appointments will appear here.</p>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {appointments.map(a => (
              <div key={a._id} className="col-md-6">
                <div className={`card h-100 border-0 shadow-sm ${a.status === "Booked" ? "border-warning" : "border-success"}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title fw-bold mb-1">{a.patientId.name}</h5>
                        <small className="text-muted">{a.patientId.email}</small>
                      </div>
                      <span className={`badge ${a.status === "Booked" ? "bg-warning" : a.status === "Completed" ? "bg-success" : "bg-danger"}`}>{a.status}</span>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">📅 Appointment Details</small>
                      <p className="fw-500 mb-0">{a.date} at {a.time}</p>
                    </div>
                    {a.document && (
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">📄 Patient Documents</small>
                        <p className="small text-success mb-0">Document uploaded</p>
                      </div>
                    )}
                    {a.status === "Booked" && (
                      <div className="d-grid gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => updateStatus(a._id, "Completed")}>Mark Completed</button>
                        <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a._id, "Cancelled")}>Cancel Appointment</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
