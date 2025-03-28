// File: src/components/Header.js
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState("unauthenticated");

  // Set the user role from session data.
  useEffect(() => {
    if (status === "authenticated") {
      setUserRole(session?.user?.role || "unauthenticated");
    } else {
      setUserRole("unauthenticated");
    }
  }, [session, status]);

  // Toggle mobile drawer.
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // Navigation links by role.
  const navLinks = {
    unauthenticated: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
    admin: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Users", href: "/admin/users" },
      { label: "Metrics", href: "/admin/metrics" },
    ],
    parent: [
      { label: "Dashboard", href: "/parent/dashboard" },
      { label: "Profile", href: "/parent/profile" },
      { label: "Progress", href: "/parent/progress" },
    ],
    child: [
      { label: "Profile", href: "/child/profile" },
      { label: "Lessons", href: "/child/lessons" },
      { label: "Quiz's", href: "/child/quiz" },
      // Uncomment if you later add a dedicated progress page for children:
      // { label: "Progress", href: "/child/progress" },
    ],
  };

  const menuItems = navLinks[userRole] || [];

  // Mobile Drawer – renders the menu list.
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {menuItems.map(({ label, href }) => (
          <Link key={label} href={href} passHref legacyBehavior>
            <ListItem button component="a">
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
        {status === "authenticated" && (
          <ListItem button onClick={() => signOut()}>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Mobile menu button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { md: "none" } }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>

        {/* Application Title */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "inherit" }}
        >
          <Link href="/" passHref legacyBehavior>
            <a style={{ textDecoration: "none", color: "inherit" }}>
              Busy Bee Learning
            </a>
          </Link>
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {menuItems.map(({ label, href }) => (
            <Link key={label} href={href} passHref legacyBehavior>
              <Button color="inherit" component="a">
                {label}
              </Button>
            </Link>
          ))}
          {status === "authenticated" ? (
            <Button color="inherit" onClick={() => signOut()}>
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login" passHref legacyBehavior>
                <Button color="inherit" component="a">
                  Login
                </Button>
              </Link>
              <Link href="/register" passHref legacyBehavior>
                <Button color="inherit" component="a">
                  Register
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Improves performance on mobile.
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
