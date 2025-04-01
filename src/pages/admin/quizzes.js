// src/pages/admin/quiz.js
import React, { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";

export default function AdminquizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Load Quizzes
  const fetchQuizzes = async () => {
    const res = await axios.get("/api/quizzes");
    setQuizzes(res.data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Create
  const createQuiz = async () => {
    await axios.post("/api/quizzes", newQuiz);
    setNewQuiz({ title: "", description: "" });
    fetchQuizzes();
  };

  // Update
  const updateQuiz = async (id) => {
    await axios.put(`/api/quizzes/${id}`, newQuiz);
    setEditingId(null);
    setNewQuiz({ title: "", description: "" });
    fetchQuizzes();
  };

  // Delete
  const deleteQuiz = async (id) => {
    await axios.delete(`/api/quizzes/${id}`);
    fetchQuizzes();
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Manage Quizzes</Typography>

        <TextField
          label="Title"
          value={newQuiz.title}
          onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
          fullWidth margin="normal"
        />
        <TextField
          label="Description"
          value={newQuiz.description}
          onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
          fullWidth margin="normal"
        />
        <Button variant="contained" onClick={editingId ? () => updateQuiz(editingId) : createQuiz}>
          {editingId ? "Update Quiz" : "Add Quiz"}
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
            {quizzes.map((quiz) => (
              <TableRow key={quiz._id}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => {
                    setEditingId(quiz._id);
                    setNewQuiz({ title: quiz.title, description: quiz.description });
                  }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => deleteQuiz(quiz._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
}
