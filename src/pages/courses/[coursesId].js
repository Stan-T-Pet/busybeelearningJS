import React from "react";
import Link from "next/link";
import { Container, Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";
import connectDB from "../../server/config/database";
import Lesson from "../../server/models/Lesson";

/*const validSubjects = [
  "english",
  "mathematics",
  "history",
  "html",
  "japanese",
  "javascript",
];*/

export async function getServerSideProps(context) {
  const { coursesId } = context.params;

  if (!validSubjects.includes(coursesId)) {
    return {
      redirect: {
        destination: "/courses",
        permanent: false,
      },
    };
  }

  try {
    await connectDB();
    const lessons = await Lesson.find({ subject: coursesId }).lean();
    const lessonsJSON = lessons.map((lesson) => JSON.parse(JSON.stringify(lesson)));
    return { props: { lessons: lessonsJSON, subject: coursesId } };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return { props: { lessons: [], subject: coursesId } };
  }
}

export default function CoursePage({ lessons, subject }) {
  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {subject.charAt(0).toUpperCase() + subject.slice(1)} Course
        </Typography>
        {lessons.length > 0 ? (
          <Grid container spacing={2}>
            {lessons.map((lesson) => (
              <Grid item xs={12} sm={6} md={4} key={lesson._id}>
                <DynamicCard>
                  <CardContent>
                    <Typography variant="h6">{lesson.title}</Typography>
                    {lesson.description && (
                      <Typography variant="body2" color="text.secondary">
                        {lesson.description}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      <Link href={`/lessons/${lesson._id}`} passHref legacyBehavior>
                        <Button variant="contained">Start Lesson</Button>
                      </Link>
                    </Box>
                  </CardContent>
                </DynamicCard>
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
