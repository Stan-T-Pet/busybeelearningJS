// File: src/pages/child/lessons.js
import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import Header from "../../components/Header";
import Link from "next/link";
import connectDB from "../../server/config/database";
import Lesson from "../../server/models/Lesson";

// Fetch lessons from MongoDB on every request.
export async function getServerSideProps(context) {
  const { subject } = context.query;

  try {
    await connectDB();
    const filter = subject ? { subject } : {};
    const lessons = await Lesson.find(filter).lean();
    // Serialize Mongoose documents to JSON-friendly objects.
    const lessonsJSON = lessons.map((lesson) => JSON.parse(JSON.stringify(lesson)));
    return {
      props: { lessons: lessonsJSON, subject: subject || null },
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return {
      props: { lessons: [], subject: subject || null },
    };
  }
}

export default function Lessons({ lessons, subject }) {
  return (
    <Box sx={{ background: "linear-gradient(to bottom, #fdfbfb, #ebedee)", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ mt: 4, mb: 4 }}>
        {/* Top Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {subject ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} Lessons` : "Select a Lesson to Begin"}
          </Typography>
          <Link href="/child/dashboard" passHref legacyBehavior>
            <Button variant="outlined" color="primary">
              Go Back
            </Button>
          </Link>
        </Box>

        {/* Lessons Section */}
        <Box>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
          >
            Lessons
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 2,
              backgroundColor: "#BBE5ED",
              p: 2,
              borderRadius: 2,
            }}
          >
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <Link key={lesson._id} href={`/child/lessons/${lesson._id}`} passHref legacyBehavior>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      height: "100%",
                      fontSize: "1.1rem",
                      textTransform: "none",
                    }}
                  >
                    {lesson.title}
                  </Button>
                </Link>
              ))
            ) : (
              <Typography variant="body1" align="center">
                No lessons available.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Bottom Navigation */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Link href="/child/dashboard" passHref legacyBehavior>
            <Button variant="outlined" color="primary">
              Go Back
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}