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
  Paper,
  Box,
  Divider,
} from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";
import AdminLayout from "@/components/TEMPLayouts/AdminLayout";

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    content: "",
    courseId: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get("/api/admin/lessons");
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error("Failed to load lessons:", err.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/admin/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Failed to load courses:", err.message);
    }
  };

  const createLesson = async () => {
    try {
      await axios.post("/api/admin/lessons", newLesson);
      setNewLesson({ title: "", description: "", content: "", courseId: "" });
      fetchLessons();
    } catch (err) {
      console.error("Lesson creation failed:", err.message);
    }
  };

  const updateLesson = async (id) => {
    try {
      await axios.put(`/api/admin/lessons/${id}`, newLesson);
      setEditingId(null);
      setNewLesson({ title: "", description: "", content: "", courseId: "" });
      fetchLessons();
    } catch (err) {
      console.error("Lesson update failed:", err.message);
    }
  };

  const deleteLesson = async (id) => {
    try {
      await axios.delete(`/api/admin/lessons/${id}`);
      fetchLessons();
    } catch (err) {
      console.error("Lesson deletion failed:", err.message);
    }
  };

  // Group lessons by courseId
  const groupedLessons = courses.map(course => ({
    ...course,
    lessons: lessons.filter(lesson => lesson.courseId === course._id),
  }));

  return (
    <AdminLayout>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Manage Lessons</Typography>

          <TextField
            label="Title"
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Description"
            value={newLesson.description}
            onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Content (Markdown/HTML)"
            multiline
            minRows={4}
            value={newLesson.content}
            onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            select
            label="Link to Course"
            value={newLesson.courseId}
            onChange={(e) => setNewLesson({ ...newLesson, courseId: e.target.value })}
            fullWidth margin="normal"
          >
            {courses.map(course => (
              <MenuItem key={course._id} value={course._id}>
                {course.title}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={2} textAlign="center">
            <Button
              variant="contained"
              onClick={editingId ? () => updateLesson(editingId) : createLesson}
              disabled={!newLesson.title || !newLesson.courseId}
            >
              {editingId ? "Update Lesson" : "Add Lesson"}
            </Button>
          </Box>
        </Paper>

        {/* Grouped Lessons by Course */}
        {groupedLessons.map(course => (
          <Box key={course._id} mt={5}>
            <Typography variant="h6" gutterBottom>
              {course.title}
            </Typography>
            {course.lessons.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No lessons linked to this course.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Preview</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.lessons.map((lesson) => (
                    <TableRow key={lesson._id}>
                      <TableCell>{lesson.title}</TableCell>
                      <TableCell>{lesson.description}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            border: "1px solid #ccc",
                            padding: 1,
                            borderRadius: 1,
                            maxHeight: 100,
                            overflow: "auto",
                            maxWidth: 300,
                          }}
                          dangerouslySetInnerHTML={{ __html: lesson.content || "<i>No content</i>" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setEditingId(lesson._id);
                            setNewLesson({
                              title: lesson.title,
                              description: lesson.description,
                              content: lesson.content || "",
                              courseId: lesson.courseId,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => deleteLesson(lesson._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Divider sx={{ my: 3 }} />
          </Box>
        ))}
      </Container>
    </AdminLayout>
  );
}
