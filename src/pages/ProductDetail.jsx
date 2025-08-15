import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import FeedbackForm from "./FeedbackForm";
import MDEditor from "@uiw/react-md-editor";
import defaultImage from "../assets/default-product.jpg";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);
  const [user, setUser] = useState(null);
  const [showFormFor, setShowFormFor] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5173";

  useEffect(() => {
    fetchUser();
    fetchProductDetail();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axiosClient.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      navigate("/login");
    }
  };

  const fetchProductDetail = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axiosClient.get(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduct(res.data.product);
      setFeedbacks(res.data.feedbacks);
    } catch (err) {
      console.error("Error fetching product detail", err);
    }
  };

  const handleCommentSubmit = async (feedbackId) => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    try {
      const token = localStorage.getItem("auth_token");
      await axiosClient.post(
        `/api/feedbacks/${feedbackId}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      setActiveFeedbackId(null);
      fetchProductDetail();
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await axiosClient.post("/api/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("auth_token");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || !product) return <p>Loading...</p>;

  return (
    <div className="page">
      <Navbar userName={user.name} onLogout={handleLogout} />

      <div className="container section">
        <h2>{product.name}</h2>
        <img
          src={product.image ? `${API_BASE_URL}/src/${product.image}` : defaultImage}
          alt={product.name}
          style={{ maxWidth: "300px", marginBottom: "15px" }}
        />
        <p>{product.description}</p>

        <h3>Feedbacks</h3>

        <button
          style={{ marginBottom: "15px" }}
          onClick={() => setShowFormFor({ id: product.id, name: product.name })}
        >
          Add Feedback
        </button>

        {feedbacks.length === 0 && <p>No feedbacks yet for this product.</p>}

        {feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <h4>{fb.title}</h4>
            <p><strong>User:</strong> {fb.user_name}</p>
            <p><strong>Date:</strong> {new Date(fb.created_at).toLocaleString()}</p>
            <p><strong>Category:</strong> {fb.category}</p>
            <p>{fb.description}</p>

            <div className="comments">
              <h5>Comments:</h5>
              {fb.comments?.map((c) => (
                <div key={c.id}>
                  <p><strong>{c.user_name}</strong> ({new Date(c.created_at).toLocaleString()}):</p>
                  <MDEditor.Markdown source={c.content} />
                </div>
              ))}
            </div>

            {activeFeedbackId === fb.id ? (
              <div className="add-comment">
                <MDEditor value={commentText} onChange={setCommentText} height={100} />
                <button onClick={() => handleCommentSubmit(fb.id)}>Post</button>
                <button onClick={() => setActiveFeedbackId(null)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setActiveFeedbackId(fb.id)}>Add Comment</button>
            )}
          </div>
        ))}

        {showFormFor && (
          <FeedbackForm
            productId={showFormFor.id}
            productName={showFormFor.name}
            onClose={() => setShowFormFor(null)}
            onSuccess={fetchProductDetail}
          />
        )}
      </div>
    </div>
  );
}
