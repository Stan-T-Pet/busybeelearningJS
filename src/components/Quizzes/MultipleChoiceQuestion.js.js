/**
 * 1) The user is presented with multiple options and only one option is correct.
 * 2) The questions are designed to test the user's knowledge on a specific topic.
 * 3) The user is being tested on their ability to select the correct answer from a list of options.
 * 4) the user is being tested on their comphrension/understanding of a language or concept.
 * 5) The user is being tested on their ability to recall information.
 * 6) The user is being tested on their ability to apply knowledge to a specific scenario.
 * 7) The user is being tested on their ability to solve a problem and its repercussions.
 */
// File: components/MultipleChoiceQuestion.js
import React, { useState } from "react";
import DynamicCard from "../../components/DynamicCard";, CardContent, CardActions, Typography, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";

export default function MultipleChoiceQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState("");
  
  const handleSelect = (event) => {
    setSelected(event.target.value);
  };

  const handleSubmit = () => {
    // Check if selected option text matches the correct answer (using isCorrect flag)
    const selectedOption = question.options.find((opt) => opt.text === selected);
    onAnswer(selectedOption ? selectedOption.isCorrect : false);
  };

  return (
    <DynamicCard sx={{ maxWidth: 600, margin: "auto", mb: 4 }}>
      <CardContent>
        <Typography variant="h6">{question.questionText}</Typography>
        <RadioGroup name="multipleChoice" value={selected} onChange={handleSelect}>
          {question.options.map((option, index) => (
            <FormControlLabel key={index} value={option.text} control={<Radio />} label={option.text} />
          ))}
        </RadioGroup>
      </CardContent>
      <DynamicCardActions>
        <Button variant="contained" onClick={handleSubmit} disabled={!selected}>
          Submit Answer
        </Button>
      </CardActions>
    </DynamicCard>
  );
}
