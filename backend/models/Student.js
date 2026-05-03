const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    department: {
        type: String,
        default: "General Studies"
    },
    year: {
        type: String,
        default: "1st Year"
    },
    gpa: {
        type: Number,
        default: 0.0
    },
    assignments: {
        type: [
            {
                title: String,
                course: String,
                dueDate: String,
                status: {
                    type: String,
                    enum: ["Pending", "Submitted", "Overdue"],
                    default: "Pending"
                },
                submitted: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        default: []
    },
    attendanceRecords: {
        type: [
            {
                course: String,
                attended: {
                    type: Number,
                    default: 0
                },
                totalClasses: {
                    type: Number,
                    default: 0
                }
            }
        ],
        default: []
    },
    premium: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);