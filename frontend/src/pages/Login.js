import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const res = await API.post("/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("student", JSON.stringify(res.data.student));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="page-background">
      <div className="auth-card shadow-sm">
        <h2>Welcome Back</h2>
        <p className="text-muted">Sign in to access your student dashboard and premium resources.</p>

        <form onSubmit={handleSubmit}>
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

          {error && <div className="alert alert-danger mt-2">{error}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>
        </form>

        <div className="auth-footer mt-4">
          <p>
            New here? <span className="text-link" onClick={() => navigate("/register")}>Create account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;