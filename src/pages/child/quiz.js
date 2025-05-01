//file: src\pages\child\quiz.js

/*
 Im really sorry to anyone reading this, I (Stanley) made a mistake in the naming of this file. 
 It should be quizzes.js not quiz.js. But it is called quiz.js and is being used as such in the code.
 I'll Change the name of the file to quizzes.js and update the imports in the code to match the new name 
 since this is still here:
 ---> I apologize for the confusion. <---
 */

 import React, { useEffect, useState } from "react";
 import { Box, Typography, Button, Container } from "@mui/material";
 import Link from "next/link";
 import Header from "../../components/Header";
 import { useSession } from "next-auth/react";
 import { useRouter } from "next/router";
 import axios from "axios";
 
 export default function QuizPage({ initialQuizzes }) {
   const { data: session } = useSession();
   const router = useRouter();
   const { courseId } = router.query;
 
   const [mounted, setMounted] = useState(false);
   const [quizzes, setQuizzes] = useState(initialQuizzes || []);
   const [progressMap, setProgressMap] = useState({});
 
   useEffect(() => {
     setMounted(true);
   }, []);
 
   useEffect(() => {
     if (!session?.user?.id || !courseId) return;
 
     const fetchProgress = async () => {
       try {
         const res = await axios.get(`/api/lessons/progress?childId=${session.user.id}`);
         const progressData = res.data.progress || [];
 
         const map = {};
         progressData
           .filter((entry) => entry.contentType === "quiz" && entry.courseId === courseId)
           .forEach((entry) => {
             map[entry.contentId] = entry.completed ? "completed" : "started";
           });
 
         setProgressMap(map);
       } catch (err) {
         console.error("Error loading progress data:", err);
       }
     };
 
     fetchProgress();
   }, [session?.user?.id, courseId]);
 
   if (!mounted) return null;
 
   return (
     <Box sx={{ background: "linear-gradient(to bottom, #fdfbfb, #ebedee)", minHeight: "100vh" }}>
       <Header />
       <Container sx={{ mt: 4, mb: 4 }}>
         <Box
           sx={{
             display: "flex",
             justifyContent: "space-between",
             alignItems: "center",
             mb: 3,
           }}
         >
           <Typography variant="h4" sx={{ fontWeight: "bold" }}>
             Quizzes for This Course
           </Typography>
           <Link href="/child/dashboard" passHref legacyBehavior>
             <Button variant="outlined" color="primary">
               Go Back
             </Button>
           </Link>
         </Box>
 
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
             quizzes.map((quiz) => {
               const status = progressMap[quiz._id];
               const color =
                 status === "completed" ? "success" :
                 status === "started" ? "warning" :
                 "secondary";
 
               const badge =
                 status === "completed" ? " ✓ Completed" :
                 status === "started" ? " • In Progress" :
                 "";
 
               return (
                 <Link key={quiz._id} href={`/child/quiz/${quiz._id}`} passHref legacyBehavior>
                   <Button
                     variant="contained"
                     color={color}
                     sx={{
                       height: "100%",
                       fontSize: "1.1rem",
                       textTransform: "none",
                       justifyContent: "flex-start",
                     }}
                   >
                     {quiz.title || quiz.questionText || "Untitled Quiz"} {badge}
                   </Button>
                 </Link>
               );
             })
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
 
 export async function getServerSideProps(context) {
   const { courseId } = context.query;
   const connectDB = (await import("../../server/config/database")).default;
   const Quiz = (await import("../../server/models/Quiz")).default;
 
   try {
     await connectDB();
     const filter = courseId ? { courseId } : {};
     const quizzes = await Quiz.find(filter).lean();
     const quizzesJSON = quizzes.map((quiz) => JSON.parse(JSON.stringify(quiz)));
     return {
       props: { initialQuizzes: quizzesJSON },
     };
   } catch (error) {
     console.error("Error fetching quizzes:", error);
     return {
       props: { initialQuizzes: [] },
     };
   }
 } 
