import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import WishlistList from '../components/wishlist/WishlistList';
import SessionForm from '../components/sessions/SessionForm';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const WishlistPage = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/wishlist');
      setTutors(response.data.tutors);
    } catch (error) {
      enqueueSnackbar('Failed to fetch wishlist', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTutor = async (tutorId) => {
    try {
      await api.delete(`/wishlist/tutors/${tutorId}`);
      enqueueSnackbar('Tutor removed from wishlist', { variant: 'success' });
      fetchWishlist();
    } catch (error) {
      enqueueSnackbar('Failed to remove tutor from wishlist', { variant: 'error' });
    }
  };

  const handleBookSession = (tutor) => {
    setSelectedTutor(tutor);
    setIsFormOpen(true);
  };

  const handleCreateSession = async (data) => {
    try {
      await api.post('/sessions', {
        ...data,
        tutor: selectedTutor._id,
      });
      enqueueSnackbar('Session created successfully', { variant: 'success' });
      setIsFormOpen(false);
      setSelectedTutor(null);
    } catch (error) {
      enqueueSnackbar('Failed to create session', { variant: 'error' });
    }
  };

  const handleClearWishlist = async () => {
    try {
      await api.delete('/wishlist');
      enqueueSnackbar('Wishlist cleared successfully', { variant: 'success' });
      setTutors([]);
    } catch (error) {
      enqueueSnackbar('Failed to clear wishlist', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Wishlist
        </Typography>
        {tutors.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClearWishlist}
          >
            Clear Wishlist
          </Button>
        )}
      </Box>

      <WishlistList
        tutors={tutors}
        onRemove={handleRemoveTutor}
        onBookSession={handleBookSession}
        isLoading={isLoading}
      />

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Book a Session with {selectedTutor?.name}</DialogTitle>
        <DialogContent>
          <SessionForm
            onSubmit={handleCreateSession}
            initialData={{ tutor: selectedTutor?._id }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default WishlistPage; 