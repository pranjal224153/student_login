import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    department: "",
    year: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.course || !form.department || !form.year) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await API.post("/register", form);
      alert("Registration successful. Please login to continue.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to register.");
    }
  };

  return (
    <div className="page-background">
      <div className="auth-card shadow-sm">
        <h2>Create your profile</h2>
        <p className="text-muted">Register now and unlock premium features from your dashboard.</p>

        <form onSubmit={handleSubmit}>
          <input
            value={form.name}
            className="form-control my-3"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            value={form.email}
            className="form-control my-3"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            value={form.password}
            type="password"
            className="form-control my-3"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input
            value={form.course}
            className="form-control my-3"
            placeholder="Course"
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />

          <input
            value={form.department}
            className="form-control my-3"
            placeholder="Department"
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />

          <select
            value={form.year}
            className="form-select my-3"
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          {error && <div className="alert alert-danger mt-2">{error}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Register
          </button>
        </form>

        <div className="auth-footer mt-4">
          <p>
            Already have an account? <span className="text-link" onClick={() => navigate("/")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;