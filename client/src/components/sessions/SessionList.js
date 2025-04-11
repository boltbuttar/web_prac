import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const SessionList = ({ sessions, onEdit, onDelete, onComplete, onCancel }) => {
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session._id}>
              <TableCell>{session.subject}</TableCell>
              <TableCell>
                {format(new Date(session.date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{session.startTime}</TableCell>
              <TableCell>{session.duration} min</TableCell>
              <TableCell>{session.location}</TableCell>
              <TableCell>Rs. {session.price}</TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(session.status)}
                  color={getStatusColor(session.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box>
                  {session.status === 'available' && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(session)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(session._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                  {session.status === 'booked' && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => onComplete(session._id)}
                        color="success"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onCancel(session._id)}
                        color="error"
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" color="textSecondary">
                  No sessions found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionList; 