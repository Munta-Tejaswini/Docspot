
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h2 className="text-center fw-bold mb-4 text-primary">Welcome Back</h2>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <div className="mb-3">
                  <label className="form-label fw-500">Email Address</label>
                  <input className="form-control form-control-lg" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-500">Password</label>
                  <input type="password" className="form-control form-control-lg" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary btn-lg w-100 fw-bold" onClick={handleLogin} disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
                <div className="text-center mt-4">
                  <p className="text-muted">Don't have an account? <Link to="/register" className="text-decoration-none fw-bold">Register here</Link></p>
                </div>
                <hr />
                <div className="alert alert-info small" role="alert">
                  <strong>Demo Account:</strong><br />
                  Admin: admin@docspot.com / admin123<br />
                  Or register as patient/doctor
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
