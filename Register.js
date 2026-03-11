
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"", role:"patient", specialization:"", experience:0, fees:0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.role === "doctor" && (!form.specialization || form.experience === 0 || form.fees === 0)) {
      setError("Please fill in all doctor information");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/users/register", form);
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h2 className="text-center fw-bold mb-4 text-primary">Create Account</h2>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                
                <div className="mb-3">
                  <label className="form-label fw-500">I am a</label>
                  <select className="form-select form-select-lg" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Healthcare Provider (Doctor)</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-500">Full Name</label>
                  <input className="form-control form-control-lg" placeholder="Enter your full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-500">Email Address</label>
                  <input type="email" className="form-control form-control-lg" placeholder="Enter your email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-500">Password</label>
                  <input type="password" className="form-control form-control-lg" placeholder="Minimum 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-500">Confirm Password</label>
                  <input type="password" className="form-control form-control-lg" placeholder="Re-enter your password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} />
                </div>

                {form.role === "doctor" && (
                  <div className="alert alert-info mb-4">
                    <h6 className="fw-bold">Healthcare Provider Information</h6>
                    <div className="mt-3">
                      <div className="mb-3">
                        <label className="form-label fw-500">Specialization</label>
                        <input className="form-control" placeholder="e.g., Cardiology, Pediatrics" value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-500">Years of Experience</label>
                        <input type="number" min="0" className="form-control" placeholder="e.g., 5" value={form.experience} onChange={e=>setForm({...form,experience:parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-500">Consultation Fee (₹)</label>
                        <input type="number" min="0" className="form-control" placeholder="e.g., 500" value={form.fees} onChange={e=>setForm({...form,fees:parseInt(e.target.value) || 0})} />
                      </div>
                      <small className="text-muted">Note: Your profile will need admin approval before appearing in listings.</small>
                    </div>
                  </div>
                )}

                <button className="btn btn-primary btn-lg w-100 fw-bold" onClick={handleRegister} disabled={loading}>
                  {loading ? "Creating Account..." : "Register"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-muted">Already have an account? <Link to="/login" className="text-decoration-none fw-bold">Login here</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
