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
import axios from "axios";

const QUESTION_TYPES = ["oneAnswer", "multipleChoice", "multipleAnswer"];

export default function AdminQuestionsPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [questionMeta, setQuestionMeta] = useState({
    quizId: "",
    lessonId: "",
    type: "isTrue",
  });

  const [questionData, setQuestionData] = useState({
    questionText: "",
    infoImage: "",
    options: [{ option: "", isCorrect: false, image: "" }],
    customAnswers: [{ answer: "", image: "" }],
    correctAnswers: [],
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.get("/api/admin/quizzes");
      setQuizzes(res.data.quizzes || []);
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      const res = await axios.get("/api/admin/lessons");
      setLessons(res.data.lessons || []);
    };
    fetchLessons();
  }, []);

  const handleMetaChange = (e) => {
    const { name, value } = e.target;

    // Ensure only one of quizId or lessonId can be selected
    if (name === "quizId" && value) {
      setQuestionMeta({ ...questionMeta, quizId: value, lessonId: "" });
    } else if (name === "lessonId" && value) {
      setQuestionMeta({ ...questionMeta, lessonId: value, quizId: "" });
    } else {
      setQuestionMeta({ ...questionMeta, [name]: value });
    }
  };

  const handleQuestionChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };

  const resetQuestionData = () => {
    setQuestionData({
      questionText: "",
      infoImage: "",
      options: [{ option: "", isCorrect: false, image: "" }],
      customAnswers: [{ answer: "", image: "" }],
      correctAnswers: [],
    });
  };

  const createQuestion = async () => {
    try {
      const payload = {
        ...questionMeta, // Includes `type`, `quizId`, and `lessonId`
        questionText: questionData.questionText,
        infoImage: questionData.infoImage,
      };

      if (questionMeta.type === "multipleChoice" || questionMeta.type === "multipleAnswer") {
        payload.options = questionData.options.filter(opt => opt.option.trim() !== "");
      }

      if (questionMeta.type === "multipleAnswer") {
        payload.correctAnswers = questionData.correctAnswers;
      }

      if (questionMeta.type === "oneAnswer") {
        payload.customAnswers = questionData.customAnswers.filter(ans => ans.answer.trim() !== "");
      }

      await axios.post("/api/admin/questions", payload);
      alert("Question created successfully");
      resetQuestionData();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Create New Question
          </Typography>

          <Grid container spacing={3}>
            {/* Quiz */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Quiz"
                name="quizId"
                value={questionMeta.quizId}
                onChange={handleMetaChange}
                fullWidth
                disabled={!!questionMeta.lessonId} // Disable if a Lesson is selected
              >
                {quizzes.map((quiz) => (
                  <MenuItem key={quiz._id} value={quiz._id}>
                    {quiz.title}
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
                value={questionMeta.lessonId}
                onChange={handleMetaChange}
                fullWidth
                disabled={!!questionMeta.quizId} // Disable if a Quiz is selected
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson._id} value={lesson._id}>
                    {lesson.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Question Type */}
            <Grid item xs={12}>
              <TextField
                select
                label="Question Type"
                name="type"
                value={questionMeta.type}
                onChange={handleMetaChange}
                fullWidth
              >
                {QUESTION_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Question Text */}
            <Grid item xs={12}>
              <TextField
                label="Question Text"
                name="questionText"
                value={questionData.questionText}
                onChange={handleQuestionChange}
                fullWidth
              />
            </Grid>

            {/* Info Image */}
            <Grid item xs={12}>
              <TextField
                label="Info Image URL"
                name="infoImage"
                value={questionData.infoImage}
                onChange={handleQuestionChange}
                fullWidth
              />
            </Grid>

            {/* Multiple Choice or Multiple Answer */}
            {(questionMeta.type === "multipleChoice" || questionMeta.type === "multipleAnswer") && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Options</Typography>
                {questionData.options.map((opt, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <TextField
                      label={`Option ${index + 1}`}
                      value={opt.option}
                      onChange={(e) => {
                        const updated = [...questionData.options];
                        updated[index].option = e.target.value;
                        setQuestionData({ ...questionData, options: updated });
                      }}
                      fullWidth
                    />
                    <TextField
                      label="Image URL"
                      value={opt.image}
                      onChange={(e) => {
                        const updated = [...questionData.options];
                        updated[index].image = e.target.value;
                        setQuestionData({ ...questionData, options: updated });
                      }}
                      fullWidth
                    />
                    <Button
                      variant={opt.isCorrect ? "contained" : "outlined"}
                      color="success"
                      onClick={() => {
                        const updated = [...questionData.options];
                        updated[index].isCorrect = !updated[index].isCorrect;
                        setQuestionData({ ...questionData, options: updated });
                      }}
                    >
                      {opt.isCorrect ? "Correct" : "Mark Correct"}
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    setQuestionData({
                      ...questionData,
                      options: [...questionData.options, { option: "", isCorrect: false, image: "" }],
                    })
                  }
                >
                  Add Option
                </Button>
              </Grid>
            )}

            {/* Correct Answers for Multiple Answer */}
            {questionMeta.type === "multipleAnswer" && (
              <Grid item xs={12}>
                <TextField
                  label="Correct Answers (comma-separated)"
                  name="correctAnswers"
                  value={questionData.correctAnswers.join(", ")}
                  onChange={(e) =>
                    setQuestionData({
                      ...questionData,
                      correctAnswers: e.target.value.split(",").map((ans) => ans.trim()),
                    })
                  }
                  fullWidth
                />
              </Grid>
            )}

            {/* Custom Answers for One Answer */}
            {questionMeta.type === "oneAnswer" && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Custom Answers</Typography>
                {questionData.customAnswers.map((customAnswer, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <TextField
                      label={`Answer ${index + 1}`}
                      value={customAnswer.answer}
                      onChange={(e) => {
                        const updated = [...questionData.customAnswers];
                        updated[index].answer = e.target.value;
                        setQuestionData({ ...questionData, customAnswers: updated });
                      }}
                      fullWidth
                    />
                    <TextField
                      label="Image URL"
                      value={customAnswer.image}
                      onChange={(e) => {
                        const updated = [...questionData.customAnswers];
                        updated[index].image = e.target.value;
                        setQuestionData({ ...questionData, customAnswers: updated });
                      }}
                      fullWidth
                    />
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    setQuestionData({
                      ...questionData,
                      customAnswers: [...questionData.customAnswers, { answer: "", image: "" }],
                    })
                  }
                >
                  Add Custom Answer
                </Button>
              </Grid>
            )}

            {/* Submit */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createQuestion}
                  disabled={!questionData.questionText || (!questionMeta.quizId && !questionMeta.lessonId)}
                >
                  Create Question
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}