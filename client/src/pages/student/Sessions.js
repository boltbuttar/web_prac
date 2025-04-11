import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const Sessions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sessions, setSessions] = useState([]);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/sessions/student/${user._id}`);
      setSessions(response.data.sessions);
    } catch (err) {
      setError('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = async (session) => {
    setSelectedSession(session);
    setCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setLoading(true);
      const response = await api.put(`/api/sessions/${selectedSession._id}/cancel`, {
        studentId: user._id
      });

      if (response.data.success) {
        setSuccess('Session cancelled successfully');
        fetchSessions();
      } else {
        setError('Failed to cancel session');
      }
    } catch (err) {
      setError('Failed to cancel session');
    } finally {
      setLoading(false);
      setCancelDialog(false);
    }
  };

  const handleCloseCancelDialog = () => {
    setCancelDialog(false);
    setSelectedSession(null);
  };

  const handleOpenReview = (session) => {
    setSelectedSession(session);
    setReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialog(false);
    setSelectedSession(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Sessions
        </Typography>

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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        {session.tutor.name}
                      </Box>
                    </TableCell>
                    <TableCell>{session.subject}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 1 }} />
                        {formatDate(session.date)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ mr: 1 }} />
                        {formatTime(session.time)}
                      </Box>
                    </TableCell>
                    <TableCell>{session.duration} hour(s)</TableCell>
                    <TableCell>
                      <Chip
                        label={session.status}
                        color={getStatusColor(session.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {session.status === 'pending' && (
                          <Tooltip title="Cancel Session">
                            <IconButton
                              color="error"
                              onClick={() => handleCancelSession(session)}
                              disabled={loading}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {session.status === 'completed' && !session.reviewed && (
                          <Tooltip title="Leave Review">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenReview(session)}
                            >
                              <StarIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Chat with Tutor">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/chat/${session.tutor._id}`)}
                          >
                            <ChatIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancel Session</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your session with {selectedSession?.tutor.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>No, Keep It</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Yes, Cancel It'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent>
          <Typography>
            How was your session with {selectedSession?.tutor.name}?
          </Typography>
          {/* Add review form here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/reviews/new/${selectedSession?._id}`)}
          >
            Write Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sessions; 