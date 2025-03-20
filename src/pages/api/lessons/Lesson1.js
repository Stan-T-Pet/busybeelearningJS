import React from "react";
import { 
  Box, Typography, Button, Container, 
  AppBar, Toolbar 
} from "@mui/material";
import { set } from "mongoose";

/*  Separated into 12 pages, 5 lessons, 5 questions and inbetween and a score at the end
A button is supposed to be there to advance to each view*/
function handlePage1(){
  setPage1(true);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(false);
  setQuestion3(false);
  setQuestion4(false);
  setQuestion5(false);
  setScore(false);
}
function handlePage2(){
  setPage1(false);
  setPage2(true);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(false);
  setQuestion3(false);
  setQuestion4(false);
  setQuestion5(false);
  setScore(false);
}
function handlePage3(){
  setPage1(false);
  setPage2(false);
  setPage3(true);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(false);
  setQuestion3(false);
  setQuestion4(false);
  setQuestion5(false);
  setScore(false);
}
function handlePage4(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(true);
  setPage5(false);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(false);
  setQuestion3(false);
  setQuestion4(false);
  setQuestion5(false);
  setScore(false);
}
function handlePage5(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(true);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(false);
  setQuestion3(false);
  setQuestion4(false);
  setQuestion5(false);
  setScore(false);
}
function handleQuestion1(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestion1(true);
  setQuestion2(false);
  setQuestion3(false);
  setQuestion4(false);
  setQuestion5(false);
  setScore(false);
}
function handleQuestion2(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(true);
  setQuestion3(false);
  setQuestion4(false);
  setQuestion5(false);
  setScore(false);
}
function handleQuestion3(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(false);
  setQuestion3(true);
  setQuestion4(false);
  setQuestion5(false);
  setScore(false);
}
function handleQuestion4(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(false);
  setQuestion3(false);
  setQuestion4(true);
  setQuestion5(false);
  setScore(false);
}
function handleQuestion5(){
  setPage1(false);
  setPage2(false);
  setPage3(false);
  setPage4(false);
  setPage5(false);
  setBetween(false);
  setQuestion1(false);
  setQuestion2(false);
  setQuestion3(false);
  setQuestion4(false);
  setQuestion5(true);
  setScore(false);
}

export default function Lesson1() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {page1 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 1
          </Typography>
        </Box>
      )}

      {page2 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 2
          </Typography>
        </Box>
      )}

      {page3 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 3
          </Typography>
        </Box>
      )}

      {page4 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 4
          </Typography>
        </Box>
      )}

      {page5 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Page 5
          </Typography>
        </Box>
      )}

      {question1 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Question 1
          </Typography>
        </Box>
      )}

      {question2 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Question 2
          </Typography>
        </Box>
      )}

      {question3 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Question 3
          </Typography>
        </Box>
      )}

      {question4 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Question 4
          </Typography>
        </Box>
      )}

      {question5 && (
        <Box component="section">
          <Typography variant="h4" align="center">
            Question 5
          </Typography>
        </Box>
      )}
    </Box>
  );
}