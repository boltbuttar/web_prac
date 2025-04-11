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
import { Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import SessionForm from '../components/sessions/SessionForm';
import SessionList from '../components/sessions/SessionList';
import SessionDetails from '../components/sessions/SessionDetails';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const SessionsPage = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        user.role === 'tutor' ? '/sessions/tutor/sessions' : '/sessions/student/sessions'
      );
      setSessions(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch sessions', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async (data) => {
    try {
      await api.post('/sessions', data);
      enqueueSnackbar('Session created successfully', { variant: 'success' });
      setIsFormOpen(false);
      fetchSessions();
    } catch (error) {
      enqueueSnackbar('Failed to create session', { variant: 'error' });
    }
  };

  const handleUpdateSession = async (data) => {
    try {
      await api.put(`/sessions/${selectedSession._id}`, data);
      enqueueSnackbar('Session updated successfully', { variant: 'success' });
      setIsFormOpen(false);
      setSelectedSession(null);
      fetchSessions();
    } catch (error) {
      enqueueSnackbar('Failed to update session', { variant: 'error' });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await api.delete(`/sessions/${sessionId}`);
      enqueueSnackbar('Session deleted successfully', { variant: 'success' });
      fetchSessions();
    } catch (error) {
      enqueueSnackbar('Failed to delete session', { variant: 'error' });
    }
  };

  const handleBookSession = async (sessionId) => {
    try {
      await api.post(`/sessions/${sessionId}/book`);
      enqueueSnackbar('Session booked successfully', { variant: 'success' });
      fetchSessions();
    } catch (error) {
      enqueueSnackbar('Failed to book session', { variant: 'error' });
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      await api.post(`/sessions/${sessionId}/complete`);
      enqueueSnackbar('Session marked as completed', { variant: 'success' });
      fetchSessions();
    } catch (error) {
      enqueueSnackbar('Failed to complete session', { variant: 'error' });
    }
  };

  const handleCancelSession = async (sessionId) => {
    try {
      await api.post(`/sessions/${sessionId}/cancel`);
      enqueueSnackbar('Session cancelled successfully', { variant: 'success' });
      fetchSessions();
    } catch (error) {
      enqueueSnackbar('Failed to cancel session', { variant: 'error' });
    }
  };

  const handleReviewSession = (session) => {
    setSelectedSession(session);
    setIsDetailsOpen(true);
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setIsFormOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Sessions
        </Typography>
        {user.role === 'tutor' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedSession(null);
              setIsFormOpen(true);
            }}
          >
            Create Session
          </Button>
        )}
      </Box>

      <SessionList
        sessions={sessions}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onComplete={handleCompleteSession}
        onCancel={handleCancelSession}
        isLoading={isLoading}
      />

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedSession ? 'Edit Session' : 'Create New Session'}
        </DialogTitle>
        <DialogContent>
          <SessionForm
            onSubmit={selectedSession ? handleUpdateSession : handleCreateSession}
            initialData={selectedSession}
            isEdit={!!selectedSession}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <SessionDetails
            session={selectedSession}
            onBook={handleBookSession}
            onCancel={handleCancelSession}
            onComplete={handleCompleteSession}
            onReview={handleReviewSession}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default SessionsPage; 