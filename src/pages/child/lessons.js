import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import Header from "../../components/Header";
import Link from "next/link";
import connectDB from "../../server/config/database";
import Lesson from "../../server/models/Lesson";
import Course from "../../server/models/Course";
import ChildLayout from "../../components/Layouts/ChildLayout";

// Color palette
const sectionColors = [
  "#f1f8e9", "#e3f2fd", "#fffde7", "#fce4ec", "#ede7f6", "#f3e5f5"
];

// SSR: Fetch lessons + course titles
export async function getServerSideProps(context) {
  const { subject } = context.query;

  try {
    await connectDB();
    const filter = subject ? { subject } : {};
    const lessons = await Lesson.find(filter).lean();
    const courses = await Course.find({}).lean();

    const lessonsJSON = lessons.map((lesson) => JSON.parse(JSON.stringify(lesson)));
    const courseMap = {};
    courses.forEach((course) => {
      courseMap[course._id.toString()] = course.title;
    });

    return {
      props: {
        lessons: lessonsJSON,
        subject: subject || null,
        courseTitles: courseMap
      }
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return { props: { lessons: [], subject: subject || null, courseTitles: {} } };
  }
}

export default function Lessons({ lessons, subject, courseTitles }) {
  // Group lessons by courseId
  const grouped = {};
  lessons.forEach((lesson) => {
    const courseId = lesson.courseId || "Unassigned";
    if (!grouped[courseId]) grouped[courseId] = [];
    grouped[courseId].push(lesson);
  });

  return (
    <ChildLayout>
      <Box sx={{ background: "linear-gradient(to bottom,rgba(146, 223, 223, 0.19),rgba(7, 74, 107, 0.86))", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ mt: 4, mb: 4 }}>
          {/* Top Bar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {subject ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} Lessons` : "Select a Lesson to Begin"}
            </Typography>
            <Link href="/child/dashboard" passHref legacyBehavior>
              <Button variant="outlined" color="primary">Go Back</Button>
            </Link>
          </Box>

          {/* Grouped Lessons */}
          {Object.entries(grouped).map(([courseId, group], idx) => (
            <Box
              key={courseId}
              sx={{
                mt: 4,
                mb: 5,
                p: 3,
                borderRadius: 3,
                backgroundColor: sectionColors[idx % sectionColors.length],
                boxShadow: 2
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Course: {courseTitles[courseId] || "Unlinked Course"}
              </Typography>

              <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 2
              }}>
                {group.map((lesson) => (
                  <Link key={lesson._id} href={`/child/lessons/${lesson._id}`} passHref legacyBehavior>
                    <Button variant="contained" color="primary" sx={{ fontSize: "1.1rem", textTransform: "none" }}>
                      {lesson.title}
                    </Button>
                  </Link>
                ))}
              </Box>
            </Box>
          ))}

          {/* Bottom Navigation */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Link href="/child/dashboard" passHref legacyBehavior>
              <Button variant="outlined" color="primary">Go Back</Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </ChildLayout>
  );
}