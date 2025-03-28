import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const Lesson = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [page1, setPage1] = useState(true);
    const [page2, setPage2] = useState(false);
    const [page3, setPage3] = useState(false);
    const [page4, setPage4] = useState(false);
    const [page5, setPage5] = useState(false);
    const [between, setBetween] = useState(false);
    const [questionsView, setQuestionsView] = useState(false);

    const handleAnswer = (isCorrect) => {
        if (isCorrect) setScore(score + 1);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            alert(`Lesson Completed! Your score: ${score + (isCorrect ? 1 : 0)}`);
        }
    };

    const handlePages = () => {
        
    };

    

    return (
        <Box sx={{ flexGrow: 1 }}>
            {page1 && (
                <Box component="section">
                    <Typography variant="h6" align="center" style={{ marginTop: "20px", color: "grey" }}>
                        Page 1
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="h4" align="center" padding={2}>
                            Let's Learn to Rhyme!
                        </Typography>
                        <Typography variant="h6" align="center">
                            Rhyming words are words that usually have the same ending sound. They can be used to create silly little poems or songs.
                        </Typography>
                        <div
                            style={{
                                margin: "20px",
                                color: "white",
                                padding: "10px",
                                borderRadius: "5px",
                                backgroundColor: "darkgreen",
                                width: "350px",
                            }}
                        >
                            <Typography variant="h6" align="center">
                                Some examples of Simple rhyming words are:
                            </Typography>
                            <ul style={{ fontFamily: "Arial" }}>
                                <li>Cat and Hat - Share 'at'</li>
                                <li>Dog and Frog - Share 'og'</li>
                                <li>Run and Fun - Share 'un'</li>
                            </ul>
                        </div>
                        <Button onClick={handlePage2} color="primary" variant="contained">
                            Next
                        </Button>
                    </div>
                </Box>
            )}

            {page2 && (
                <Box component="section">
                    <Typography variant="h2" align="center">
                        Page 2
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                        <Button onClick={handlePage1}>Back</Button>
                        <Button onClick={handlePage3}>Next</Button>
                    </div>
                </Box>
            )}

            {page3 && (
                <Box component="section">
                    <Typography variant="h2" align="center">
                        Page 3
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="h3" align="center">
                            Rhyming (continued)
                        </Typography>
                        <div
                            style={{
                                border: "1px solid orange",
                                padding: "10px",
                                borderRadius: "5px",
                                backgroundColor: "lightcoral",
                                width: "350px",
                            }}
                        >
                            <Typography variant="h6" align="center">
                                Practice finding rhymes in your favorite songs or poems!
                            </Typography>
                        </div>
                        <Button onClick={handlePage4}>Next</Button>
                        <Button onClick={handlePage2}>Back</Button>
                    </div>
                </Box>
            )}

            {page4 && (
                <Box component="section">
                    <Typography variant="h2" align="center">
                        Page 4
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="h3" align="center">
                            Rhyming (continued)
                        </Typography>
                        <div
                            style={{
                                border: "1px solid purple",
                                padding: "10px",
                                borderRadius: "5px",
                                backgroundColor: "plum",
                                width: "350px",
                            }}
                        >
                            <Typography variant="h6" align="center">
                                Rhyming can make your writing more fun and engaging!
                            </Typography>
                        </div>
                        <Button onClick={handlePage5}>Next</Button>
                        <Button onClick={handlePage3}>Back</Button>
                    </div>
                </Box>
            )}

            {page5 && (
                <Box component="section">
                    <Typography variant="h2" align="center">
                        Page 5
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="h3" align="center">
                            Rhyming (continued)
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
                            <Typography variant="h6" align="center">
                                Now you're ready to test your rhyming skills!
                            </Typography>
                        </div>
                        <Button onClick={handleBetween}>Test Yourself</Button>
                        <Button onClick={handlePage4}>Back</Button>
                    </div>
                </Box>
            )}

            {between && (
                <Box component="section">
                    <Typography variant="h2" align="center">
                        Test Yourself
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="h3" align="center">
                            Ready to test your knowledge?
                        </Typography>
                        <div
                            style={{
                                border: "1px solid red",
                                padding: "10px",
                                borderRadius: "5px",
                                backgroundColor: "lightpink",
                                width: "350px",
                            }}
                        >
                            <Typography variant="h6" align="center">
                                Click "Start Questions" to begin!
                            </Typography>
                        </div>
                        <Button onClick={handleQuestions}>Start Questions</Button>
                    </div>
                </Box>
            )}

            {questionsView && (
                <Box component="section">
                    <Typography variant="h2" align="center">
                        Question {currentQuestion + 1}
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="h4" align="center">
                            {questions[currentQuestion].text}
                        </Typography>
                        {questions[currentQuestion].options.map((option, index) => (
                            <Button key={index} onClick={() => handleAnswer(option.isCorrect)}>
                                {option.text}
                            </Button>
                        ))}
                    </div>
                </Box>
            )}
        </Box>
    );
};

export default Lesson;

