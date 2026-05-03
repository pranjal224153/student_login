import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function Premium() {
  const navigate = useNavigate();
  const storedStudent = JSON.parse(localStorage.getItem("student")) || {};
  const [student, setStudent] = useState(storedStudent);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const upgradePremium = async () => {
    try {
      const res = await API.put("/upgrade-premium");
      setStudent(res.data.student);
      localStorage.setItem("student", JSON.stringify(res.data.student));
      setStatusMessage("Premium activated successfully. Enjoy exclusive resources!");
    } catch (err) {
      setStatusMessage(err.response?.data?.message || "Unable to activate premium at this time.");
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
            <h2>Premium Hub</h2>
            <p className="text-muted">A dedicated space for premium users to access exclusive study tools and resources.</p>
          </div>
          <span className={`status-badge ${student.premium ? "premium-active" : "free-plan"}`}>
            {student.premium ? "Premium Member" : "Free Plan"}
          </span>
        </div>

        <div className="row gy-4">
          <div className="col-12">
            <div className="premium-card">
              <h5>{student.premium ? "Exclusive Premium Resources" : "Upgrade to Premium"}</h5>
              <p className="text-muted">
                {student.premium
                  ? "Access exclusive notes, curated study plans, and priority support."
                  : "Upgrade to unlock premium-only materials, learning pathways, and faster support."}
              </p>
              <ul className="feature-list">
                <li>Curated weekly learning plan</li>
                <li>Premium revision notes and cheat sheets</li>
                <li>Priority support replies within 24 hours</li>
                <li>Early access to new course recommendations</li>
              </ul>

              {!student.premium ? (
                <button className="btn btn-gold w-100 mt-3" onClick={upgradePremium}>
                  Activate Premium
                </button>
              ) : (
                <button className="btn btn-info w-100 mt-3" onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </button>
              )}
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

export default Premium;
