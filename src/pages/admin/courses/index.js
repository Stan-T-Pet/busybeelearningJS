// src/pages/admin/courses/courses.js
import React, { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Header from "@/components/Header";
import AdminLayout from "@/components/TEMPlayouts/AdminLayout";
import axios from "axios";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Load courses
  const fetchCourses = async () => {
    const res = await axios.get("/api/admin/courses");
    setCourses(res.data.courses);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Create
  const createCourse = async () => {
    await axios.post("/api/admin/courses", newCourse);
    setNewCourse({ title: "", description: "" });
    fetchCourses();
  };

  // Update
  const updateCourse = async (id) => {
    await axios.put(`/api/admin/courses/${id}`, newCourse);
    setEditingId(null);
    setNewCourse({ title: "", description: "" });
    fetchCourses();
  };

  // Delete
  const deleteCourse = async (id) => {
    await axios.delete(`/api/admin/courses/${id}`);
    fetchCourses();
  };

  return (
    <AdminLayout>
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Manage Courses</Typography>

        <TextField
          label="Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          fullWidth margin="normal"
        />
        
        <TextField
          label="Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          fullWidth margin="normal"
        />
        <Button variant="contained" onClick={editingId ? () => updateCourse(editingId) : createCourse}>
          {editingId ? "Update Course" : "Add Course"}
        </Button>

        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => {
                    setEditingId(course._id);
                    setNewCourse({ title: course.title, description: course.description });
                  }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => deleteCourse(course._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
    </AdminLayout>
  );
}
