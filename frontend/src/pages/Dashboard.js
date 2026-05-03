import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const storedStudent = JSON.parse(localStorage.getItem("student")) || {};
  const [student, setStudent] = useState(storedStudent);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [course, setCourse] = useState(storedStudent.course || "");
  const [statusMessage, setStatusMessage] = useState("");

  const updatePassword = async () => {
    try {
      await API.put("/update-password", passwordData);
      setPasswordData({ oldPassword: "", newPassword: "" });
      setStatusMessage("Password updated successfully.");
    } catch (err) {
      setStatusMessage(err.response?.data?.message || "Could not update password.");
    }
  };

  const updateCourse = async () => {
    try {
      const res = await API.put("/update-course", { course });
      setStudent(res.data.student);
      localStorage.setItem("student", JSON.stringify(res.data.student));
      setStatusMessage("Course updated successfully.");
    } catch (err) {
      setStatusMessage("Error updating course.");
    }
  };

  const upgradePremium = async () => {
    try {
      const res = await API.put("/upgrade-premium");
      setStudent(res.data.student);
      localStorage.setItem("student", JSON.stringify(res.data.student));
      setStatusMessage("Premium membership activated!");
    } catch (err) {
      setStatusMessage(err.response?.data?.message || "Unable to activate premium at this time.");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const premiumBenefits = [
    "Priority support and one-click help",
    "Custom study plan suggestions",
    "Exclusive headstart on new course paths"
  ];

  return (
    <div className="page-background">
      <Navbar student={student} onLogout={logout} />

      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-start mb-4 flex-column flex-md-row gap-3">
          <div>
            <h2>Student Dashboard</h2>
            <p className="text-muted">Manage your profile, update your course, and unlock premium learning advantages.</p>
          </div>
          <span className={`status-badge ${student.premium ? "premium-active" : "free-plan"}`}>
            {student.premium ? "Premium Member" : "Free Plan"}
          </span>
        </div>

        <div className="row gy-4">
          <div className="col-12 col-lg-6">
            <div className="feature-box">
              <h5>Profile Overview</h5>
              <p className="text-muted">Student information is saved securely and can be updated instantly.</p>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Course:</strong> {student.course}</p>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="premium-card">
              <h5>{student.premium ? "Premium benefits" : "Upgrade to Premium"}</h5>
              <ul className="feature-list">
                {premiumBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                className="btn btn-gold w-100 mt-3"
                onClick={upgradePremium}
                disabled={student.premium}
              >
                {student.premium ? "Premium Active" : "Activate Premium"}
              </button>
            </div>
          </div>

          <div className="col-12">
            <div className="feature-box">
              <h5>Update Account</h5>
              <div className="mb-3">
                <label className="form-label">Change Course</label>
                <input
                  value={course}
                  className="form-control"
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>
              <button className="btn btn-info" onClick={updateCourse}>
                Save Course
              </button>
            </div>
          </div>

          <div className="col-12">
            <div className="feature-box">
              <h5>Update Password</h5>
              <input
                value={passwordData.oldPassword}
                type="password"
                className="form-control my-2"
                placeholder="Old Password"
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              />
              <input
                value={passwordData.newPassword}
                type="password"
                className="form-control my-2"
                placeholder="New Password"
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <button className="btn btn-warning" onClick={updatePassword}>
                Update Password
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="col-12">
              <div className="alert alert-info mb-0">{statusMessage}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;