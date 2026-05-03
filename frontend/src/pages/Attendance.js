import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function Attendance() {
  const navigate = useNavigate();
  const storedStudent = JSON.parse(localStorage.getItem("student")) || {};
  const [attendanceRecords, setAttendanceRecords] = useState(storedStudent.attendanceRecords || []);
  const [newRecord, setNewRecord] = useState({ course: "", attended: 0, totalClasses: 0 });
  const [message, setMessage] = useState("");

  const handleAddRecord = () => {
    if (!newRecord.course) {
      setMessage("Please enter a course name.");
      return;
    }
    setAttendanceRecords([...attendanceRecords, { ...newRecord }]);
    setNewRecord({ course: "", attended: 0, totalClasses: 0 });
    setMessage("Attendance record added.");
  };

  const updateRecord = (index, field, value) => {
    const updated = attendanceRecords.map((record, idx) => {
      if (idx === index) {
        return { ...record, [field]: Number(value) };
      }
      return record;
    });
    setAttendanceRecords(updated);
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/update-attendance", { attendanceRecords });
      localStorage.setItem("student", JSON.stringify({ ...storedStudent, attendanceRecords: res.data.student.attendanceRecords }));
      setAttendanceRecords(res.data.student.attendanceRecords);
      setMessage("Attendance saved successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to save attendance.");
    }
  };

  const averageAttendance = attendanceRecords.length
    ? Math.round(
        attendanceRecords.reduce((sum, record) => {
          if (record.totalClasses > 0) {
            return sum + (record.attended / record.totalClasses) * 100;
          }
          return sum;
        }, 0) / attendanceRecords.length
      )
    : 0;

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
            <h2>Attendance Tracker</h2>
            <p className="text-muted">Monitor your class attendance and keep your records current.</p>
          </div>
          <span className={`status-badge ${averageAttendance >= 75 ? "premium-active" : "free-plan"}`}>
            Avg Attendance: {averageAttendance}%
          </span>
        </div>

        <div className="feature-box mb-4">
          <h5>Add or update attendance</h5>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                placeholder="Course"
                value={newRecord.course}
                onChange={(e) => setNewRecord({ ...newRecord, course: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-3">
              <input
                className="form-control"
                type="number"
                min="0"
                placeholder="Attended"
                value={newRecord.attended}
                onChange={(e) => setNewRecord({ ...newRecord, attended: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-3">
              <input
                className="form-control"
                type="number"
                min="0"
                placeholder="Total Classes"
                value={newRecord.totalClasses}
                onChange={(e) => setNewRecord({ ...newRecord, totalClasses: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-2 d-grid">
              <button className="btn btn-primary" onClick={handleAddRecord}>Add Record</button>
            </div>
          </div>
        </div>

        <div className="feature-box">
          <h5>Attendance Records</h5>
          {attendanceRecords.length === 0 ? (
            <p className="text-muted">No records yet. Add your first class attendance record above.</p>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Attended</th>
                    <th>Total</th>
                    <th>Percent</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => {
                    const percent = record.totalClasses > 0 ? Math.round((record.attended / record.totalClasses) * 100) : 0;
                    return (
                      <tr key={index}>
                        <td>{record.course}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={record.attended}
                            className="form-control"
                            onChange={(e) => updateRecord(index, "attended", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={record.totalClasses}
                            className="form-control"
                            onChange={(e) => updateRecord(index, "totalClasses", e.target.value)}
                          />
                        </td>
                        <td>{percent}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 d-flex flex-column flex-sm-row gap-2">
            <button className="btn btn-info" onClick={handleSave}>Save Attendance</button>
            <button className="btn btn-outline-primary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          </div>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Attendance;
