import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FeedbackList from "./pages/FeedbackList";
import ProductDetail from './pages/ProductDetail';
import "./css/main.css";
import Layout from './components/Layout'; 

function App() {
  return (
    <Layout pageTitle="">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedbacks" element={<FeedbackList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
