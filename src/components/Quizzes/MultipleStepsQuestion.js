/**
 * 1) The user needs to answer multiple questions in a sequence.
 * 2) The questions require correct answers for each step.
 * 3) The answer is not a simple true/false or multiple choice.
 * 4) The user is being tested on their ability to solve a problem and its follow up questions.
 * 5) The user is being tested on their ability to apply knowledge to a specific scenario.
 *  
 */

// File: components/MultipleStepsQuestion.js
import React, { useState } from "react";
import DynamicCard from "../../components/DynamicCard";, CardContent, CardActions, Typography, Button, TextField } from "@mui/material";

export default function MultipleStepsQuestion({ question, onComplete }) {
  // We'll store answers for each step in an array.
  const [answers, setAnswers] = useState(Array(question.steps.length).fill(""));
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < question.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // When finished, compare each answer with the corresponding correctAnswer.
      const stepResults = question.steps.map((step, index) => step.correctAnswer === answers[index]);
      onComplete(stepResults);
    }
  };

  return (
    <DynamicCard sx={{ maxWidth: 600, margin: "auto", mb: 4 }}>
      <CardContent>
        <Typography variant="h6">{question.questionText}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Step {currentStep + 1}: {question.steps[currentStep].stepText}
        </Typography>
        <TextField
          fullWidth
          label="Your Answer"
          value={answers[currentStep]}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={handleNext}>
          {currentStep < question.steps.length - 1 ? "Next Step" : "Submit Answers"}
        </Button>
      </CardActions>
    </DynamicCard>
  );
}

