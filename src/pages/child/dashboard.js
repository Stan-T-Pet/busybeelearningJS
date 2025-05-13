 // File: src/pages/child/dashboard.js
 import React, { useEffect, useState } from "react";
 import {
   Box,
   Container,
   Grid,
   Typography,
   CardContent,
   Button,
 } from "@mui/material";
 import Header from "@/components/Header";
 import DynamicCard from "@/components/DynamicCard";
 import ChildLayout from "../../components/Layouts/ChildLayout";
 import Link from "next/link";
/*
 *<Deprecated and has been moved to a module called SoundManager.js>

const studyTracks = {
  "Best Song Ever! (❁´◡`❁)": "https://res.cloudinary.com/dedlpzbla/video/upload/v1746206768/never_give_up_dbqlyy.mp3",
  "Lofi Beats (〃￣︶￣)人(￣︶￣〃)": "https://res.cloudinary.com/dedlpzbla/video/upload/v1746207610/lofi_rdqrkd.mp3",
  "Ambient Rain |~^///^^///^^///^~|": "https://res.cloudinary.com/dedlpzbla/video/upload/v1746208595/rain_qein7k.mp3",
  "Nature Sounds ﹏𓃗﹏𓃗﹏": "https://res.cloudinary.com/dedlpzbla/video/upload/v1746208587/forest_sswwok.mp3",
  "Hans the goat Zimmerman ( ⓛ ω ⓛ *)":"https://res.cloudinary.com/dedlpzbla/video/upload/v1746208712/corn_chivzy.mp3"
};
*/



export default function ChildDashboard() {
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch lessons and quizzes from APIs and randomize them
  useEffect(() => {
    async function fetchActivities() {
      try {
        // 1. Fetch enrolled course IDs
        const enrollmentsRes = await fetch("/api/enrollments");
        if (!enrollmentsRes.ok) throw new Error("Failed to fetch enrollments");
        const enrollmentData = await enrollmentsRes.json();
        const enrolledCourseIds = new Set(enrollmentData.enrollments.map(e => e.courseId));
  
        // 2. Fetch lessons and quizzes
        const [lessonsRes, quizzesRes] = await Promise.all([
          fetch("/api/lessons/Lesson"),
          fetch("/api/quizzes/get")
        ]);
  
        if (!lessonsRes.ok || !quizzesRes.ok) throw new Error("Failed to fetch lessons or quizzes");
  
        const lessonsData = await lessonsRes.json();
        const quizzesData = await quizzesRes.json();
  
        // 3. Filter only those from enrolled courses
        const filteredLessons = (lessonsData.lessons || []).filter(l => enrolledCourseIds.has(l.courseId));
        const filteredQuizzes = (quizzesData.quizzes || []).filter(q => enrolledCourseIds.has(q.courseId));
  
        // 4. Deduplicate by courseId (limit to 6 unique ones)
        const getUniqueByCourse = (items, limit) => {
          const seenCourses = new Set();
          const unique = [];
          for (const item of items) {
            if (!seenCourses.has(item.courseId)) {
              seenCourses.add(item.courseId);
              unique.push(item);
            }
            if (unique.length === limit) break;
          }
          return unique;
        };
  
        setLessons(getUniqueByCourse(filteredLessons, 6));
        setQuizzes(getUniqueByCourse(filteredQuizzes, 6));
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchActivities();
  }, []);
  
  

  return (
    <ChildLayout>
      <Box sx={{ background: "primary", minHeight: "100vh" }}>
        <Header />
        {/* Floating Music Panel 
          * <it is Deprecated and has been moved to a module called SoundManager.js>
        <Box
          sx={{
            position: "absolute",
            top: 120,
            left: 0,
            width: "relative",
            height: "relative",
            backgroundColor: "color.pimary",
            boxShadow: 3,
            p: 2,
            zIndex: 1200,
            shape: "circle",
            borderRadius: 30,
            textAlign: "center",
            textDecorationColor: "text.secondary",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Study Music
          </Typography>
          <Select
            value={currentTrack}
            onChange={(e) => {
              setCurrentTrack(e.target.value);
              if (audioRef) {
                audioRef.src = e.target.value;
                audioRef.play();
              }
            }}
            displayEmpty
            fullWidth
            size="small"
          >
            <MenuItem value="" color="text.secondary">Vibe Out</MenuItem>
            {Object.entries(studyTracks).map(([label, url]) => (
              <MenuItem key={label} value={url}>
                {label}
              </MenuItem>
            ))}
          </Select>
          <audio
            controls
            ref={(el) => setAudioRef(el)}
            style={{ marginTop: "1rem", width: "100%" }}
          />
        </Box>*/}

        
        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Hey there, ready to learn?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
            Choose a lesson or quiz below to get started!
          </Typography>

          {loading ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="h6">Loading activities...</Typography>
            </Box>
          ) : (
            <>
              {/* Lessons Section */}
              <Box sx={{ width: "100%", mt: 6, p: 3, borderRadius: 3, background: "linear-gradient(135deg, rgb(60, 110, 108) 0%)", boxShadow: 2 }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
                  Complete a Lesson
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                  {lessons.map((lesson) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={lesson._id}>
                      <Link href={`/child/lessons/${lesson._id}`} passHref legacyBehavior>
                        <DynamicCard
                          title={lesson.title}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: 3,
                            "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                          }}
                        >
                          <CardContent>
                            {lesson.description && (
                              <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mb: 1 }}>
                                {lesson.description}
                              </Typography>
                            )}
                            <Box sx={{ textAlign: "center" }}>
                              <Button variant="contained" color="primary">Start Lesson</Button>
                            </Box>
                          </CardContent>
                        </DynamicCard>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Quizzes Section */}
              <Box sx={{ width: "100%", mt: 6, p: 3, borderRadius: 3, background: "linear-gradient(135deg, rgb(125, 177, 170) 10%)", boxShadow: 2 }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
                  Quizzes
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                  {quizzes.map((quiz) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={quiz._id}>
                      <Link href={`/child/quiz/${quiz._id}`} passHref legacyBehavior>
                        <DynamicCard title="Quiz">
                          <CardContent>
                            <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mb: 1 }}>
                              {quiz.title || quiz.questionText || "Untitled Quiz"}
                            </Typography>
                            <Box sx={{ textAlign: "center" }}>
                              <Button variant="contained" color="primary">Take Quiz</Button>
                            </Box>
                          </CardContent>
                        </DynamicCard>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* View Progress */}
              <Box sx={{ textAlign: "center", mt: 6 }}>
                <Link href="/child/profile" passHref legacyBehavior>
                  <Button variant="outlined" color="primary">View Progress</Button>
                </Link>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </ChildLayout>
  );
}