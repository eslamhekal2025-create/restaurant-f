import React, { useState, useCallback, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import "./adminPanel.css";
import CategoryPieChart from "../StateCat/StateCat.jsx";

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // ✅ أغلق الـ sidebar لما يتغير المسار (navigate)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // ✅ أغلق الـ sidebar في الشاشات العريضة تلقائيًا
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-container">
      <button className="menu-button" onClick={toggleSidebar}>
        ☰ Menu
      </button>

      <nav className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <ul>
          <li><Link to="">📊 Dashboard</Link></li>
          <li><Link to="AddItem">➕ Add Item</Link></li>
          <li><Link to="allProducts">📦 All Products</Link></li>
          <li><Link to="allOrders">🧾 All Orders</Link></li>
          <li><Link to="AllUser">👥 All Users</Link></li>
          <li><Link to="GetContacts">📬 Contact Messages</Link></li>
        </ul>
      </nav>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
