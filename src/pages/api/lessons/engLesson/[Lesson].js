import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

export default function Base_Lesson() {
    const [page, setPage] = useState(1);
    
    const nextPage = () => setPage(page + 1);
    const prevPage = () => setPage(page - 1);

    const logProgress = async (action, score = null) => {
        try {
            const response = await fetch("/api/progress/[action].js", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    childId: currentChildID, // Replace with actual child ID
                    contentId: currentLessonID, // Replace with actual lesson ID
                    contentType: { type: "lesson" }, // Pass in as an object from MongoDB
                    //FireBase image online thingy
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to log progress");
            } // Closing brace for logProgress function
    } catch (error) {
        console.error("Error logging progress:", error);
    }
    }
   const [questionsView, setQuestionsView] = useState(false);

    const handleAnswer = (isCorrect) => {
        if (isCorrect) setScore(score + 1);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            alert(`Lesson Completed! Your score: ${score + (isCorrect ? 1 : 0)}`);
        }
    };

const handleLessonInfo = async () => {
    try {
        const response = await fetch(`/api/lessons/engLesson/${page}`);
        if (!response.ok) {
            throw new Error("Failed to fetch lesson info");
        }
        const data = await response.json();
        console.log("Lesson Info:", data);
    } catch (error) {
        console.error("Error fetching lesson info:", error);
    }
};
        return (
            <Box sx={{ flexGrow: 1 }}>
                {page === 1 && (
                    <Box component="section">
                        <Typography variant="h2" align="center">
                            Page 1
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h3" align="center">
                                Let's Learn to Rhyme!
                            </Typography>
                            <Typography variant="h4" align="center">
                                Rhyming words sound the same, like in a fun little game!
                            </Typography>
                            <div
                                style={{
                                    border: "1px solid green",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    backgroundColor: "lightgreen",
                                    width: "350px",
                                }}
                            >
                                <ul>
                                    <li>Cat and Hat</li>
                                    <li>Dog and Frog</li>
                                    <li>Run and Fun</li>
                                </ul>
                            </div>
                        </div>
                        <Button onClick={nextPage}>Next</Button>
                    </Box>
                )}
    
                {page === 2 && (
                    <Box component="section">
                        <Typography variant="h2" align="center">
                            Page 2
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h3" align="center">
                                More Rhymes!
                            </Typography>
                            <Typography variant="h4" align="center">
                                Some rhymes are tricky, but they can be quite sticky!
                            </Typography>
                            <div
                                style={{
                                    border: "1px solid blue",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    backgroundColor: "lightblue",
                                    width: "350px",
                                }}
                            >
                                <ul>
                                    <li>Despair and Compare</li>
                                    <li>Blue and True</li>
                                    <li>Night and Light</li>
                                </ul>
                            </div>
                        </div>
                        <Button onClick={prevPage}>Back</Button>
                        <Button onClick={nextPage}>Next</Button>
                    </Box>
                )}
    
                {page === 3 && (
                    <Box component="section">
                        <Typography variant="h2" align="center">
                            Page 3
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h3" align="center">
                                Time to Rhyme!
                            </Typography>
                            <Typography variant="h4" align="center">
                                Can you think of a word that rhymes with "star"?
                            </Typography>
                            <div
                                style={{
                                    border: "1px solid orange",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    backgroundColor: "lightyellow",
                                    width: "350px",
                                }}
                            >
                                <Typography variant="h5" align="center">
                                    Hint: Maybe something that drives!
                                </Typography>
                            </div>
                        </div>
                        <Button onClick={prevPage}>Back</Button>
                        <Button onClick={nextPage}>Next</Button>
                    </Box>
                )}
    
                {page === 4 && (
                    <Box component="section">
                        <Typography variant="h2" align="center">
                            Page 4
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h3" align="center">
                                Great Job!
                            </Typography>
                            <Typography variant="h4" align="center">
                                "Star" and "Car" make a perfect pair!
                            </Typography>
                            <Typography variant="h5" align="center">
                                Keep practicing, and you'll rhyme anywhere!
                            </Typography>
                        </div>
                        <Button onClick={prevPage}>Back</Button>
                        <Button onClick={nextPage}>Next</Button>
                    </Box>
                )}
    
                {page === 5 && (
                    <Box component="section">
                        <Typography variant="h2" align="center">
                            Page 5
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h3" align="center">
                                Rhyming Recap
                            </Typography>
                            <Typography variant="h4" align="center">
                                Now you know how to rhyme, one word at a time!
                            </Typography>
                        </div>
                        <Button onClick={prevPage}>Back</Button>
                        <Button onClick={() => setPage(1)}>Restart</Button>
                    </Box>
                )}
            </Box>
        );
    }

