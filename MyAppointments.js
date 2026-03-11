import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MyAppointments() {
  const { token, user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user && user.role === "patient") {
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
    });
  };

  const [editing, setEditing] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleReschedule = (id) => {
    if (!newDate || !newTime) {
      alert("Please select date and time");
      return;
    }
    axios.patch(
      `http://localhost:5000/api/appointments/${id}`,
      { date: newDate, time: newTime },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => {
      setAppointments(prev => prev.map(a => (a._id === id ? res.data : a)));
      setEditing(null);
      alert("Appointment rescheduled successfully");
    }).catch(err => {
      alert(err.response?.data?.message || "Rescheduling failed");
    });
  };

  if (!user || user.role !== "patient") {
    return <div className="container mt-5"><div className="alert alert-warning" role="alert">Please log in as a patient to view your appointments.</div></div>;
  }

  const getStatusBadge = (status) => {
    const badges = {
      "Booked": "warning",
      "Completed": "success",
      "Cancelled": "danger",
      "Scheduled": "info"
    };
    return badges[status] || "secondary";
  };

  return (
    <div>
      <div className="bg-primary text-white py-4 mb-4">
        <div className="container">
          <h2 className="fw-bold mb-1">My Appointments</h2>
          <p className="mb-0">Manage your scheduled appointments</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="alert alert-info text-center py-5" role="alert">
            <h5>No appointments found</h5>
            <p>You haven't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {appointments.map(a => (
              <div key={a._id} className="col-md-6 col-lg-5">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title fw-bold mb-0">Dr. {a.doctorId.name}</h5>
                      <span className={`badge bg-${getStatusBadge(a.status)}`}>{a.status}</span>
                    </div>
                    <p className="text-muted mb-3">{a.doctorId.specialization}</p>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">📅 Date & Time</small>
                      <p className="fw-500 mb-0">{a.date} at {a.time}</p>
                    </div>
                    <div className="mb-4">
                      <small className="text-muted d-block mb-1">💰 Consultation Fee</small>
                      <p className="fw-bold text-success mb-0">₹{a.doctorId.fees}</p>
                    </div>
                    {a.status === "Booked" && (
                      <>
                        <button className="btn btn-danger btn-sm w-100 mb-2" onClick={() => updateStatus(a._id, "Cancelled")}>Cancel Appointment</button>
                        <button className="btn btn-secondary btn-sm w-100" onClick={() => setEditing(a._id)}>Reschedule</button>
                      </>
                    )}
                    {editing === a._id && (
                      <div className="mt-3 p-3 bg-light rounded">
                        <div className="mb-2">
                          <label className="form-label fw-500 small">New Date</label>
                          <input type="date" className="form-control form-control-sm" value={newDate} onChange={e=>setNewDate(e.target.value)} />
                        </div>
                        <div className="mb-2">
                          <label className="form-label fw-500 small">New Time</label>
                          <input type="time" className="form-control form-control-sm" value={newTime} onChange={e=>setNewTime(e.target.value)} />
                        </div>
                        <button className="btn btn-success btn-sm w-100 mb-2" onClick={() => handleReschedule(a._id)}>Confirm</button>
                        <button className="btn btn-outline-secondary btn-sm w-100" onClick={() => setEditing(null)}>Cancel</button>
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
