import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Container, Typography, Box, Button, Radio, RadioGroup, FormControlLabel,
  FormControl, FormLabel, TextField, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import ChildLayout from "@/components/Layouts/ChildLayout";
import Header from "../../../components/Header";
import RenderMath from "@/components/RenderMath";

export default function QuizDetails({ quiz }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) return;

    let calculatedScore = 0;
    let total = 1;

    if (quiz.type === "isTrue") {
      const isCorrect = String(quiz.correctAnswer) === String(answers.trueFalse);
      if (isCorrect) calculatedScore++;
    }

    if (quiz.type === "multipleChoice") {
      const correct = quiz.options.find((o) => o.isCorrect)?.text;
      if (answers.choice === correct) calculatedScore++;
    }

    if (quiz.type === "multipleSteps") {
      total = quiz.steps.length;
      quiz.steps.forEach((step, idx) => {
        const userAnswer = (answers[`step_${idx}`] || "").trim().toLowerCase();
        if (userAnswer === step.correctAnswer.trim().toLowerCase()) {
          calculatedScore++;
        }
      });
    }

    setScore(calculatedScore);

    try {
      await axios.post("/api/progress/update", {
        contentId: quiz._id,
        contentType: "quiz",
        childId: session.user.id,
        courseId: quiz.courseId,
        action: "complete",
        score: calculatedScore,
      });

      setFeedback(`You scored ${calculatedScore} out of ${total}`);
      setSubmitted(true);
      setOpenDialog(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setFeedback("There was an error submitting your quiz.");
    }
  };

  return (
    <ChildLayout title="Quiz" description="Take the quiz to test your knowledge.">
      <Box sx={{ background: "theme.primary", minHeight: "100vh" }}>
        <Header />
        <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              {quiz.title}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              <RenderMath>{quiz.questionText}</RenderMath>
            </Typography>

            {/* Boolean Quiz */}
            {quiz.type === "isTrue" && (
              <FormControl component="fieldset" sx={{ my: 3 }}>
                <FormLabel component="legend">
                  <RenderMath>{quiz.questionText}</RenderMath>
                </FormLabel>
                <RadioGroup
                  row
                  value={answers.trueFalse ?? ""}
                  onChange={(e) => handleChange("trueFalse", e.target.value)}
                >
                  {["true", "false"].map((val) => (
                    <FormControlLabel
                      key={val}
                      value={val}
                      control={<Radio />}
                      label={val}
                      disabled={submitted}
                      sx={{
                        color:
                          submitted && String(quiz.correctAnswer) === val
                            ? "green"
                            : submitted && answers.trueFalse === val
                            ? "red"
                            : undefined,
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {/* MCQ Quiz */}
            {quiz.type === "multipleChoice" && (
              <FormControl component="fieldset" sx={{ my: 3 }}>
                <FormLabel component="legend">
                  <RenderMath>{quiz.questionText}</RenderMath>
                </FormLabel>
                <RadioGroup
                  value={answers.choice ?? ""}
                  onChange={(e) => handleChange("choice", e.target.value)}
                >
                  {quiz.options.map((opt, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={opt.text}
                      control={<Radio />}
                      label={<RenderMath>{opt.text}</RenderMath>}
                      disabled={submitted}
                      sx={{
                        color:
                          submitted && opt.isCorrect
                            ? "green"
                            : submitted && answers.choice === opt.text
                            ? "red"
                            : undefined,
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {/* Step-by-step Quiz */}
            {quiz.type === "multipleSteps" && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <RenderMath>{quiz.questionText}</RenderMath>
                </Typography>
                {quiz.steps.map((step, idx) => {
                  const userAnswer = answers[`step_${idx}`] || "";
                  const isCorrect =
                    userAnswer.trim().toLowerCase() === step.correctAnswer.trim().toLowerCase();
                  return (
                    <TextField
                      key={idx}
                      label={`Step ${idx + 1}: ${step.stepText}`}
                      fullWidth
                      margin="normal"
                      value={userAnswer}
                      onChange={(e) => handleChange(`step_${idx}`, e.target.value)}
                      disabled={submitted}
                      sx={{
                        input: {
                          color: submitted ? (isCorrect ? "green" : "red") : "inherit",
                        },
                      }}
                    />
                  );
                })}
              </Box>
            )}

            {!submitted ? (
              <Box mt={4} textAlign="center">
                <Button variant="contained" onClick={handleSubmit}>
                  Submit Quiz
                </Button>
              </Box>
            ) : (
              <Typography variant="h6" color="success.main" align="center" sx={{ mt: 4 }}>
                {feedback}
              </Typography>
            )}
          </Paper>
        </Container>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Quiz Completed</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              You scored {score}{" "}
              {quiz.type === "multipleSteps" ? `out of ${quiz.steps.length}` : "point(s)"}.
            </Typography>
            <Typography>What would you like to do next?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => router.push("/child/dashboard")}>Return to Dashboard</Button>
            <Button
              onClick={() => {
                setOpenDialog(false);
                router.push("/child/lessons");
              }}
              variant="contained"
            >
              Continue to Next Lesson
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ChildLayout>
  );
}

export async function getServerSideProps(context) {
  const { quizId } = context.query;
  const connectDB = (await import("../../../server/config/database")).default;
  const Quiz = (await import("../../../server/models/Quiz")).default;

  try {
    await connectDB();
    const quiz = await Quiz.findById(quizId).lean();
    return {
      props: { quiz: JSON.parse(JSON.stringify(quiz)) },
    };
  } catch (error) {
    console.error("Failed to load quiz:", error);
    return { notFound: true };
  }
}