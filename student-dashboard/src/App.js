import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch students on load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.log(err));
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setCourse("");
    setEditingId(null);
  };

  const addStudent = (e) => {
    e.preventDefault();
    // If in editing mode, call update instead
    if (editingId) return updateStudent(editingId);

    axios
      .post("http://localhost:5000/students", { name, email, course })
      .then(() => {
        fetchStudents();
        resetForm();
      })
      .catch((err) => console.log(err));
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setName(student.name || "");
    setEmail(student.email || "");
    setCourse(student.course || "");
    // scroll to top so form is visible on small screens
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateStudent = (id) => {
    axios
      .put(`http://localhost:5000/students/${id}`, { name, email, course })
      .then(() => {
        fetchStudents();
        resetForm();
      })
      .catch((err) => console.log(err));
  };

  const deleteStudent = (id) => {
    if (editingId === id) {
      // if deleting the one currently edited, clear form
      resetForm();
    }
    axios
      .delete(`http://localhost:5000/students/${id}`)
      .then(() => fetchStudents())
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <h1>Student Management System</h1>

      <form onSubmit={addStudent} className="form">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />

        <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
        {editingId && (
          <button
            type="button"
            style={{ marginLeft: 8, background: "#e74c3c" }}
            onClick={() => resetForm()}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Student List</h2>

      <div className="card-container">
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <h3>{student.name}</h3>
            <p>{student.email}</p>
            <p>{student.course}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => startEdit(student)} style={{ background: "#3498db" }}>
                Edit
              </button>
              <button onClick={() => deleteStudent(student.id)} style={{ background: "#e74c3c" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
