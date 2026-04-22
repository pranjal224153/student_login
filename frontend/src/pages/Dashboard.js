import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem("student"));

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [course, setCourse] = useState(student.course);

  const updatePassword = async () => {
    try {
      await API.put("/update-password", passwordData);
      alert("Password updated");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const updateCourse = async () => {
    try {
      const res = await API.put("/update-course", { course });
      localStorage.setItem("student", JSON.stringify(res.data.student));
      alert("Course updated");
    } catch (err) {
      alert("Error updating course");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>

      <h4>Name: {student.name}</h4>
      <h4>Email: {student.email}</h4>
      <h4>Course: {course}</h4>

      <hr />

      <h5>Update Password</h5>
      <input placeholder="Old Password"
        className="form-control my-2"
        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />

      <input placeholder="New Password"
        className="form-control my-2"
        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />

      <button className="btn btn-warning" onClick={updatePassword}>
        Update Password
      </button>

      <hr />

      <h5>Change Course</h5>
      <input value={course}
        className="form-control my-2"
        onChange={(e) => setCourse(e.target.value)} />

      <button className="btn btn-info" onClick={updateCourse}>
        Update Course
      </button>

      <hr />

      <button className="btn btn-danger" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;