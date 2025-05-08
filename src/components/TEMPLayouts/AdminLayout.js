// src/components/layouts/AdminLayout.js
import { Box, Container } from "@mui/material";
import Header from "../Header";

export default function AdminLayout({ children, maxWidth = "xl" }) {
  return (
    <>
     {/*<Header />*/}
     <Box
        sx={{
          background: "linear-gradient(to bottom right, #001f3f, #0074D9)",
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
