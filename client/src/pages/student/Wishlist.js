import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Rating,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/wishlist/student/${user._id}`);
      setWishlist(response.data.wishlist);
    } catch (err) {
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (tutorId) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/wishlist/student/${user._id}/tutor/${tutorId}`);
      
      if (response.data.success) {
        setWishlist(wishlist.filter(item => item.tutor._id !== tutorId));
      } else {
        setError('Failed to remove tutor from wishlist');
      }
    } catch (err) {
      setError('Failed to remove tutor from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (tutor) => {
    setSelectedTutor(tutor);
    setConfirmDialog(true);
  };

  const handleConfirmBooking = () => {
    navigate(`/sessions/book/${selectedTutor._id}`);
  };

  const handleCloseDialog = () => {
    setConfirmDialog(false);
    setSelectedTutor(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Your Wishlist
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
        ) : wishlist.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Your wishlist is empty
            </Typography>
            <Button
              variant="contained"
              startIcon={<FavoriteIcon />}
              onClick={() => navigate('/student/dashboard')}
              sx={{ mt: 2 }}
            >
              Find Tutors
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {wishlist.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.tutor._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.tutor.profileImage || '/images/default-tutor.jpg'}
                    alt={item.tutor.name}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {item.tutor.name}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFromWishlist(item.tutor._id)}
                        disabled={loading}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Box>
                    <Typography color="text.secondary" gutterBottom>
                      {item.tutor.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={item.tutor.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({item.tutor.rating})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{item.tutor.city}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">PKR {item.tutor.price}/hour</Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CalendarIcon />}
                      onClick={() => handleBookSession(item.tutor)}
                    >
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={handleCloseDialog}>
        <DialogTitle>Book Session</DialogTitle>
        <DialogContent>
          <Typography>
            Would you like to book a session with {selectedTutor?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmBooking}>
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wishlist; 