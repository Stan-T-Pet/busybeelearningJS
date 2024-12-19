import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* App Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}
        >
          <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
            Busy Bee Learning
          </Link>
        </Typography>

        {/* Navigation Links */}
        <Box>
          <Link href="/Dashboard" passHref>
            <Button color="inherit">Dashboard</Button>
          </Link>
          <Link href="/Login" passHref>
            <Button color="inherit">Login</Button>
          </Link>
          <Link href="/Register" passHref>
            <Button color="inherit">Register</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
