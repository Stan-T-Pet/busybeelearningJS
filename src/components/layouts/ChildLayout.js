// src/components/layouts/ChildLayout.js
import { Box, Container } from "@mui/material";
import Header from "../Header";

export default function ChildLayout({ children, maxWidth = "xl" }) {
  return (
    <>
      {/*<Header />*/}
      <Box
        sx={{
          background: "linear-gradient(to bottom,  rgb(95, 180, 92),rgb(14, 73, 122))",
          minHeight: "100vh",
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </Box>
    </>
  );
}
