import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import Link from "next/link";
import Header from "../../components/Header";
import ChildLayout from "../../components/Layouts/ChildLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

// Color palette
const sectionColors = ["#E3F2FD", "#FFF3E0", "#FCE4EC", "#E8F5E9", "#EDE7F6", "#F3E5F5"];

export default function QuizPage({ initialQuizzes, courseTitles }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { courseId } = router.query;

  const [mounted, setMounted] = useState(false);
  const [quizzes, setQuizzes] = useState(initialQuizzes || []);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!session?.user?.id || !quizzes.length) return;

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`/api/lessons/progress?childId=${session.user.id}`);
        const progressData = res.data.progress || [];
        const map = {};
        progressData
          .filter((entry) => entry.contentType === "quiz")
          .forEach((entry) => {
            map[entry.contentId] = entry.completed ? "completed" : "started";
          });
        setProgressMap(map);
      } catch (err) {
        console.error("Error loading progress data:", err);
      }
    };

    fetchProgress();
  }, [session?.user?.id, quizzes]);

  if (!mounted) return null;

  // Group quizzes by courseId
  const grouped = {};
  quizzes.forEach((quiz) => {
    const cid = quiz.courseId || "Unlinked";
    if (!grouped[cid]) grouped[cid] = [];
    grouped[cid].push(quiz);
  });

  return (
    <ChildLayout>
      <Box sx={{ background: "linear-gradient(to bottom, #fdfbfb, #ebedee)", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Quizzes
            </Typography>
            <Link href="/child/dashboard" passHref legacyBehavior>
              <Button variant="outlined" color="primary">Go Back</Button>
            </Link>
          </Box>

          {/* Grouped Quiz Lists */}
          {Object.entries(grouped).map(([cid, quizGroup], idx) => {
            const background = sectionColors[idx % sectionColors.length];
            return (
              <Box key={cid} sx={{ p: 3, borderRadius: 2, backgroundColor: background, mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  {courseTitles[cid] || "Unlinked Course"}
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: 2
                  }}
                >
                  {quizGroup.map((quiz) => {
                    const status = progressMap[quiz._id];
                    const color =
                      status === "completed" ? "success" :
                      status === "started" ? "warning" :
                      "secondary";
                    const badge =
                      status === "completed" ? " ✓ Completed" :
                      status === "started" ? " • In Progress" :
                      "";
                    return (
                      <Link key={quiz._id} href={`/child/quiz/${quiz._id}`} passHref legacyBehavior>
                        <Button
                          variant="contained"
                          color={color}
                          sx={{ textTransform: "none", justifyContent: "flex-start" }}
                        >
                          {quiz.title || quiz.questionText || "Untitled Quiz"} {badge}
                        </Button>
                      </Link>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Container>
      </Box>
    </ChildLayout>
  );
}

// SSR: Fetch quizzes and course titles
export async function getServerSideProps(context) {
  const { courseId } = context.query;
  const connectDB = (await import("../../server/config/database")).default;
  const Quiz = (await import("../../server/models/Quiz")).default;
  const Course = (await import("../../server/models/Course")).default;

  try {
    await connectDB();
    const filter = courseId ? { courseId } : {};
    const quizzes = await Quiz.find(filter).lean();
    const courses = await Course.find({}).lean();

    const quizzesJSON = quizzes.map((quiz) => JSON.parse(JSON.stringify(quiz)));
    const courseMap = {};
    courses.forEach((course) => {
      courseMap[course._id.toString()] = course.title;
    });

    return {
      props: {
        initialQuizzes: quizzesJSON,
        courseTitles: courseMap
      },
    };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return {
      props: {
        initialQuizzes: [],
        courseTitles: {}
      },
    };
  }
}