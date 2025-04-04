import { Typography, Container, Grid, Paper, Button } from '@mui/material';
import Link from 'next/link';
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Welcome to Busy Bee Learning!
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Empowering young learners with interactive Courses
        </Typography>
        
        <Grid container spacing={3} sx={{ marginTop: 4 }}>
          {/* Course 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>English</Typography>
              <Typography variant="body1" gutterBottom>
              Improve your grammar, vocabulary, and writing skills.
              </Typography>
              <Link href="/courses/english" passHref>
                <Button variant="contained" color="primary">Start Learning</Button>
              </Link>
            </Paper>
          </Grid>

          {/* Course 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>Mathematics</Typography>
              <Typography variant="body1" gutterBottom>
                Master algebra, geometry, and arithmetic concepts.
              </Typography>
              <Link href="/courses/mathematics" passHref>
                <Button variant="contained" color="secondary">Start Learning</Button>
              </Link>
            </Paper>
          </Grid>

          {/* Course 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>History</Typography>
              <Typography variant="body1" gutterBottom>
                Explore historical events and learn about world-changing moments.
              </Typography>
              <Link href="/courses/history" passHref>
                <Button variant="outlined" color="primary">Start Learning</Button>
              </Link>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
