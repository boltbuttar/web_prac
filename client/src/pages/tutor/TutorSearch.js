import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

const TutorSearch = () => {
  // This would be replaced with actual data from an API
  const tutors = [
    {
      id: 1,
      name: 'John Doe',
      subjects: ['Mathematics', 'Physics'],
      rating: 4.8,
      experience: '5 years',
      hourlyRate: 25
    },
    // Add more mock data as needed
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Find a Tutor
      </Typography>
      <Grid container spacing={3}>
        {tutors.map((tutor) => (
          <Grid item xs={12} sm={6} md={4} key={tutor.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tutor.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Subjects: {tutor.subjects.join(', ')}
                </Typography>
                <Typography variant="body2">
                  Rating: {tutor.rating}/5
                </Typography>
                <Typography variant="body2">
                  Experience: {tutor.experience}
                </Typography>
                <Typography variant="body2">
                  Rate: ${tutor.hourlyRate}/hour
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Profile
                </Button>
                <Button size="small" color="primary">
                  Book Session
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TutorSearch; 