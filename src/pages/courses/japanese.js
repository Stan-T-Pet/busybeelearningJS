// File: src/pages/courses/japanese.js

import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import Header from "../../components/Header";
import Link from "next/link";
import connectDB from "../../server/config/database";
import Lesson from "../../server/models/Lesson";

export async function getServerSideProps(context) {
  try {
    await connectDB();
    const lessons = await Lesson.find({ subject: "japanese" }).lean();
    const lessonsJSON = lessons.map((lesson) => JSON.parse(JSON.stringify(lesson)));
    return { props: { lessons: lessonsJSON } };
  } catch (error) {
    console.error("Error fetching japanese lessons:", error);
    return { props: { lessons: [] } };
  }
}

export default function japaneseCourse({ lessons }) {
  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          japanese Course
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
                      <Link href={`/courses/japanese/${lesson._id}`} passHref>
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
