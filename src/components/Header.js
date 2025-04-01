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

  useEffect(() => {
    if (status === "authenticated") {
      setUserRole(session?.user?.role || "unauthenticated");
    } else {
      setUserRole("unauthenticated");
    }
  }, [session, status]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const navLinks = {
    unauthenticated: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
    admin: [
      { label: "Users", href: "/admin/users" },
      { label: "Metrics", href: "/admin/metrics" },
    ],
    parent: [
      { label: "Profile", href: "/parent/profile" },
      { label: "Progress", href: "/parent/progress" },
    ],
    child: [
      { label: "Profile", href: "/child/profile" },
      { label: "Courses", href: "/child/courses" },
    ],
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "parent":
        return "/parent/dashboard";
      case "child":
        return "/child/dashboard";
      default:
        return "/";
    }
  };

  const menuItems = navLinks[userRole] || [];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {/* Dashboard link for authenticated users */}
        {status === "authenticated" && (
          <Link href={getDashboardRoute(userRole)} passHref legacyBehavior>
            <ListItem button component="a">
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
        )}
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
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { md: "none" } }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>

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
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {status === "authenticated" && (
            <Link href={getDashboardRoute(userRole)} passHref legacyBehavior>
              <Button color="inherit" component="a">
                Dashboard
              </Button>
            </Link>
          )}
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
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}