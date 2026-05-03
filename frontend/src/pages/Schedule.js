import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Schedule() {
  const navigate = useNavigate();
  const storedStudent = JSON.parse(localStorage.getItem("student")) || {};

  const classes = [
    { time: "08:30 - 10:00", monday: "Mathematics", tuesday: "Physics", wednesday: "Programming", thursday: "Chemistry", friday: "Elective" },
    { time: "10:15 - 11:45", monday: "English", tuesday: "Data Structures", wednesday: "Mathematics", thursday: "Lab", friday: "Sports" },
    { time: "12:00 - 13:30", monday: "Physics", tuesday: "Database", wednesday: "English", thursday: "Programming", friday: "Seminar" },
    { time: "14:30 - 16:00", monday: "Chemistry", tuesday: "Mathematics", wednesday: "Free Slot", thursday: "Data Structures", friday: "Workshop" }
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="page-background">
      <Navbar student={storedStudent} onLogout={logout} />
      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-start mb-4 flex-column flex-md-row gap-3">
          <div>
            <h2>Class Schedule</h2>
            <p className="text-muted">Your weekly timetable to keep track of lectures, labs, and study blocks.</p>
          </div>
          <span className={`status-badge ${storedStudent.premium ? "premium-active" : "free-plan"}`}>
            {storedStudent.premium ? "Premium Member" : "Free Plan"}
          </span>
        </div>

        <div className="feature-box">
          <h5>Weekly Timetable</h5>
          <div className="table-responsive">
            <table className="table schedule-table mb-0">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((item) => (
                  <tr key={item.time}>
                    <td>{item.time}</td>
                    <td>{item.monday}</td>
                    <td>{item.tuesday}</td>
                    <td>{item.wednesday}</td>
                    <td>{item.thursday}</td>
                    <td>{item.friday}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button className="btn btn-outline-primary me-3" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
            <button className="btn btn-gold" onClick={() => navigate("/premium")}>Explore Premium Tools</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
