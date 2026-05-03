import React from "react";

function Navbar({ student, onLogout }) {
  return (
    <div className="app-navbar">
      <div className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">
        <div>
          <div className="navbar-brand">Student Login App</div>
          <div className="text-muted" style={{ fontSize: "0.95rem" }}>
            Welcome back, {student.name || "student"}
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
