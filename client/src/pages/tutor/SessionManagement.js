import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Subject as SubjectIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`session-tabpanel-${index}`}
      aria-labelledby={`session-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SessionManagement = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessions, setSessions] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    weekly: 0,
    monthly: 0,
    perSession: []
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'complete' or 'review'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch sessions
      const sessionsResponse = await api.get('/tutor/sessions');
      if (sessionsResponse.data.success) {
        setSessions(sessionsResponse.data.data || []);
      } else {
        throw new Error(sessionsResponse.data.message || 'Failed to fetch sessions');
      }

      // Fetch earnings
      const earningsResponse = await api.get('/tutor/earnings');
      if (earningsResponse.data.success) {
        setEarnings(earningsResponse.data.data || {
          total: 0,
          weekly: 0,
          monthly: 0,
          perSession: []
        });
      } else {
        throw new Error(earningsResponse.data.message || 'Failed to fetch earnings');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSessionAction = async (sessionId, action) => {
    try {
      const response = await api.patch(`/sessions/${sessionId}/status`, {
        status: action
      });

      if (response.data.success) {
        await fetchData(); // Refresh data
      } else {
        throw new Error(response.data.message || 'Failed to update session');
      }
    } catch (err) {
      console.error('Error updating session:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update session');
    }
  };

  const handleCompleteSession = async (sessionId) => {
    setSelectedSession(sessionId);
    setDialogType('complete');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSession(null);
  };

  const handleDialogConfirm = async () => {
    if (dialogType === 'complete' && selectedSession) {
      await handleSessionAction(selectedSession, 'completed');
    }
    handleDialogClose();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'confirmed':
        return <CheckCircleIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Earnings Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Earnings Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Earnings
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(earnings.total)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      This Week
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(earnings.weekly)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      This Month
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(earnings.monthly)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sessions Management */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="All Sessions" />
                <Tab label="Pending Requests" />
                <Tab label="Upcoming Sessions" />
                <Tab label="Completed Sessions" />
              </Tabs>
            </Box>

            {/* All Sessions Tab */}
            <TabPanel value={tabValue} index={0}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="textSecondary">No sessions found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sessions.map((session) => (
                        <TableRow key={session._id}>
                          <TableCell>
                            {format(parseISO(session.date), 'PPP p')}
                          </TableCell>
                          <TableCell>
                            {session.student?.firstName} {session.student?.lastName}
                          </TableCell>
                          <TableCell>{session.subject}</TableCell>
                          <TableCell>{session.duration} hours</TableCell>
                          <TableCell>{formatCurrency(session.price * session.duration)}</TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(session.status)}
                              label={session.status}
                              color={getStatusColor(session.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {session.status === 'pending' && (
                              <>
                                <Tooltip title="Accept">
                                  <IconButton
                                    color="success"
                                    onClick={() => handleSessionAction(session._id, 'confirmed')}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Decline">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleSessionAction(session._id, 'cancelled')}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {session.status === 'confirmed' && (
                              <Tooltip title="Mark as Completed">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleCompleteSession(session._id)}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Pending Requests Tab */}
            <TabPanel value={tabValue} index={1}>
              <List>
                {sessions
                  .filter(session => session.status === 'pending')
                  .length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary="No pending requests"
                      secondary="You don't have any pending session requests at the moment."
                    />
                  </ListItem>
                ) : (
                  sessions
                    .filter(session => session.status === 'pending')
                    .map((session) => (
                      <React.Fragment key={session._id}>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Session with ${session.student?.firstName} ${session.student?.lastName}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {format(parseISO(session.date), 'PPP p')}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Subject: {session.subject} | Duration: {session.duration} hours
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Amount: {formatCurrency(session.price * session.duration)}
                                </Typography>
                              </>
                            }
                          />
                          <Box>
                            <Tooltip title="Accept">
                              <IconButton
                                color="success"
                                onClick={() => handleSessionAction(session._id, 'confirmed')}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Decline">
                              <IconButton
                                color="error"
                                onClick={() => handleSessionAction(session._id, 'cancelled')}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))
                )}
              </List>
            </TabPanel>

            {/* Upcoming Sessions Tab */}
            <TabPanel value={tabValue} index={2}>
              <List>
                {sessions
                  .filter(session => session.status === 'confirmed' && new Date(session.date) > new Date())
                  .length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary="No upcoming sessions"
                      secondary="You don't have any upcoming sessions at the moment."
                    />
                  </ListItem>
                ) : (
                  sessions
                    .filter(session => session.status === 'confirmed' && new Date(session.date) > new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((session) => (
                      <React.Fragment key={session._id}>
                        <ListItem>
                          <ListItemIcon>
                            <AccessTimeIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Session with ${session.student?.firstName} ${session.student?.lastName}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {format(parseISO(session.date), 'PPP p')}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Subject: {session.subject} | Duration: {session.duration} hours
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Amount: {formatCurrency(session.price * session.duration)}
                                </Typography>
                              </>
                            }
                          />
                          <Tooltip title="Mark as Completed">
                            <IconButton
                              color="primary"
                              onClick={() => handleCompleteSession(session._id)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))
                )}
              </List>
            </TabPanel>

            {/* Completed Sessions Tab */}
            <TabPanel value={tabValue} index={3}>
              <List>
                {sessions
                  .filter(session => session.status === 'completed')
                  .length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary="No completed sessions"
                      secondary="You don't have any completed sessions yet."
                    />
                  </ListItem>
                ) : (
                  sessions
                    .filter(session => session.status === 'completed')
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((session) => (
                      <React.Fragment key={session._id}>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Session with ${session.student?.firstName} ${session.student?.lastName}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {format(parseISO(session.date), 'PPP p')}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Subject: {session.subject} | Duration: {session.duration} hours
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Amount: {formatCurrency(session.price * session.duration)}
                                </Typography>
                                {session.rating && (
                                  <>
                                    <br />
                                    <Typography component="span" variant="body2">
                                      Rating: {session.rating}/5
                                    </Typography>
                                  </>
                                )}
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))
                )}
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === 'complete' ? 'Complete Session' : 'Review Session'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this session as completed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogConfirm} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SessionManagement; 