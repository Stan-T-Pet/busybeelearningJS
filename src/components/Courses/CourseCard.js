//File: components/Courses/CourseCard.js

import React from "react";
import DynamicCard from "../../components/DynamicCard";, CardContent, Typography, CardActions, Button } from "@mui/material";
import Link from "next/link";

const CourseCard = ({ course }) => {
  return (
    <DynamicCard sx={{ minWidth: 275, margin: 1 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {course.title}
        </Typography>
        {course.description && (
          <Typography variant="body2" color="text.secondary">
            {course.description}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Link href={`/courses/${course._id}`} passHref legacyBehavior>
          <Button size="small">View Details</Button>
        </Link>
      </CardActions>
    </DynamicCard>
  );
};

export default CourseCard;
