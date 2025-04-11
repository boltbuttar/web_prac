import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  Button,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();

  // Enhanced validation with detailed logging
  if (!tutor) {
    console.warn('TutorCard: No tutor data provided');
    return null;
  }

  if (!tutor.user) {
    console.warn('TutorCard: Missing user data in tutor object', tutor);
    return null;
  }

  const {
    user,
    subjects = [],
    hourlyRate = 0,
    rating = 0,
    totalReviews = 0,
    _id
  } = tutor;

  const {
    firstName = '',
    lastName = '',
    city = '',
    profilePicture = '/default-avatar.png'
  } = user;

  const handleBookSession = () => {
    navigate(`/sessions/book/${_id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={profilePicture}
        alt={`${firstName} ${lastName}`}
        onError={(e) => {
          e.target.src = '/default-avatar.png';
          e.target.onerror = null;
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {firstName} {lastName}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={rating} precision={0.1} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({totalReviews} reviews)
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {city}
        </Typography>

        <Typography variant="h6" color="primary" gutterBottom>
          PKR {hourlyRate}/hour
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Subjects:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {subjects.map((subject) => (
              <Chip
                key={subject}
                label={subject}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleBookSession}
          sx={{ mt: 'auto' }}
        >
          Book Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default TutorCard; 