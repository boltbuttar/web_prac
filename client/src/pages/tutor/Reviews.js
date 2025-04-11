import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Rating,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const TutorReviews = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reviews/tutor/${user._id}`);
      setReviews(response.data.reviews);
      
      // Calculate average rating
      if (response.data.reviews.length > 0) {
        const sum = response.data.reviews.reduce((acc, review) => acc + review.rating, 0);
        setAverageRating(sum / response.data.reviews.length);
      }
      setTotalReviews(response.data.reviews.length);
    } catch (err) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Reviews
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Summary Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h3" component="div">
                      {averageRating.toFixed(1)}
                    </Typography>
                    <Rating value={averageRating} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      Based on {totalReviews} reviews
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Reviews List */}
            <Grid item xs={12} md={8}>
              {reviews.length === 0 ? (
                <Alert severity="info">
                  No reviews yet. Your reviews will appear here once students rate your sessions.
                </Alert>
              ) : (
                reviews.map((review) => (
                  <Card key={review._id} sx={{ mb: 2 }}>
                    <CardHeader
                      avatar={
                        <Avatar src={review.student.profilePicture}>
                          {review.student.name.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {review.student.name}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                      }
                      subheader={formatDate(review.createdAt)}
                    />
                    <CardContent>
                      <Typography variant="body1" paragraph>
                        {review.comment}
                      </Typography>
                      {review.session && (
                        <Typography variant="body2" color="text.secondary">
                          Session: {review.session.subject} - {formatDate(review.session.date)}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default TutorReviews; 