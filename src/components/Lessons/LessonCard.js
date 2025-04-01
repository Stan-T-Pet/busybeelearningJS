//file: components/Courses/CourseCard.js

import React from "react";
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import Link from "next/link";

const LessonCard = ({ lesson }) => {
  return (
    <Card sx={{ minWidth: 275, margin: 1 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {lesson.title}
        </Typography>
        {lesson.description && (
          <Typography variant="body2" color="text.secondary">
            {lesson.description}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Link href={`/lessons/${lesson._id}`} passHref legacyBehavior>
          <Button size="small">View Lesson</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default LessonCard;
