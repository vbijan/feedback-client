import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import "../css/feedback.css";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchFeedbacks();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axiosClient.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      navigate("/login");
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axiosClient.get("/api/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedbacks", err);
    }
  };

  const handleCommentSubmit = async (feedbackId) => {
    if (!commentText.trim()) {
      setError("Comment cannot be empty");
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
      setError("");
      fetchFeedbacks();
    } catch (err) {
      console.error("Error posting comment", err);
      setError("Failed to post comment");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await axiosClient.post("/api/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("auth_token");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const feedbacksByProduct = currentFeedbacks.reduce((acc, fb) => {
    if (!acc[fb.product_name]) acc[fb.product_name] = [];
    acc[fb.product_name].push(fb);
    return acc;
  }, {});

  return (
    <div className="page">
      <Navbar userName={user.name} onLogout={handleLogout} />

      <div className="container section">
        <h2 className="section__title">Feedbacks by Product</h2>

        {feedbacks.length === 0 && <p>No feedbacks yet.</p>}

        {Object.keys(feedbacksByProduct).map((product) => {
          const productFeedbacks = feedbacksByProduct[product];
          const productId = productFeedbacks[0]?.product_id;

          return (
            <div key={product} className="product-feedback-section">
              <div className="product-header">
                <h3 className="product-title">{product}</h3>
                {productId && (
                  <button
                    className="view-product-details"
                    onClick={() => navigate(`/products/${productId}`)}
                  >
                    View Product Details
                  </button>
                )}
              </div>

              <div className="feedbacks-grid">
                {productFeedbacks.map((fb) => (
                  <div key={fb.id} className="feedback-card">
                    <div className="feedback-info">
                      <h4>{fb.title}</h4>
                      <p><strong>Category:</strong> {fb.category}</p>
                      <p><strong>User:</strong> {fb.user_name}</p>
                      <p><strong>Date:</strong> {new Date(fb.created_at).toLocaleString()}</p>
                    </div>

                    <div className="feedback-card__buttons">
                      {activeFeedbackId === fb.id ? (
                        <div className="add-comment">
                          <MDEditor
                            value={commentText}
                            onChange={setCommentText}
                            height={100}
                          />
                          <button onClick={() => handleCommentSubmit(fb.id)}>Post</button>
                          <button onClick={() => { setActiveFeedbackId(null); setError(""); }}>Cancel</button>
                          {error && <p className="error-text">{error}</p>}
                        </div>
                      ) : (
                        <button onClick={() => setActiveFeedbackId(fb.id)}>Add Comment</button>
                      )}
                    </div>

                    {fb.comments?.length > 0 && (
                      <div className="comments">
                        <h5>Comments:</h5>
                        {fb.comments.map((c) => (
                          <div key={c.id}>
                            <p><strong>{c.user_name}</strong> ({new Date(c.created_at).toLocaleString()}):</p>
                            <MDEditor.Markdown source={c.content} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={num === currentPage ? "active" : ""}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
