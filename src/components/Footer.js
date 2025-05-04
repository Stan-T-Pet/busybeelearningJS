import React from "react";
import { Box, Typography, Container, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[200],
        py: 3,
        mt: 8,
        borderTop: `1px solid ${
          theme.palette.mode === "dark" ? "#333" : "#ddd"
        }`,
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Busy Bee Learning. All rights reserved.
        </Typography>
        <Typography
          variant="caption"
          align="center"
          display="block"
          sx={{ mt: 1, color: "text.disabled" }}
        >
          Built with Next.js, MongoDB, and Material UI
        </Typography>
      </Container>
    </Box>
  );
}
