// src/components/layouts/ParentLayout.js
import { Box, Container } from "@mui/material";
//import Header from "../Header";

export default function ParentLayout({ children, maxWidth = "xl" }) {
  return (
    <>
      
      <Box
        sx={{
          background: "linear-gradient(135deg,rgb(14, 73, 122), rgb(82, 131, 163) 50%)",
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
