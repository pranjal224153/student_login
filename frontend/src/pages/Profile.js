import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const storedStudent = JSON.parse(localStorage.getItem("student")) || {};
  const [student, setStudent] = useState(storedStudent);
  const [profile, setProfile] = useState({
    course: storedStudent.course || "",
    department: storedStudent.department || "",
    year: storedStudent.year || "",
    gpa: storedStudent.gpa || 0.0
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await API.put("/update-profile", profile);
      setStudent(res.data.student);
      localStorage.setItem("student", JSON.stringify(res.data.student));
      setMessage("Academic profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update profile.");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="page-background">
      <Navbar student={student} onLogout={logout} />
      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-start mb-4 flex-column flex-md-row gap-3">
          <div>
            <h2>Academic Profile</h2>
            <p className="text-muted">Keep your course details and academic year up to date.</p>
          </div>
          <span className={`status-badge ${student.premium ? "premium-active" : "free-plan"}`}>
            {student.premium ? "Premium Member" : "Free Plan"}
          </span>
        </div>

        <div className="feature-box">
          <h5>Profile Settings</h5>
          <div className="mb-3">
            <label className="form-label">Course</label>
            <input
              value={profile.course}
              className="form-control"
              onChange={(e) => setProfile({ ...profile, course: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              value={profile.department}
              className="form-control"
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Academic Year</label>
            <select
              value={profile.year}
              className="form-select"
              onChange={(e) => setProfile({ ...profile, year: e.target.value })}
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Current GPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={profile.gpa}
              className="form-control"
              onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <button className="btn btn-info" onClick={handleSubmit}>
            Save Profile
          </button>
          <button className="btn btn-outline-primary ms-3" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Profile;
