import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import Header from "../../components/Header";
import AdminLayout from "../../components/TEMPLayouts/AdminLayout";
import axios from "axios";

const QUIZ_TYPES = ["isTrue", "multipleChoice", "multipleSteps"];

export default function AdminQuizzesPage() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [quizMeta, setQuizMeta] = useState({
    courseId: "",
    lessonId: "",
    type: "isTrue",
  });

  const [questionData, setQuestionData] = useState({
    questionText: "",
    correctAnswer: "",
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

  useEffect(() => {
    if (!quizMeta.courseId) {
      setLessons([]);
      return;
    }

    const fetchLessons = async () => {
      try {
        const res = await axios.get(`/api/admin/lessons?courseId=${quizMeta.courseId}`);
        setLessons(res.data.lessons || []);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      }
    };

    fetchLessons();
  }, [quizMeta.courseId]);

  const handleMetaChange = (e) => {
    setQuizMeta({ ...quizMeta, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };

  const resetQuestionData = () => {
    setQuestionData({
      questionText: "",
      correctAnswer: "",
      options: [{ text: "", isCorrect: false }],
      steps: [""],
    });
  };

  const createQuiz = async () => {
    try {
      const payload = {
        ...quizMeta,
        questionText: questionData.questionText,
      };

      if (quizMeta.type === "isTrue") {
        payload.correctAnswer = questionData.correctAnswer.toLowerCase() === "true";
      }

      if (quizMeta.type === "multipleChoice") {
        payload.options = questionData.options.filter(opt => opt.text.trim() !== "");
      }

      if (quizMeta.type === "multipleSteps") {
        payload.steps = questionData.steps.filter(step => step.trim() !== "");
      }

      await axios.post("/api/admin/quizzes", payload);
      alert("Quiz created successfully");
      resetQuestionData();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <AdminLayout>
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Create New Quiz
          </Typography>

          <Grid container spacing={3}>
            {/* Course */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Course"
                name="courseId"
                value={quizMeta.courseId}
                onChange={handleMetaChange}
                fullWidth
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Lesson */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Lesson"
                name="lessonId"
                value={quizMeta.lessonId}
                onChange={handleMetaChange}
                fullWidth
                disabled={!lessons.length}
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson._id} value={lesson._id}>
                    {lesson.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Quiz Type */}
            <Grid item xs={12}>
              <TextField
                select
                label="Quiz Type"
                name="type"
                value={quizMeta.type}
                onChange={handleMetaChange}
                fullWidth
              >
                {QUIZ_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Question */}
            <Grid item xs={12}>
              <TextField
                label="Question Text"
                name="questionText"
                value={questionData.questionText}
                onChange={handleQuestionChange}
                fullWidth
              />
            </Grid>

            {/* True/False */}
            {quizMeta.type === "isTrue" && (
              <Grid item xs={12}>
                <TextField
                  label="Answer (true/false)"
                  name="correctAnswer"
                  value={questionData.correctAnswer}
                  onChange={handleQuestionChange}
                  fullWidth
                />
              </Grid>
            )}

            {/* Multiple Choice */}
            {quizMeta.type === "multipleChoice" && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Options</Typography>
                {questionData.options.map((opt, index) => (
                  <TextField
                    key={index}
                    label={`Option ${index + 1}`}
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...questionData.options];
                      updated[index].text = e.target.value;
                      setQuestionData({ ...questionData, options: updated });
                    }}
                    fullWidth
                    margin="dense"
                  />
                ))}
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    setQuestionData({
                      ...questionData,
                      options: [...questionData.options, { text: "", isCorrect: false }],
                    })
                  }
                >
                  Add Option
                </Button>
              </Grid>
            )}

            {/* Multi-Step */}
            {quizMeta.type === "multipleSteps" && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Steps</Typography>
                {questionData.steps.map((step, index) => (
                  <TextField
                    key={index}
                    label={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) => {
                      const updated = [...questionData.steps];
                      updated[index] = e.target.value;
                      setQuestionData({ ...questionData, steps: updated });
                    }}
                    fullWidth
                    margin="dense"
                  />
                ))}
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    setQuestionData({
                      ...questionData,
                      steps: [...questionData.steps, ""],
                    })
                  }
                >
                  Add Step
                </Button>
              </Grid>
            )}

            {/* Submit */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createQuiz}
                  disabled={
                    !questionData.questionText ||
                    !quizMeta.courseId ||
                    !quizMeta.lessonId
                  }
                >
                  Create Quiz
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
    </AdminLayout>
  );
}
