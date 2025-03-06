import React from "react";

import { Box, AppBar, Toolbar, IconButton, Typography, Button, Container, Menu } from '@mui/material';

export default function Dashboard() {
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
      <Container maxWidth="lg" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginTop: 2, }}>
       

        <Box sx={{ 
          border: '1px solid grey',
          borderRadius: '8px', 
          width: '100%',
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>

        <Box 
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: '2fr 1fr',
          alignItems: 'center',
          gap: 2,
          backgroundColor: '#BBE5ED',
          borderRadius: '8px',
        }}>

           <Box 
           sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 1,
            backgroundColor: '#BBE5ED',
            borderRadius: '8px',
            
          }}>

          <Typography variant="h4" align="center" 
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            width: '100%',
            padding: 1,
            marginLeft: 1,
            }}>
            English
          </Typography>

          <Box sx={{ width: '100%', height: '1px', backgroundColor: 'grey', marginY: 2 }} />

          <Typography variant="body2" align="center" paragraph 
          sx={{ 
            fontSize: '1rem',
            lineHeight: 1.5
            }}>
            Improve your grammar, vocabulary, and writing skills.
          </Typography>
          </Box>


          <Button variant="contained"
          onClick={() => { window.location.href = './lessons.js'; }}
            sx={{ 
              borderRadius: 1,
              height: '90%' ,
              width: '90%',
              fontSize: '2rem',
              color: '#000000',
              '&:hover': {
                color: '#fff',
                backgroundColor: '#E8C547',
              },
            }}>
            Get started
          </Button>
          </Box>
        </Box>
        <Button variant="contained"
       onClick={() => { window.location.href = './profile.js'; }}
        sx={{ 
          borderRadius: 1,
          backgroundColor: '#B5B1F1',
          '&:hover': {
            color: '#fff',
            backgroundColor: '#DAC1D1',
          },
        }}>
            View profile
        </Button>
      </Container>
    </Box>
  );
}
