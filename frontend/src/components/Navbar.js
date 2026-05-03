import React, { useEffect, useState } from "react";
import API from "../utils/api";

function Navbar({ student, onLogout }) {
  const [healthStatus, setHealthStatus] = useState("Checking...");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await API.get("/health");
        if (res.data?.status === "ok") {
          setHealthStatus("Online");
        } else {
          setHealthStatus("Degraded");
        }
      } catch (error) {
        setHealthStatus("Offline");
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="app-navbar">
      <div className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">
        <div>
          <div className="navbar-brand">Student Login App</div>
          <div className="d-flex flex-column gap-1">
            <span className="text-muted" style={{ fontSize: "0.95rem" }}>
              Welcome back, {student.name || "student"}
            </span>
            <span className={`status-badge ${healthStatus === "Online" ? "premium-active" : "free-plan"}`}>
              Backend: {healthStatus}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {student.premium && <span className="nav-chip">Premium</span>}
          <button className="btn btn-outline-primary btn-sm" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
