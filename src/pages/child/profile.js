import { 
  Container, Typography, Button, Box, LinearProgress, 
  AppBar, Toolbar 
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  // if (!session) {
  //   return (
  //     <Container maxWidth="sm">
  //       <Typography variant="h5" align="center" mt={5}>
  //         You must be logged in to access this page.
  //       </Typography>
  //       <Box mt={2} textAlign="center">
  //         <Button 
  //           variant="contained" 
  //           color="primary" 
  //           onClick={() => router.push("/login")}
  //         >
  //           Login
  //         </Button>
  //       </Box>
  //     </Container>
  //   );
  // }

  const lessons = [
    { title: "Lesson 1: Introduction to JavaScript", progress: 80 },
    { title: "Lesson 2: Variables and Data Types", progress: 60 },
    { title: "Lesson 3: Functions and Scope", progress: 40 },
  ];

  return (
    <Box>
      <AppBar position="static" 
      sx={{ 
        width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" component="div" 
          sx={{ 
            flexGrow: 1, 
            textAlign: 'center' }}>
            Welcome, [NAME]!
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
       
        <Typography variant="h4" align="center" mt={5}>
          Welcome to your profile!
        </Typography>
        <Box mt={3}>
          <Typography variant="h6">Name: { "Unknown"}</Typography>
          <Typography variant="h6">Age: {"N/A"}</Typography>
        </Box>
        <Box mt={4}>
          <Typography variant="h5">Lesson Progress</Typography>
          <Box sx={{
            width: '100%',
            backgroundColor: 'grey',
            height: '1px',
          }}/>
          {lessons.map((lesson, index) => (
            <Box key={index} mt={2}>
              <Typography>{lesson.title}</Typography>
              <LinearProgress variant="determinate" value={lesson.progress} 
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: '#c8eae1',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00cc99',
                },
              }}
              />
            </Box>
          ))}
        </Box>
        <Box mt={4} textAlign="center">
          <Button variant="contained" color="secondary" onClick={() => signOut()}>
            Log out
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
