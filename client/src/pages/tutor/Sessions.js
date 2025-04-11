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
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const TutorSessions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sessions, setSessions] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [action, setAction] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/sessions/tutor/${user._id}`);
      setSessions(response.data.sessions);
    } catch (err) {
      setError('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionAction = (session, action) => {
    setSelectedSession(session);
    setAction(action);
    setConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    try {
      setLoading(true);
      const response = await api.put(`/api/sessions/${selectedSession._id}/${action}`, {
        tutorId: user._id
      });

      if (response.data.success) {
        setSuccess(`Session ${action}ed successfully`);
        fetchSessions();
      } else {
        setError(`Failed to ${action} session`);
      }
    } catch (err) {
      setError(`Failed to ${action} session`);
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog(false);
    setSelectedSession(null);
    setAction('');
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
                  <TableCell>Student</TableCell>
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
                        {session.student.name}
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
                          <>
                            <Tooltip title="Accept Session">
                              <IconButton
                                color="success"
                                onClick={() => handleSessionAction(session, 'confirm')}
                                disabled={loading}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject Session">
                              <IconButton
                                color="error"
                                onClick={() => handleSessionAction(session, 'reject')}
                                disabled={loading}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Chat with Student">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/chat/${session.student._id}`)}
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {action === 'confirm' ? 'Accept Session' : 'Reject Session'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {action} the session with {selectedSession?.student.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color={action === 'confirm' ? 'success' : 'error'}
            onClick={handleConfirmAction}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : action === 'confirm' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TutorSessions; 