import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  AttachMoney as PriceIcon,
  Subject as SubjectIcon,
} from '@mui/icons-material';

const WishlistList = ({ tutors, onRemove, onBookSession }) => {
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <Grid container spacing={3}>
      {tutors.map((tutor) => (
        <Grid item xs={12} md={6} key={tutor._id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {tutor.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="body2">
                      {calculateAverageRating(tutor.reviews)} ({tutor.reviews?.length || 0} reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PriceIcon sx={{ color: 'success.main', mr: 0.5 }} />
                    <Typography variant="body2">
                      Rs. {tutor.hourlyRate}/hour
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => onRemove(tutor._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Subjects:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tutor.subjects.map((subject) => (
                    <Chip
                      key={subject}
                      label={subject}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => onBookSession(tutor._id)}
              >
                Book a Session
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {tutors.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary" align="center">
            Your wishlist is empty
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default WishlistList; 