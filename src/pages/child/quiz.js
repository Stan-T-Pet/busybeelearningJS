// File: src/pages/child/quiz.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const ChildQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes/fetchQuiz");
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes.");
        }
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quizzes
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : quizzes.length === 0 ? (
        <Typography>No quizzes available.</Typography>
      ) : (
        quizzes.map((quiz) => (
          <Box
            key={quiz._id}
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 1,
            }}
          >
            <Typography variant="h6">{quiz.prompt}</Typography>
            <Typography variant="body1">
              Answer: {quiz.answer ? quiz.answer : "No answer provided"}
            </Typography>
          </Box>
        ))
      )}
    </Container>
  );
};

export default ChildQuiz;
