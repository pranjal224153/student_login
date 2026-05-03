const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
};

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, course, department, year } = req.body;

        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            email,
            password: hashedPassword,
            course,
            department,
            year,
            premium: false
        });

        res.status(201).json({
            message: "User Registered",
            token: generateToken(student._id),
            student: {
                _id: student._id,
                name: student.name,
                email: student.email,
                course: student.course,
                department: student.department,
                year: student.year,
                gpa: student.gpa,
                premium: student.premium
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            token: generateToken(student._id),
            student: {
                _id: student._id,
                name: student.name,
                email: student.email,
                course: student.course,
                department: student.department,
                year: student.year,
                gpa: student.gpa,
                premium: student.premium
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const student = await Student.findById(req.user.id);

        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        student.password = hashedPassword;

        await student.save();

        res.json({ message: "Password updated" });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// UPDATE COURSE
exports.updateCourse = async (req, res) => {
    try {
        const { course } = req.body;

        const student = await Student.findById(req.user.id);
        student.course = course;

        await student.save();

        res.json({ message: "Course updated", student });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { course, department, year, gpa } = req.body;

        const student = await Student.findById(req.user.id);
        if (course) student.course = course;
        if (department) student.department = department;
        if (year) student.year = year;
        if (gpa !== undefined) student.gpa = gpa;

        await student.save();

        res.json({
            message: "Profile updated",
            student: {
                _id: student._id,
                name: student.name,
                email: student.email,
                course: student.course,
                department: student.department,
                year: student.year,
                gpa: student.gpa,
                premium: student.premium
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// UPGRADE TO PREMIUM
exports.upgradePremium = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student.premium) {
            student.premium = true;
            await student.save();
        }

        res.json({
            message: "Premium activated",
            student: {
                _id: student._id,
                name: student.name,
                email: student.email,
                course: student.course,
                premium: student.premium
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};