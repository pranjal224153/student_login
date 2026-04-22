import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await API.post("/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("student", JSON.stringify(res.data.student));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input type="password" className="form-control my-2" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className="btn btn-success">Login</button>
      </form>

      <p className="mt-3" onClick={() => navigate("/register")}>
        New user? Register
      </p>
    </div>
  );
}

export default Login;