// File: src/pages/admin/quizzes/index.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";

export default function AdminQuizzesPage() {
  const [courses, setCourses] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    questionText: "",
    correctAnswer: "",
    courseId: "",
    subject: "english",
    type: "isTrue",
    options: [{ text: "", isCorrect: false }],
    steps: [""],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get("/api/admin/courses");
      setCourses(res.data.courses || []);
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setNewQuiz({ ...newQuiz, [e.target.name]: e.target.value });
  };

  const createQuiz = async () => {
    try {
      const payload = {
        type: newQuiz.type,
        questionText: newQuiz.questionText,
        subject: newQuiz.subject.toLowerCase(),
        courseId: newQuiz.courseId,
      };

      if (newQuiz.type === "isTrue") {
        payload.correctAnswer = newQuiz.correctAnswer.toLowerCase() === "true";
      }

      if (newQuiz.type === "multipleChoice") {
        payload.options = newQuiz.options.filter(opt => opt.text.trim() !== "");
      }

      if (newQuiz.type === "multipleSteps") {
        payload.steps = newQuiz.steps.filter(step => step.trim() !== "");
      }

      await axios.post("/api/admin/quizzes", payload);
      alert("Quiz created successfully");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create Quiz
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Question"
              name="questionText"
              value={newQuiz.questionText}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Answer"
              name="correctAnswer"
              value={newQuiz.correctAnswer}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Subject"
              name="subject"
              value={newQuiz.subject}
              onChange={handleChange}
              fullWidth
            >
              {["english", "math", "history", "japanese", "html"].map((subj) => (
                <MenuItem key={subj} value={subj}>
                  {subj.charAt(0).toUpperCase() + subj.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Quiz Type"
              name="type"
              value={newQuiz.type}
              onChange={handleChange}
              fullWidth
            >
              {["isTrue", "multipleChoice", "multipleSteps"].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {newQuiz.type === "multipleChoice" && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Options</Typography>
              {newQuiz.options.map((opt, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  value={opt.text}
                  onChange={(e) => {
                    const updated = [...newQuiz.options];
                    updated[index].text = e.target.value;
                    setNewQuiz({ ...newQuiz, options: updated });
                  }}
                  fullWidth
                  margin="dense"
                />
              ))}
              <Button
                variant="outlined"
                onClick={() =>
                  setNewQuiz({
                    ...newQuiz,
                    options: [...newQuiz.options, { text: "", isCorrect: false }],
                  })
                }
              >
                Add Option
              </Button>
            </Grid>
          )}

          {newQuiz.type === "multipleSteps" && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Steps</Typography>
              {newQuiz.steps.map((step, index) => (
                <TextField
                  key={index}
                  label={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => {
                    const updated = [...newQuiz.steps];
                    updated[index] = e.target.value;
                    setNewQuiz({ ...newQuiz, steps: updated });
                  }}
                  fullWidth
                  margin="dense"
                />
              ))}
              <Button
                variant="outlined"
                onClick={() =>
                  setNewQuiz({ ...newQuiz, steps: [...newQuiz.steps, ""] })
                }
              >
                Add Step
              </Button>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              select
              label="Course"
              name="courseId"
              value={newQuiz.courseId}
              onChange={handleChange}
              fullWidth
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={createQuiz}
                disabled={!newQuiz.questionText || !newQuiz.courseId}
              >
                Create Quiz
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
