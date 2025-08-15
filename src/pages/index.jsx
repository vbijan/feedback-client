import React from "react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Product Feedback Portal</h1>
        <p style={styles.description}>
          Collect feedback from users, track feature requests, and manage product
          improvements efficiently.
        </p>

        <div style={styles.buttonGroup}>
          <Link to="/register" style={{ ...styles.button, ...styles.register }}>
            Register
          </Link>
          <Link to="/login" style={{ ...styles.button, ...styles.login }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "50px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333333",
  },
  description: {
    fontSize: "1.1rem",
    marginBottom: "40px",
    color: "#555555",
    lineHeight: "1.6",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  button: {
    padding: "12px 25px",
    fontSize: "16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  register: {
    backgroundColor: "#4CAF50",
    color: "#ffffff",
  },
  login: {
    backgroundColor: "#ffffff",
    color: "#4CAF50",
    border: "2px solid #4CAF50",
  },
};
