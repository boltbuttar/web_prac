import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Divider
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const Reviews = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reviews, setReviews] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reviews/student/${user._id}`);
      setReviews(response.data.reviews);
    } catch (err) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tutor) => {
    setSelectedTutor(tutor);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTutor(null);
    setRating(0);
    setComment('');
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const reviewData = {
        studentId: user._id,
        tutorId: selectedTutor._id,
        rating,
        comment,
        sessionId: selectedTutor.sessionId
      };

      const response = await api.post('/api/reviews', reviewData);

      if (response.data.success) {
        setSuccess('Review submitted successfully');
        handleCloseDialog();
        fetchReviews();
      } else {
        setError(response.data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting the review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Your Reviews
          </Typography>
          <Button
            variant="contained"
            startIcon={<StarIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Write a Review
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {reviews.map((review) => (
              <Grid item xs={12} key={review._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={review.tutor.profileImage}
                        alt={review.tutor.name}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">
                          {review.tutor.name}
                        </Typography>
                        <Typography color="text.secondary">
                          {review.subject}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={review.rating} readOnly />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Review Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          {selectedTutor && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Review for {selectedTutor.name}
              </Typography>
              <Typography color="text.secondary">
                {selectedTutor.subject}
              </Typography>
            </Box>
          )}
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={handleRatingChange}
              precision={0.5}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Share your experience with this tutor..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={loading || !rating || !comment}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reviews; 