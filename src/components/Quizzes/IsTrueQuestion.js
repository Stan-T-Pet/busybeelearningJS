/*
    For Questions where a single answer is required/correct. 
    1) The user is presented with a statement and they have to select whether the statement is true or false.
    2) The user is presented with options and only one option is correct.
    3) The answer is mathematical and the user input is compared with the correct answer.
*/
// File: components/IsTrueQuestion.js
import React, { useState } from "react";
import { Card, CardContent, CardActions, Typography, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";

export default function IsTrueQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  
  const handleSelect = (event) => {
    setSelected(event.target.value);
  };

  const handleSubmit = () => {
    // Call the onAnswer callback with the selected answer.
    onAnswer(selected === "true");
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mb: 4 }}>
      <CardContent>
        <Typography variant="h6">{question.questionText}</Typography>
        <RadioGroup name="isTrue" value={selected} onChange={handleSelect}>
          <FormControlLabel value="true" control={<Radio />} label="True" />
          <FormControlLabel value="false" control={<Radio />} label="False" />
        </RadioGroup>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={handleSubmit} disabled={selected === null}>
          Submit Answer
        </Button>
      </CardActions>
    </Card>
  );
}
