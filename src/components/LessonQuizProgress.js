// File: src/components/LessonQuizProgress.js
import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

export default function LessonQuizProgress() {
  // State for lessons and quizzes
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Fetch lessons progress data
  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch("/api/lessons/progress");
        if (!res.ok) {
          console.error("Failed to fetch lessons progress");
          return;
        }
        const data = await res.json();
        setLessons(data.lessons || []);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    }

    async function fetchQuizzes() {
      try {
        const res = await fetch("/api/quizzes/progress");
        if (!res.ok) {
          console.error("Failed to fetch quizzes progress");
          return;
        }
        const data = await res.json();
        setQuizzes(data.quizzes || []);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    }

    fetchLessons();
    fetchQuizzes();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Lesson Progress
      </Typography>
      {lessons.length > 0 ? (
        lessons.map((lesson, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography>{lesson.title}</Typography>
            <LinearProgress
              variant="determinate"
              value={lesson.progress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#c8eae1",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#00cc99",
                },
              }}
            />
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No lessons taken yet.
        </Typography>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Quiz Progress
      </Typography>
      {quizzes.length > 0 ? (
        quizzes.map((quiz, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography>{quiz.title}</Typography>
            <LinearProgress
              variant="determinate"
              value={quiz.score} // or quiz.progress, depending on your data shape
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#ff9800",
                },
              }}
            />
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No quizzes taken yet.
        </Typography>
      )}
    </Box>
  );
}
