import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-5" to="/">
          <span style={{ fontSize: "1.5rem" }}>🏥</span> DocSpot
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {user && user.role === "patient" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctors">Browse Doctors</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myappointments">My Appointments</Link>
                </li>
              </>
            )}
            {user && user.role === "doctor" && (
              <li className="nav-item">
                <Link className="nav-link" to="/doctor">Doctor Dashboard</Link>
              </li>
            )}
            {user && user.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Panel</Link>
              </li>
            )}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><span className="dropdown-item-text fw-500 text-muted">{user.role === "doctor" ? "Doctor" : user.role === "admin" ? "Admin" : "Patient"}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
