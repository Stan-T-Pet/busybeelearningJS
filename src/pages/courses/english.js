/* This page fetches all English lessons from the database and displays them in a grid.
* Each lesson is displayed as a card with a title, description, and a button to start the lesson.
*/
// File: src/pages/courses/english.js
import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import Header from "../../components/Header";
import Link from "next/link";
import connectDB from "../../server/config/database";
import Lesson from "../../server/models/Lesson";

// This function fetches all English lessons from the database.
export async function getServerSideProps(context) {
  try {
    await connectDB();
    // Query for lessons with subject "english" (adjust as needed)
    const lessons = await Lesson.find({ subject: "english" }).lean();
    // Serialize Mongoose objects to plain JavaScript objects.
    const lessonsJSON = lessons.map((lesson) => JSON.parse(JSON.stringify(lesson)));
    return { props: { lessons: lessonsJSON } };
  } catch (error) {
    console.error("Error fetching English lessons:", error);
    return { props: { lessons: [] } };
  }
}

export default function EnglishCourse({ lessons }) {
  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          English Course
        </Typography>
        {lessons.length > 0 ? (
          <Grid container spacing={2}>
            {lessons.map((lesson) => (
              <Grid item xs={12} sm={6} md={4} key={lesson._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{lesson.title}</Typography>
                    {lesson.description && (
                      <Typography variant="body2" color="text.secondary">
                        {lesson.description}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      <Link href={`/courses/english/${lesson._id}`} passHref legacyBehavior>
                        <Button variant="contained">Start Lesson</Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">
            No lessons available.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
