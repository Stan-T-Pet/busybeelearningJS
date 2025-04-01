// File: src/pages/admin/lessons.js
import React, { useEffect, useState } from "react";

import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
} from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    subject: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchLessons = async () => {
    const res = await axios.get("/api/admin/lessons");
    setLessons(res.data.lessons);
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/admin/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Failed to load courses:", err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchCourses();
  }, []);

  const createLesson = async () => {
    try {
      await axios.post("/api/admin/lessons", newLesson);
      setNewLesson({ title: "", description: "", subject: "" });
      fetchLessons();
    } catch (err) {
      console.error("Lesson creation failed:", err.response?.data?.error || err.message);
    }
  };

  const updateLesson = async (id) => {
    try {
      await axios.put(`/api/admin/lessons/${id}`, newLesson);
      setEditingId(null);
      setNewLesson({ title: "", description: "", subject: "" });
      fetchLessons();
    } catch (err) {
      console.error("Lesson update failed:", err.response?.data?.error || err.message);
    }
  };

  const deleteLesson = async (id) => {
    try {
      await axios.delete(`/api/admin/lessons/${id}`);
      fetchLessons();
    } catch (err) {
      console.error("Lesson deletion failed:", err.response?.data?.error || err.message);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Lessons
        </Typography>

        <TextField
          label="Title"
          value={newLesson.title}
          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Description"
          value={newLesson.description}
          onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
          fullWidth
          margin="normal"
        />

        <TextField
          select
          label="Subject"
          value={newLesson.subject}
          onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
          fullWidth
          margin="normal"
        >
          {courses.map((course) => (
            <MenuItem key={course._id} value={course.title}>
              {course.title.charAt(0).toUpperCase() + course.title.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={editingId ? () => updateLesson(editingId) : createLesson}
          disabled={!newLesson.title || !newLesson.subject}
        >
          {editingId ? "Update Lesson" : "Add Lesson"}
        </Button>

        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map((lesson) => (
              <TableRow key={lesson._id}>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.description}</TableCell>
                <TableCell>{lesson.subject}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditingId(lesson._id);
                      setNewLesson({
                        title: lesson.title,
                        description: lesson.description,
                        subject: lesson.subject,
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this lesson?")) {
                        deleteLesson(lesson._id);
                      }
                    }}                    
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
}