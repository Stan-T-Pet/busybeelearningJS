// File: src/pages/admin/quizzes.js

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
} from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("/api/admin/quizzes");
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error("Failed to load quizzes:", err.message);
    }
  };

  const createQuiz = async () => {
    try {
      await axios.post("/api/admin/quizzes", newQuiz);
      setNewQuiz({ title: "", description: "" });
      fetchQuizzes();
    } catch (err) {
      console.error("Quiz creation failed:", err.message);
    }
  };

  const updateQuiz = async (id) => {
    try {
      await axios.put(`/api/admin/quizzes/${id}`, newQuiz);
      setEditingId(null);
      setNewQuiz({ title: "", description: "" });
      fetchQuizzes();
    } catch (err) {
      console.error("Quiz update failed:", err.message);
    }
  };

  const deleteQuiz = async (id) => {
    try {
      await axios.delete(`/api/admin/quizzes/${id}`);
      fetchQuizzes();
    } catch (err) {
      console.error("Quiz deletion failed:", err.message);
    }
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
        <Button
          variant="contained"
          onClick={editingId ? () => updateQuiz(editingId) : createQuiz}
          disabled={!newQuiz.title}
        >
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
                  }}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => deleteQuiz(quiz._id)}>
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
