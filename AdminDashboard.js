import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token, user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user && user.role === "admin") {
      axios
        .get("http://localhost:5000/api/doctors/all", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setDoctors(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token, user]);

  const approve = (id) => {
    axios
      .patch(`http://localhost:5000/api/doctors/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setDoctors(prev => prev.map(d => (d._id === id ? res.data : d)));
        alert("Doctor approved successfully");
      }).catch(err => {
        alert(err.response?.data?.message || "Approval failed");
      });
  };

  const deleteDoctor = (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) return;
    axios
      .delete(`http://localhost:5000/api/doctors/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setDoctors(prev => prev.filter(d => d._id !== id));
        alert("Doctor deleted successfully");
      })
      .catch(err => {
        alert(err.response?.data?.message || "Delete failed");
      });
  };

  if (!user || user.role !== "admin") {
    return <div className="container mt-5"><div className="alert alert-warning" role="alert">Please log in as an admin to view this page.</div></div>;
  }

  const pendingDoctors = doctors.filter(d => !d.approved);
  const approvedDoctors = doctors.filter(d => d.approved);
  const filteredDoctors = filter === "all" ? doctors : filter === "pending" ? pendingDoctors : approvedDoctors;

  return (
    <div>
      <div className="bg-danger text-white py-4 mb-4">
        <div className="container">
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="mb-0">Manage healthcare providers and platform operations</p>
        </div>
      </div>

      <div className="container">
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-danger fw-bold">{doctors.length}</h3>
                <p className="text-muted mb-0">Total Doctors</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-warning fw-bold">{pendingDoctors.length}</h3>
                <p className="text-muted mb-0">Pending Approval</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-success fw-bold">{approvedDoctors.length}</h3>
                <p className="text-muted mb-0">Approved Doctors</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-info fw-bold">1:1</h3>
                <p className="text-muted mb-0">Approval Ratio</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="btn-group" role="group">
            <input type="radio" className="btn-check" name="filter" id="all" value="all" checked={filter === "all"} onChange={e => setFilter(e.target.value)} />
            <label className="btn btn-outline-secondary" htmlFor="all">All ({doctors.length})</label>

            <input type="radio" className="btn-check" name="filter" id="pending" value="pending" checked={filter === "pending"} onChange={e => setFilter(e.target.value)} />
            <label className="btn btn-outline-warning" htmlFor="pending">Pending ({pendingDoctors.length})</label>

            <input type="radio" className="btn-check" name="filter" id="approved" value="approved" checked={filter === "approved"} onChange={e => setFilter(e.target.value)} />
            <label className="btn btn-outline-success" htmlFor="approved">Approved ({approvedDoctors.length})</label>
          </div>
        </div>

        {/* Doctors List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="alert alert-info text-center py-5" role="alert">
            <h5>No doctors to display</h5>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Consultation Fee</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(d => (
                  <tr key={d._id}>
                    <td className="fw-500">{d.name}</td>
                    <td>{d.specialization}</td>
                    <td>{d.experience} years</td>
                    <td className="text-success fw-bold">₹{d.fees}</td>
                    <td>
                      <span className={`badge ${d.approved ? "bg-success" : "bg-warning"}`}>
                        {d.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td>
                      {!d.approved && (
                        <>
                          <button className="btn btn-sm btn-success me-2" onClick={() => approve(d._id)}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteDoctor(d._id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}