import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar({ userName = "User", onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = userName
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const toggle = () => setOpen((v) => !v);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <nav className="navbar">
       <div className="navbar__brand">
        <Link to="/dashboard">
          <img src={logo} alt="Product Feedback Logo" className="navbar__logo" />
        </Link>
      </div>
      <div className="navbar__brand"><Link to="/feedbacks">Feedbacks</Link></div>

      <div className="navbar__user" ref={menuRef}>
        <button
          className="user-button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className="avatar" aria-hidden>{initials || "U"}</span>
          <span className="user-name">{userName}</span>
          <span className={`chevron ${open ? "up" : ""}`} aria-hidden>▾</span>
        </button>

        <ul className={`dropdown ${open ? "open" : ""}`} role="menu">
          {/* Add more items here if you want (e.g., Profile) */}
          <li role="menuitem">
            <button className="dropdown__item" onClick={onLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
