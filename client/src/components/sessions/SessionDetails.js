import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const SessionDetails = ({ session, onBook, onCancel, onComplete, onReview }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'booked':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const calculateEndTime = () => {
    const [hours, minutes] = session.startTime.split(':');
    const startDate = new Date(session.date);
    startDate.setHours(parseInt(hours), parseInt(minutes), 0);
    const endDate = new Date(startDate.getTime() + session.duration * 60000);
    return endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Session Details
          </Typography>
          <Chip
            label={getStatusLabel(session.status)}
            color={getStatusColor(session.status)}
            size="medium"
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SubjectIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Subject:</strong> {session.subject}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimeIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Date:</strong> {format(new Date(session.date), 'MMMM dd, yyyy')}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimeIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Time:</strong> {session.startTime} - {calculateEndTime()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Location:</strong> {session.location}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PriceIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Price:</strong> Rs. {session.price}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Tutor:</strong> {session.tutor.name}
              </Typography>
            </Box>
          </Grid>

          {session.student && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Student:</strong> {session.student.name}
                </Typography>
              </Box>
            </Grid>
          )}

          {session.notes && (
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Notes:</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {session.notes}
              </Typography>
            </Grid>
          )}

          {session.rating && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">
                <strong>Rating:</strong> {session.rating}/5
              </Typography>
              {session.review && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  <strong>Review:</strong> {session.review}
                </Typography>
              )}
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              {session.status === 'available' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onBook(session._id)}
                >
                  Book Session
                </Button>
              )}
              {session.status === 'booked' && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => onComplete(session._id)}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onCancel(session._id)}
                  >
                    Cancel Session
                  </Button>
                </>
              )}
              {session.status === 'completed' && !session.rating && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onReview(session._id)}
                >
                  Leave a Review
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SessionDetails; 