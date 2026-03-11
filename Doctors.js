import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Error fetching doctors:", err));
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doc => 
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [search, doctors]);

  const { user, token } = useContext(AuthContext);
  const [showFormFor, setShowFormFor] = useState(null);
  const [form, setForm] = useState({ date: "", time: "", document: null });
  const [loading, setLoading] = useState(false);

  const handleBook = async (doctorId) => {
    if (!user) {
      alert("Please log in first");
      return;
    }
    if (!form.date || !form.time) {
      alert("Please select date and time");
      return;
    }
    try {
      setLoading(true);
      let documentBase64 = "";
      if (form.document) {
        documentBase64 = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(form.document);
        });
      }
      await axios.post(
        "http://localhost:5000/api/appointments",
        { doctorId, date: form.date, time: form.time, document: documentBase64 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment requested successfully!");
      setShowFormFor(null);
      setForm({ date: "", time: "", document: null });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-light py-4 mb-4">
        <div className="container">
          <h2 className="fw-bold mb-3">Find Your Doctor</h2>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search by name or specialization (e.g., Cardiology, Dr. Smith)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="container">
        {filteredDoctors.length === 0 ? (
          <div className="alert alert-info text-center py-5" role="alert">
            <h5>No doctors found</h5>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-3 text-muted">Showing {filteredDoctors.length} doctor(s)</div>
            <div className="row g-4">
              {filteredDoctors.map(doc => (
                <div key={doc._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0 hover" style={{ transition: "transform 0.2s" }}>
                    <div className="card-body">
                      <div className="d-flex align-items-start mb-3">
                        <div className="flex-grow-1">
                          <h5 className="card-title fw-bold mb-1">Dr. {doc.name}</h5>
                          <p className="text-primary mb-2 fw-500">{doc.specialization}</p>
                        </div>
                        <span className="badge bg-success">Available</span>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted">🎭 Experience</small>
                        <p className="mb-2">{doc.experience} years</p>
                        <small className="text-muted">💵 Consultation Fee</small>
                        <p className="fw-bold text-success">₹{doc.fees}</p>
                      </div>
                      {user && user.role === "patient" && (
                        <>
                          <button className="btn btn-primary w-100 mb-2" onClick={() => setShowFormFor(doc._id)}>Book Appointment</button>
                          {showFormFor === doc._id && (
                            <div className="mt-3 p-3 bg-light rounded">
                              <div className="mb-2">
                                <label className="form-label fw-500">Select Date</label>
                                <input type="date" className="form-control" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-500">Select Time</label>
                                <input type="time" className="form-control" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-500">Medical Documents (Optional)</label>
                                <input type="file" className="form-control" onChange={e=>setForm({...form,document:e.target.files[0]})} />
                              </div>
                              <button className="btn btn-success w-100 mb-2" onClick={()=>handleBook(doc._id)} disabled={loading}>
                                {loading ? "Processing..." : "Confirm Booking"}
                              </button>
                              <button className="btn btn-outline-secondary w-100" onClick={() => setShowFormFor(null)}>Cancel</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
