import React from "react";
import { 
  Box, Typography, Button, Container, 
  AppBar, Toolbar 
} from "@mui/material";

export default function Lessons() {
    return (
        <Box>
            {/* AppBar */}
            <AppBar position="static" sx={{ width: '100%' }}>
                <Toolbar>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ flexGrow: 1, textAlign: 'center' }}
                    >
                        Welcome, {"Guest"}!
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: 2,
                        marginTop: 2,
                    }}
                >
                    {/* Left Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{ textAlign: 'center' }}
                        >
                            Select which lesson to do below:
                        </Typography>
                        <Button>Go Back</Button>
                    </Box>

                    {/* Divider */}
                    <Box
                        sx={{
                            height: '100%',
                            width: '1px',
                            backgroundColor: 'grey',
                            marginX: 2,
                        }}
                    />

                    {/* Right Section (Lessons) */}
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                padding: 2,
                            }}
                        >
                            English
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateRows: 'repeat(5, 1fr)',
                                width: '100%',
                                gap: 1,
                                backgroundColor: '#BBE5ED',
                                padding: 2,
                                borderRadius: 2,
                            }}
                        >
                            {/* Lesson Buttons */}
                            <Button variant="contained" color="primary">Lesson 1</Button>
                            <Button variant="contained" color="primary">Lesson 2</Button>
                            <Button variant="contained" color="primary">Lesson 3</Button>
                            <Button variant="contained" color="primary">Lesson 4</Button>
                            <Button variant="contained" color="primary">Lesson 5</Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
