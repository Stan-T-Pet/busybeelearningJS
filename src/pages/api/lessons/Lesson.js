import React from "react";
import { 
  Box, Typography, Button, Container, 
  AppBar, Toolbar 
} from "@mui/material";
import { set } from "mongoose";

/*  Separated into 12 pages, 5 lessons, 5 questions and inbetween and a score at the end
A button is supposed to be there to advance to each view*/
const Lesson = ({ questions }) => {
  const [currentLessQuestion, setCurrentLessonQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Lesson Completed! Your score: ${score + (isCorrect ? 1 : 0)}`);
    }
  };

  const [page1, setPage1] = useState(true);
  const [page2, setPage2] = useState(false);
  const [page3, setPage3] = useState(false);
  const [page4, setPage4] = useState(false);
  const [page5, setPage5] = useState(false);
  const [between, setBetween] = useState(false);
  const [questions, setQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
function handlePage1(){
  setPage1(true);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestions(false);;
}
function handlePage2(){
  setPage1(false);
  setPage2(true);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestions(false);
}
function handlePage3(){
  setPage1(false);
  setPage2(false);
  setPage3(true);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestions(false);
}
function handlePage4(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(true);
  setPage5(false);
  setBetween(false);
  setQuestions(false);
}
function handlePage5(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(true);
  setBetween(false);
  setQuestions(false);
}
function handleQuestions(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestions(true);
  
}

}
export default function Lesson() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {page1 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 1
          </Typography>
          <Button onClick={handlePage2}>Next</Button>
        </Box>
      )}

      {page2 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 2
          </Typography>
          <Button onClick={handlePage3}>Next</Button>
        </Box>
      )}

      {page3 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 3
          </Typography>
          <Button onClick={handlePage4}>Next</Button>
        </Box>
      )}

      {page4 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 4
          </Typography>
          <Button onClick={handlePage5}>Next</Button>
        </Box>
      )}

      {page5 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 5
          </Typography>
          <Button onClick={handleBetween}>Test Yourself</Button>
        </Box>
      )}

      {between && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Test Yourself
          </Typography>
          <Button onClick={handleQuestion1}>Question 1</Button>
        </Box>
      )}
    
    {handleQuestions && (

          <div>
            <h2>Question {currentQuestion + 1}</h2>
            <p>{questions[currentQuestion].text}</p>
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.isCorrect)}
              >
                {option.text}
              </button>
            ))}
          </div>
    )}
     
    </Box>
  );
}
