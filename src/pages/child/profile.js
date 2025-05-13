import { useSession } from "next-auth/react";
import {
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  LinearProgress,
  ListItemSecondaryAction,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function ChildProfile() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user;

  useEffect(() => {
    async function fetchProgress() {
      if (!user?.id || user.role !== "child") return;
      try {
        const res = await fetch(`/api/progress/getChildProgress?childId=${user.id}`);
        const data = await res.json();
        setProgress(data);
      } catch (err) {
        console.error("Failed to fetch child progress:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) fetchProgress();
  }, [user]);

  if (status === "loading" || loading) {
    return (
      <Container>
        <Header />
        <Typography sx={{ mt: 4 }}>
          <CircularProgress /> Loading profile...
        </Typography>
      </Container>
    );
  }

  if (!session || session.user.role !== "child") {
    return (
      <Container>
        <Header />
        <Typography>You are not authorized to view this page.</Typography>
      </Container>
    );
  }

  // Aggregate progress by course
  const courseMap = {};
  progress.lessons?.forEach((l) => {
    if (!courseMap[l.courseTitle]) courseMap[l.courseTitle] = { lessons: [], quizzes: [] };
    courseMap[l.courseTitle].lessons.push(l);
  });
  progress.quizzes?.forEach((q) => {
    if (!courseMap[q.courseTitle]) courseMap[q.courseTitle] = { lessons: [], quizzes: [] };
    courseMap[q.courseTitle].quizzes.push(q);
  });

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar sx={{ width: 100, height: 100, fontSize: 40 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Role: <strong>{user.role}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* Course Summary */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Course Progress</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(courseMap).map(([title, items], i) => {
              const total = items.lessons.length + items.quizzes.length;
              const completedLessons = items.lessons.filter((l) => l.progress === 100).length;
              const completedQuizzes = items.quizzes.filter((q) => q.completedAt).length;
              const percent = total > 0 ? Math.round(((completedLessons + completedQuizzes) / total) * 100) : 0;

              return (
                <Box key={i} sx={{ mb: 3 }}>
                  <Typography fontWeight="bold">{title}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{ height: 8, borderRadius: 5, my: 1 }}
                  />
                  <Typography variant="caption">{percent}% completed</Typography>
                </Box>
              );
            })}
          </AccordionDetails>
        </Accordion>

        {/* Lessons Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Lessons</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {progress.lessons?.length ? (
              <List dense>
                {progress.lessons.map((lesson, i) => (
                  <ListItem key={i} divider>
                    <ListItemText
                      primary={lesson.title}
                      secondary={`Course: ${lesson.courseTitle}`}
                    />
                    <ListItemSecondaryAction sx={{ width: "40%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={lesson.progress}
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                      <Typography variant="caption">{lesson.progress}%</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No lesson activity yet.</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Quizzes Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Quizzes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {progress.quizzes?.length ? (
              <List dense>
                {progress.quizzes.map((quiz, i) => {
                  const percent = quiz.totalScore
                    ? Math.round((quiz.score / quiz.totalScore) * 100)
                    : 0;
                  return (
                    <ListItem key={i} divider>
                      <ListItemText
                        primary={quiz.title}
                        secondary={`Course: ${quiz.courseTitle}`}
                      />
                      <ListItemSecondaryAction sx={{ width: "40%" }}>
                        <LinearProgress
                          variant="determinate"
                          value={percent}
                          sx={{ height: 8, borderRadius: 5 }}
                        />
                        <Typography variant="caption">{percent}%</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography>No quiz activity yet.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Container>
    </>
  );
}