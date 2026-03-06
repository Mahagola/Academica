const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ✅ MySQL DB connection (we'll try to connect; if it fails we'll fall back to an in-memory store)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",        // change if needed
    password: "your_password", // change this
    database: "studentdb",
});

let dbConnected = false;
const inMemoryStudents = [];
let nextId = 1;

db.connect((err) => {
    if (err) {
        console.log("⚠️  MySQL connection failed, falling back to in-memory store.", err.message);
        dbConnected = false;
    } else {
        console.log("✅ Connected to MySQL database.");
        dbConnected = true;
    }
});

// ✅ Fetch all students
app.get("/students", (req, res) => {
    if (dbConnected) {
        db.query("SELECT * FROM students", (err, result) => {
            if (err) return res.json(err);
            return res.json(result);
        });
    } else {
        return res.json(inMemoryStudents);
    }
});

// ✅ Add student
app.post("/students", (req, res) => {
    const { name, email, course } = req.body;
    if (dbConnected) {
        db.query(
            "INSERT INTO students(name, email, course) VALUES (?, ?, ?)",
            [name, email, course],
            (err, result) => {
                if (err) return res.json(err);
                return res.json(result);
            }
        );
    } else {
        const newStudent = { id: nextId++, name, email, course };
        inMemoryStudents.push(newStudent);
        return res.json({ affectedRows: 1, insertId: newStudent.id });
    }
});

// ✅ Delete student
app.delete("/students/:id", (req, res) => {
    const studentId = req.params.id;
    if (dbConnected) {
        db.query(
            "DELETE FROM students WHERE id = ?",
            studentId,
            (err, result) => {
                if (err) return res.json(err);
                return res.json(result);
            }
        );
    } else {
        const idNum = parseInt(studentId, 10);
        const idx = inMemoryStudents.findIndex((s) => s.id === idNum);
        if (idx === -1) return res.status(404).json({ message: "Not found" });
        inMemoryStudents.splice(idx, 1);
        return res.json({ affectedRows: 1 });
    }
});

// ✅ Update student
app.put("/students/:id", (req, res) => {
    const studentId = req.params.id;
    const { name, email, course } = req.body;
    if (dbConnected) {
        db.query(
            "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?",
            [name, email, course, studentId],
            (err, result) => {
                if (err) return res.json(err);
                return res.json(result);
            }
        );
    } else {
        const idNum = parseInt(studentId, 10);
        const student = inMemoryStudents.find((s) => s.id === idNum);
        if (!student) return res.status(404).json({ message: "Not found" });
        student.name = name;
        student.email = email;
        student.course = course;
        return res.json({ affectedRows: 1 });
    }
});

app.listen(5000, () => {
    console.log("✅ Server running on http://localhost:5000");
});

