import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function DynamicCard({ title, children, sx = {}, color = "background", ...props }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Use MUI palette color or fallback to card background
  const backgroundColor = color === "background"
    ? (isDark ? "#1e1e1e" : "#ffffff")
    : theme.palette[color]?.main || theme.palette.background.paper;

  const textColor = isDark ? "#ffffff" : "#000000";

  return (
    <Card
      sx={{
        backgroundColor,
        color: textColor,
        borderRadius: 2,
        boxShadow: 3,
        ...sx,
      }}
      {...props}
    >
      <CardContent>
        {title && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: textColor,
              mb: 1,
              textAlign: "center",
            }}
          >
            {title}
          </Typography>
        )}

        <Box sx={{ color: isDark ? "#ccc" : "#333" }}>{children}</Box>
      </CardContent>
    </Card>
  );
}
