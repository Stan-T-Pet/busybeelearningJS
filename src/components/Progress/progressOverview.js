// File: components/Progress/ProgressOverview.js

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";

/**
 * @param {Object[]} progressData - Array of progress documents from the database.
 *   Example shape: [
 *     {
 *       _id: "MongoDB ObjectId",
 *       contentType: "lesson",    // "quiz"
 *       subject: "english",       // "english", "math", "history".
 *       startedAt: Date,
 *       completedAt: Date,
 *       score: Number,
 *       // Niamh and josip you can add fields here as needed
 *     },
 *   ]
 * @param {String} childName - Optionally display child's name in the header.
 */
export default function ProgressOverview({ progressData, childName }) {
  if (!progressData || progressData.length === 0) {
    return (
      <DynamicCard sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">
            {childName ? `${childName}'s ` : "Child's "}Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No progress records found.
          </Typography>
        </CardContent>
      </DynamicCard>
    );
  }

  return (
    <DynamicCard sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {childName ? `${childName}'s ` : "Child's "}Progress
        </Typography>

        {progressData.map((record) => {
          const isComplete = !!record.completedAt;
          const progressValue = isComplete ? 100 : 50; 
          // or however you want to calculate partial progress

          return (
            <Box key={record._id} sx={{ my: 2, p: 1, border: "1px solid #ccc" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {record.contentType.toUpperCase()} - {record.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Started: {record.startedAt 
                  ? new Date(record.startedAt).toLocaleString() 
                  : "Not started"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed: {record.completedAt 
                  ? new Date(record.completedAt).toLocaleString() 
                  : "In Progress"}
              </Typography>
              {record.score !== undefined && (
                <Typography variant="body2" color="text.secondary">
                  Score: {record.score}
                </Typography>
              )}

              {/* Example linear progress bar */}
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{ mt: 1, height: 10, borderRadius: 5 }}
              />
            </Box>
          );
        })}
      </CardContent>
    </DynamicCard>
  );
}
