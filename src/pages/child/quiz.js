// File: src/pages/child/quiz.js
/*
 Im really sorry to anyone reading this, I (Stanley) made a mistake in the naming of this file. 
 It should be quizzes.js not quiz.js. But it is called quiz.js and is being used as such in the code.
 I'll Change the name of the file to quizzes.js and update the imports in the code to match the new name 
 since this is still here:
 ---> I apologize for the confusion. <---
 */
import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import Link from "next/link";
import Header from "../../components/Header";
import connectDB from "../../server/config/database";
import Quiz from "../../server/models/Quiz"; // Ensure this model exists and is defined

// Fetch quizzes from the database on each request.
export async function getServerSideProps(context) {
  try {
    await connectDB();
    const quizzes = await Quiz.find({}).lean();
    // Convert Mongoose documents to plain JavaScript objects (serializable)
    const quizzesJSON = quizzes.map((quiz) => JSON.parse(JSON.stringify(quiz)));
    return {
      props: { quizzes: quizzesJSON },
    };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    // In case of error, pass an empty array.
    return {
      props: { quizzes: [] },
    };
  }
}

export default function QuizPage({ quizzes }) {
  return (
    <Box sx={{ background: "linear-gradient(to bottom, #fdfbfb, #ebedee)", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ mt: 4, mb: 4 }}>
        {/* Page Heading & Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Available Quizzes
          </Typography>
          <Link href="/child/dashboard" passHref>
            <Button variant="outlined" color="primary">
              Go Back
            </Button>
          </Link>
        </Box>

        {/* Quizzes Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 2,
            backgroundColor: "#FFE0B2",
            p: 2,
            borderRadius: 2,
          }}
        >
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <Link key={quiz._id} href={`/child/quiz/${quiz._id}`} passHref>
                <Button variant="contained" color="secondary" sx={{ height: "100%", fontSize: "1.1rem" }}>
                  {quiz.title}
                </Button>
              </Link>
            ))
          ) : (
            <Typography variant="body1" align="center" color="text.secondary">
              No quizzes available.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
