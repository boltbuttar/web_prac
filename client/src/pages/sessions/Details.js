import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Alert
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const SessionDetails = () => {
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  });

  // Mock data - would be replaced with API data
  const session = {
    id: 1,
    subject: 'Mathematics',
    tutor: {
      id: 1,
      name: 'Dr. Sarah Khan',
      rating: 4.8,
      totalReviews: 156
    },
    student: {
      id: 2,
      name: 'John Doe'
    },
    date: '2024-03-20',
    time: '14:00',
    duration: 60,
    status: 'upcoming',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    location: 'Online',
    notes: 'Focus on calculus and differential equations',
    price: 50
  };

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  const handleReviewSubmit = () => {
    // Handle review submission
    console.log('Review submitted:', reviewData);
    handleCloseReviewDialog();
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Main Session Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">
                {session.subject} Tutoring Session
              </Typography>
              <Chip
                label={session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                color={getStatusColor(session.status)}
                size="large"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Tutor: {session.tutor.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="body2">
                    {session.tutor.rating} ({session.tutor.totalReviews} reviews)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    {new Date(session.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    {session.time} ({session.duration} minutes)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    {session.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Subject: {session.subject}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Session Notes
            </Typography>
            <Typography variant="body1" paragraph>
              {session.notes}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              {session.status === 'upcoming' && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VideoCallIcon />}
                    href={session.meetingLink}
                    target="_blank"
                  >
                    Join Meeting
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                  >
                    Cancel Session
                  </Button>
                </>
              )}
              {session.status === 'completed' && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<StarIcon />}
                  onClick={handleOpenReviewDialog}
                >
                  Leave a Review
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Price and Additional Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Session Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Price"
                  secondary={`$${session.price}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Duration"
                  secondary={`${session.duration} minutes`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Location"
                  secondary={session.location}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={reviewData.rating}
              onChange={(event, newValue) => {
                setReviewData((prev) => ({ ...prev, rating: newValue }));
              }}
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            name="comment"
            label="Your Review"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={reviewData.comment}
            onChange={handleReviewChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button onClick={handleReviewSubmit} variant="contained" color="primary">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      <Alert severity="info" sx={{ mt: 3 }}>
        Note: Please join the meeting 5 minutes before the scheduled time. If you need to cancel, please do so at least 12 hours before the session.
      </Alert>
    </Container>
  );
};

export default SessionDetails; 