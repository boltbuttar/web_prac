import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material';

const TutorProfile = () => {
  const { id } = useParams();
  
  // This would be replaced with actual data from an API
  const tutor = {
    id: 1,
    name: 'John Doe',
    subjects: ['Mathematics', 'Physics'],
    rating: 4.8,
    experience: '5 years',
    hourlyRate: 25,
    bio: 'Experienced tutor with a passion for teaching mathematics and physics.',
    education: 'MSc in Physics',
    availability: 'Weekdays, 9 AM - 6 PM'
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {tutor.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {tutor.education}
            </Typography>
            <Typography variant="body1" paragraph>
              {tutor.bio}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Subjects
            </Typography>
            <Box sx={{ mb: 2 }}>
              {tutor.subjects.map((subject) => (
                <Button
                  key={subject}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                >
                  {subject}
                </Button>
              ))}
            </Box>
            <Typography variant="h6" gutterBottom>
              Availability
            </Typography>
            <Typography variant="body1" paragraph>
              {tutor.availability}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rate
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              ${tutor.hourlyRate}/hour
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Rating: {tutor.rating}/5
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Experience: {tutor.experience}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Book a Session
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TutorProfile; 