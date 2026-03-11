
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 text-center" style={{ minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 className="display-4 fw-bold">Welcome to DocSpot{user ? `, ${user.name}!` : "!"}</h1>
        <p className="lead mt-3">Seamless Appointment Booking for Health</p>
        <p className="fs-5">Book appointments with trusted healthcare providers in minutes</p>
        {!user && (<Link className="btn btn-light btn-lg mt-4" to="/register" style={{ width: "fit-content", margin: "1rem auto" }}>Get Started</Link>)}
      </div>

      {/* Features Section */}
      <div className="container my-5">
        <h2 className="text-center mb-5 fw-bold">Why Choose DocSpot?</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title text-primary fw-bold">⏱️ Easy Booking</h5>
                <p className="card-text">Quick and effortless scheduling without waiting times or phone calls.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title text-success fw-bold">🏥 Verified Doctors</h5>
                <p className="card-text">Browse and book with certified healthcare professionals.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title text-info fw-bold">🔐 Secure & Private</h5>
                <p className="card-text">Your health data is protected with enterprise-grade security.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user && user.role === "patient" && (
        <div className="bg-light py-5 text-center">
          <div className="container">
            <h3 className="mb-4">Ready to book an appointment?</h3>
            <Link className="btn btn-primary btn-lg" to="/doctors">Browse Doctors</Link>
          </div>
        </div>
      )}
    </div>
  );
}
