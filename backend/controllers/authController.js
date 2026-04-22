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
        const { name, email, password, course } = req.body;

        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            email,
            password: hashedPassword,
            course
        });

        res.status(201).json({
            message: "User Registered",
            token: generateToken(student._id)
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
        course: student.course
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