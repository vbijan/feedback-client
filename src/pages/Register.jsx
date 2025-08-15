import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import '../css/authform.css'

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    user_type: "user",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await axiosClient.get("/sanctum/csrf-cookie");
      await axiosClient.post("/api/register", form);

      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response) {
        if (err.response.status === 500) {
          alert(
            "Server error: Could not connect to database. Please try again later."
          );
        } else {
          alert(`Server error: ${err.response.data.message || "Something went wrong"}`);
        }
      } else if (err.request) {
        alert("Network error: Could not reach the server. Is Laravel running?");
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name[0]}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email[0]}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password[0]}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password_confirmation">Confirm Password:</label>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Register</button>

        {/* Sign-in link */}
        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4CAF50", textDecoration: "none", fontWeight: "bold" }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
