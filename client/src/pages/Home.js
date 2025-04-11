import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Welcome to EduConnect Pakistan
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Connect with the best tutors and enhance your learning journey
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/tutors"
            variant="contained"
            size="large"
            color="primary"
          >
            Find a Tutor
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            size="large"
            color="primary"
          >
            Become a Tutor
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 