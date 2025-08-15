import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeedbackForm from "./FeedbackForm";
import defaultImage from "../assets/default-product.jpg";
import "../css/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [showFormFor, setShowFormFor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; 
  const navigate = useNavigate();

  useEffect(() => {
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

    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/api/products");
        setProducts(res.data?.data ?? res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchUser();
    fetchProducts();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await axiosClient.post(
        "/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("auth_token");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page">
      <Navbar userName={user.name} onLogout={handleLogout} />

      <div className="container section">
        <h2 className="section__title">Products</h2>
        <div className="products-grid">
          {currentProducts.map((p) => (
            <div className="product-card" key={p.id}>
              <img
                className="product-card__image"
                src={`http://localhost:5173/src/${p.image || defaultImage}`}
                alt={p.name}
              />
              <div className="product-card__title">{p.name}</div>
              {p.description && <div className="product-card__desc">{p.description}</div>}
              {typeof p.price !== "undefined" && p.price !== null && (
                <div className="product-card__price">${Number(p.price).toFixed(2)}</div>
              )}

              <div className="product-card__buttons">
                <button onClick={() => setShowFormFor({ id: p.id, name: p.name })}>
                  Give Feedback
                </button>
                <Link
                  to={`/products/${p.id}`}
                  className="view-details-button"
                  style={{ marginLeft: "10px" }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
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

        {showFormFor && (
          <FeedbackForm
            productId={showFormFor.id}
            productName={showFormFor.name}
            onClose={() => setShowFormFor(null)}
          />
        )}
      </div>
    </div>
  );
}
