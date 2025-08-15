import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axiosClient.get("/sanctum/csrf-cookie"); 
      const res = await axiosClient.post("/api/login", form); 
      localStorage.setItem("auth_token", res.data.access_token); 
      alert("Logged in successfully!");
      navigate("/dashboard"); 
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Invalid credentials!");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red", fontSize: "14px" }}>{errors.email}</p>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red", fontSize: "14px" }}>{errors.password}</p>}
        </div>

        <button type="submit">Login</button>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          No account?{" "}
          <Link
            to="/register"
            style={{ color: "#4CAF50", textDecoration: "none", fontWeight: "bold" }}
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
