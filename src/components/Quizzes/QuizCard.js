//file: components/Courses/CourseCard.js

import React from "react";
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import Link from "next/link";

const QuizCard = ({ quiz }) => {
  return (
    <Card sx={{ minWidth: 275, margin: 1 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {quiz.questionText}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {quiz.type}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`/quizzes/${quiz._id}`} passHref legacyBehavior>
          <Button size="small">Take Quiz</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default QuizCard;
