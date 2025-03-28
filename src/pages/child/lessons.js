// File: src/pages/child/lessons.js
import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import Header from "../../components/Header";
import Link from "next/link";
import connectDB from "../../server/config/database";
import Lesson from "../../server/models/Lesson";

<<<<<<< HEAD
export default function Lessons() {
    return (
        <Box>
            {/* AppBar */}
            <AppBar position="static" sx={{ width: '100%' }}>
                <Toolbar>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ flexGrow: 1, textAlign: 'center' }}
                    >
                        Welcome, {"Guest"}!
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: 2,
                        marginTop: 2,
                    }}
                >
                    {/* Left Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{ textAlign: 'center' }}
                        >
                            Select which lesson to do below:
                        </Typography>
                        <Button>Go Back</Button>
                    </Box>

                    {/* Divider */}
                    <Box
                        sx={{
                            height: '100%',
                            width: '1px',
                            backgroundColor: 'grey',
                            marginX: 2,
                        }}
                    />

                    {/* Right Section (Lessons) */}
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                padding: 2,
                            }}
                        >
                            English
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateRows: 'repeat(5, 1fr)',
                                width: '100%',
                                gap: 1,
                                backgroundColor: '#BBE5ED',
                                padding: 2,
                                borderRadius: 2,
                            }}
                        >
                            {/* Lesson Buttons */}
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => { window.location = '/new/src/pages/api/lessons/lesson1.js'; }}
                            >
                                Lesson 1
                            </Button>
                            <Button variant="contained" color="primary">Lesson 2</Button>
                            <Button variant="contained" color="primary">Lesson 3</Button>
                            <Button variant="contained" color="primary">Lesson 4</Button>
                            <Button variant="contained" color="primary">Lesson 5</Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
=======
// Fetch lessons from MongoDB on every request.
export async function getServerSideProps(context) {
  try {
    await connectDB();
    const lessons = await Lesson.find({}).lean();
    // Serialize Mongoose documents to JSON-friendly objects.
    const lessonsJSON = lessons.map((lesson) => JSON.parse(JSON.stringify(lesson)));
    return {
      props: { lessons: lessonsJSON },
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return {
      props: { lessons: [] },
    };
  }
>>>>>>> aa85a160e49896ed30ca96e45310100bb2956166
}

export default function Lessons({ lessons }) {
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
            Select a Lesson to Begin
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