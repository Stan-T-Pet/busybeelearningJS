// File: src/components/layouts/AuthLayout.js
import { Box, Container, Paper } from "@mui/material";

export default function AuthLayout({ children, maxWidth = "xl" }) {
  return (
    <>
     {/*<Header />*/}
     <Box
        sx={{
          background: "linear-gradient(rgb(1, 92, 172) 30%,rgb(93, 217, 248)) 100%)",
          minHeight: "100vh",
          pt: 6,
          pb: 6,
        }}
      >
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </Box>
    </>
  );
}