//file: components/Courses/CourseCard.js

import React from "react";
import { CardContent, CardActions, Typography, Button } from "@mui/material";
import DynamicCard from "../../components/DynamicCard";
import Link from "next/link";

const QuizCard = ({ quiz }) => {
  return (
    <DynamicCard sx={{ minWidth: 275, margin: 1 }}>
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
    </DynamicCard>
  );
};

export default QuizCard;
