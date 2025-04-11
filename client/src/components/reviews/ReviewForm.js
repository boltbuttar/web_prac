import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

const ReviewForm = ({ sessionId, tutorId, onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    sessionId: sessionId || '',
    tutorId: tutorId || '',
    helpful: false,
    wouldRecommend: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Mock data - would be replaced with API data
  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate form data
      if (!formData.rating) {
        throw new Error('Please provide a rating');
      }
      if (!formData.comment.trim()) {
        throw new Error('Please provide a comment');
      }

      // Call the onSubmit prop with form data
      await onSubmit(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? 'Edit Review' : 'Leave a Review'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Review submitted successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Rating Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend" gutterBottom>
                  Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingChange}
                    size="large"
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarIcon fontSize="inherit" />}
                  />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {formData.rating ? ratingLabels[formData.rating] : 'Select a rating'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Comment Section */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                name="comment"
                label="Your Review"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Share your experience with this tutoring session..."
                required
              />
            </Grid>

            {/* Additional Feedback */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Feedback
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Was the session helpful?</InputLabel>
                    <Select
                      name="helpful"
                      value={formData.helpful}
                      onChange={handleChange}
                      label="Was the session helpful?"
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Would you recommend this tutor?</InputLabel>
                    <Select
                      name="wouldRecommend"
                      value={formData.wouldRecommend}
                      onChange={handleChange}
                      label="Would you recommend this tutor?"
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Alert severity="info" sx={{ mt: 3 }}>
        Your review helps other students make informed decisions about their tutoring choices. Please be honest and specific in your feedback.
      </Alert>
    </Container>
  );
};

export default ReviewForm; 