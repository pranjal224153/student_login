import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.course) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await API.post("/register", form);
      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      console.log(err); // 👈 add this
alert(err.response?.data?.message || err.message || "Error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input className="form-control my-2" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input type="password" className="form-control my-2" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <input className="form-control my-2" placeholder="Course"
          onChange={(e) => setForm({ ...form, course: e.target.value })} />

        <button className="btn btn-primary">Register</button>
      </form>

      <p className="mt-3" onClick={() => navigate("/")}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Register;