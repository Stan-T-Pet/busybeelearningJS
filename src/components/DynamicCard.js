import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function DynamicCard({ title, children, sx = {}, ...props }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      sx={{
        backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
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
              color: isDark ? "#fff" : "#000",
              mb: 1,
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