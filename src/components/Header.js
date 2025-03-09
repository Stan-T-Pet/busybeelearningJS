cls
import React, { useState } from "react";
import { 
  AppBar, Toolbar, Typography, Button, 
  IconButton, Drawer, List, ListItem, ListItemText, Box 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle Drawer for Mobile Navigation
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Define navigation links based on user roles
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
      { label: "Profile", href: "/parent/profile"},
      { label: "Progress", href: "/parent/progress" },
    ],
    child: [
      { label: "Profile", href: "/child/profile" },
      { label: "Lessons", href: "/child/lessons" },
      { label: "Quizzes", href: "/child/quizzes" },
    ],
  };

  // Determine menu items based on session
  const role = session?.user?.role || "unauthenticated";
  const menuItems = navLinks[role] || [];

  // Mobile Drawer Menu
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {menuItems.map(({ label, href }) => (
          <Link key={label} href={href} passHref>
            <ListItem button component="a">
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
        {session && (
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
        {/* Menu Icon for Mobile */}
        <IconButton 
          edge="start" color="inherit" aria-label="menu" 
          sx={{ mr: 2, display: { md: "none" } }} 
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>

        {/* App Title */}
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}
        >
          <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
            Busy Bee Learning
          </Link>
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {menuItems.map(({ label, href }) => (
            <Link key={label} href={href} passHref>
              <Button color="inherit">{label}</Button>
            </Link>
          ))}
          {session ? (
            <Button color="inherit" onClick={() => signOut()}>
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button color="inherit">Register</Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}
