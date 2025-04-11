import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Dialog,
  DialogContent,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const ReviewsPage = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        user.role === 'tutor' ? `/reviews/tutor/${user._id}` : `/reviews/student/${user._id}`
      );
      setReviews(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch reviews', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = async (data) => {
    try {
      await api.post(`/reviews/${selectedReview.session}`, data);
      enqueueSnackbar('Review created successfully', { variant: 'success' });
      setIsFormOpen(false);
      setSelectedReview(null);
      fetchReviews();
    } catch (error) {
      enqueueSnackbar('Failed to create review', { variant: 'error' });
    }
  };

  const handleUpdateReview = async (data) => {
    try {
      await api.put(`/reviews/${selectedReview._id}`, data);
      enqueueSnackbar('Review updated successfully', { variant: 'success' });
      setIsFormOpen(false);
      setSelectedReview(null);
      fetchReviews();
    } catch (error) {
      enqueueSnackbar('Failed to update review', { variant: 'error' });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      enqueueSnackbar('Review deleted successfully', { variant: 'success' });
      fetchReviews();
    } catch (error) {
      enqueueSnackbar('Failed to delete review', { variant: 'error' });
    }
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setIsFormOpen(true);
  };

  const handleReviewSession = (session) => {
    setSelectedReview({ session: session._id });
    setIsFormOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reviews
      </Typography>

      <ReviewList
        reviews={reviews}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
        currentUserId={user._id}
        isLoading={isLoading}
      />

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <ReviewForm
            onSubmit={selectedReview?._id ? handleUpdateReview : handleCreateReview}
            initialData={selectedReview}
            isEdit={!!selectedReview?._id}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ReviewsPage; 