import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function FeedbackForm({ productId, productName, onClose, onSuccess }) {
  const [form, setForm] = useState({
    product_id: productId,
    title: "",
    description: "",
    category: "Bug report", // default selected category
  });

  const categories = ["Bug report", "Feature request", "General feedback", "Other"];
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("auth_token");
      await axiosClient.post("/api/feedbacks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Feedback submitted successfully!");
      onClose(); // close modal immediately

      // Refresh feedbacks in ProductDetail if onSuccess is provided
      if (onSuccess) {
        try {
          await onSuccess();
        } catch (err) {
          console.error("Error refreshing feedbacks:", err);
        }
      } else {
        navigate("/feedbacks"); // Dashboard default case
      }

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        alert("Error: " + JSON.stringify(err.response.data));
      } else {
        alert("Error submitting feedback");
      }
    }
  };

  // Close form when clicking outside
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("feedback-form")) {
      onClose();
    }
  };

  return (
    <div className="feedback-form" onClick={handleBackgroundClick}>
      <form onSubmit={handleSubmit}>
        <h3>Submit Feedback</h3>

        {/* Disabled product field */}
        <input
          type="text"
          name="product_name"
          value={productName}
          disabled
          style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
        />

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Category dropdown */}
        <select name="category" value={form.category} onChange={handleChange} required>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        {/* Buttons */}
        <div className="feedback-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
