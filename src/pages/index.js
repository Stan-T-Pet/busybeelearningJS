// File: src/pages/index.js

import { Typography, Container, Grid, Paper, Button } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Header from "../components/Header";
import connectDB from "../server/config/database";
import Course from "../server/models/Course";

export default function Home({ randomCourses }) {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Welcome to Busy Bee Learning!
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Empowering young learners with interactive Courses
        </Typography>
        
        <Grid container spacing={3} sx={{ marginTop: 4 }}>
          {randomCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>{course.title}</Typography>
                <Typography variant="body1" gutterBottom>
                  {course.description.length > 100 ? course.description.slice(0, 100) + "..." : course.description}
                </Typography>
                <Link
                  href={
                    session
                      ? `/child/courses/${course._id}` // if logged in, go straight to lessons
                      : `/login?callbackUrl=/child/courses/${course._id}` // if not logged in, go to login first
                  }
                  passHref
                  legacyBehavior>
                  <Button variant="contained" color="primary">
                    Start Learning
                  </Button>
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

// Fetch 3 random courses from MongoDB
export async function getServerSideProps() {
  const connect = await connectDB();

  try {
    const courses = await Course.aggregate([{ $sample: { size: 3 } }]); // RANDOM 3 courses
    const randomCourses = courses.map((course) => JSON.parse(JSON.stringify(course)));

    return {
      props: {
        randomCourses,
      },
    };
  } catch (error) {
    console.error("Error fetching random courses:", error);
    return {
      props: {
        randomCourses: [],
      },
    };
  }
}
