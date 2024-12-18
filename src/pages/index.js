import { Typography, Container, Grid, Paper, Button } from '@mui/material';

export default function Home() {
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Welcome to Busy Bee Learning!
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Empowering young learners with interactive English, Mathematics, and History courses.
      </Typography>
      
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* Course 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>English</Typography>
            <Typography variant="body1" gutterBottom>
              Improve your grammar, vocabulary, and writing skills.
            </Typography>
            <Button variant="contained" color="primary">
              Start Learning
            </Button>
          </Paper>
        </Grid>

        {/* Course 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Mathematics</Typography>
            <Typography variant="body1" gutterBottom>
              Master algebra, geometry, and arithmetic concepts.
            </Typography>
            <Button variant="contained" color="secondary">
              Start Learning
            </Button>
          </Paper>
        </Grid>

        {/* Course 3 */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>History</Typography>
            <Typography variant="body1" gutterBottom>
              Explore historical events and learn about world-changing moments.
            </Typography>
            <Button variant="outlined" color="primary">
              Start Learning
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
