// file: src\pages\courses\index.js

import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import Link from "next/link";

const availableCourses = [
  { subject: "english", title: "English" },
  { subject: "mathematics", title: "Mathematics" },
  { subject: "history", title: "History" },
  { subject: "html", title: "HTML Basics" },
  { subject: "japanese", title: "Japanese" },
  { subject: "javascript", title: "JavaScript" },
];

export default function CoursesLanding() {
  return (
    <Box>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Available Courses
        </Typography>
        <Grid container spacing={4}>
          {availableCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.subject}>
              <DynamicCard>
                <CardContent>
                  <Typography variant="h5" align="center">{course.title}</Typography>
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Link href={`/courses/${course.subject}`} passHref legacyBehavior>
                      <Button variant="contained">View Lessons</Button>
                    </Link>
                  </Box>
                </CardContent>
              </DynamicCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
