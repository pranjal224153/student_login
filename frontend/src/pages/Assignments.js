import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function Assignments() {
  const navigate = useNavigate();
  const storedStudent = JSON.parse(localStorage.getItem("student")) || {};
  const [assignments, setAssignments] = useState(storedStudent.assignments || []);
  const [newAssignment, setNewAssignment] = useState({ title: "", course: "", dueDate: "", status: "Pending", submitted: false });
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    if (!newAssignment.title || !newAssignment.course || !newAssignment.dueDate) {
      setMessage("Please fill in all assignment fields.");
      return;
    }
    setAssignments([...assignments, { ...newAssignment }]);
    setNewAssignment({ title: "", course: "", dueDate: "", status: "Pending", submitted: false });
    setMessage("Assignment added.");
  };

  const toggleSubmitted = (index) => {
    const updated = assignments.map((assignment, idx) => {
      if (idx === index) {
        const submitted = !assignment.submitted;
        return {
          ...assignment,
          submitted,
          status: submitted ? "Submitted" : "Pending"
        };
      }
      return assignment;
    });
    setAssignments(updated);
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/update-assignments", { assignments });
      localStorage.setItem("student", JSON.stringify({ ...storedStudent, assignments: res.data.student.assignments }));
      setAssignments(res.data.student.assignments);
      setMessage("Assignments saved successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to save assignments.");
    }
  };

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
            <h2>Assignments</h2>
            <p className="text-muted">Track coursework, due dates, and submission status in one place.</p>
          </div>
          <span className="status-badge free-plan">{assignments.length} total</span>
        </div>

        <div className="feature-box mb-4">
          <h5>Add New Assignment</h5>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                placeholder="Title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-3">
              <input
                className="form-control"
                placeholder="Course"
                value={newAssignment.course}
                onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-3">
              <input
                className="form-control"
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-2 d-grid">
              <button className="btn btn-primary" onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>

        <div className="feature-box">
          <h5>Assignment List</h5>
          {assignments.length === 0 ? (
            <p className="text-muted">No assignments yet. Add your first one above.</p>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Course</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment, index) => (
                    <tr key={index}>
                      <td>{assignment.title}</td>
                      <td>{assignment.course}</td>
                      <td>{assignment.dueDate}</td>
                      <td>{assignment.status}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${assignment.submitted ? "btn-success" : "btn-outline-secondary"}`}
                          onClick={() => toggleSubmitted(index)}
                        >
                          {assignment.submitted ? "Submitted" : "Mark Submitted"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 d-flex flex-column flex-sm-row gap-2">
            <button className="btn btn-info" onClick={handleSave}>Save Assignments</button>
            <button className="btn btn-outline-primary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          </div>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Assignments;
