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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import { format } from 'date-fns';

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TutorDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    weekly: 0,
    monthly: 0,
    perSession: []
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    subjects: [],
    hourlyRate: '',
    availability: '',
    city: ''
  });

  // Add function to format availability
  const formatAvailability = (availability) => {
    if (!availability) return 'Not specified';
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availableDays = days.filter(day => availability[day]?.start && availability[day]?.end);
    
    if (availableDays.length === 0) return 'Not specified';
    
    return availableDays.map(day => {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      return `${dayName}: ${availability[day].start} - ${availability[day].end}`;
    }).join(', ');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch profile data
      const profileResponse = await api.get('/tutor/profile');
      if (profileResponse.data.success) {
        const profileData = profileResponse.data.data;
        setProfile({
          firstName: profileData.user.firstName,
          lastName: profileData.user.lastName,
          subjects: profileData.subjects,
          hourlyRate: profileData.hourlyRate,
          city: profileData.user.city,
          availability: profileData.availability,
          bio: profileData.bio
        });

        // Update edit form
        setEditForm({
          firstName: profileData.user.firstName,
          lastName: profileData.user.lastName,
          bio: profileData.bio || '',
          subjects: profileData.subjects || [],
          hourlyRate: profileData.hourlyRate || '',
          availability: profileData.availability || '',
          city: profileData.user.city || ''
        });
      }

      // Fetch sessions data
      const sessionsResponse = await api.get('/tutor/sessions');
      if (sessionsResponse.data.success) {
        setSessions(sessionsResponse.data.data || []);
      }

      // Fetch earnings data
      const earningsResponse = await api.get('/tutor/earnings');
      if (earningsResponse.data.success) {
        const earningsData = earningsResponse.data.data;
        setEarnings({
          total: earningsData.total || 0,
          weekly: earningsData.weekly || 0,
          monthly: earningsData.monthly || 0,
          perSession: earningsData.perSession || []
        });
      } else {
        // Reset earnings to default state if the request fails
        setEarnings({
          total: 0,
          weekly: 0,
          monthly: 0,
          perSession: []
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      // Reset earnings to default state on error
      setEarnings({
        total: 0,
        weekly: 0,
        monthly: 0,
        perSession: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditFormChange = (field) => (event) => {
    setEditForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await api.put('/tutor/profile', {
        subjects: editForm.subjects,
        hourlyRate: editForm.hourlyRate,
        bio: editForm.bio,
        availability: editForm.availability
      });

      if (response.data.success) {
        fetchDashboardData(); // Refresh the dashboard data
        handleEditDialogClose();
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleSessionAction = async (sessionId, action) => {
    try {
      const response = await api.patch(`/sessions/${sessionId}/status`, {
        status: action === 'confirm' ? 'confirmed' : 'cancelled'
      });

      if (response.data.success) {
        fetchDashboardData(); // Refresh the dashboard data
      }
    } catch (err) {
      console.error('Error updating session:', err);
      setError(`Failed to ${action} session`);
    }
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
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" gutterBottom>
                  {profile?.firstName || 'Loading...'} {profile?.lastName || ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile?.subjects?.join(', ') || 'No subjects listed'}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <MoneyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Hourly Rate" 
                  secondary={`PKR ${profile?.hourlyRate || '0'}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Location" 
                  secondary={profile?.city || 'Not specified'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Availability" 
                  secondary={formatAvailability(profile?.availability)}
                />
              </ListItem>
            </List>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditDialogOpen}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </Paper>

          {/* Earnings Summary */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Earnings Summary
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <MoneyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Earnings" 
                  secondary={`PKR ${earnings.total}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MoneyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="This Week" 
                  secondary={`PKR ${earnings.weekly}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MoneyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="This Month" 
                  secondary={`PKR ${earnings.monthly}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Upcoming Sessions" />
              <Tab label="Session History" />
              <Tab label="Earnings Details" />
            </Tabs>

            {/* Upcoming Sessions Tab */}
            <TabPanel value={tabValue} index={0}>
              <List>
                {sessions
                  .filter(session => session.status === 'pending' || session.status === 'confirmed')
                  .map((session) => (
                    <React.Fragment key={session._id}>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${session.student.firstName} ${session.student.lastName}`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {format(new Date(session.date), 'PPP')} at {session.time}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Subject: {session.subject}
                              </Typography>
                            </>
                          }
                        />
                        {session.status === 'pending' && (
                          <Box>
                            <Tooltip title="Accept">
                              <IconButton
                                color="success"
                                onClick={() => handleSessionAction(session._id, 'confirm')}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Decline">
                              <IconButton
                                color="error"
                                onClick={() => handleSessionAction(session._id, 'reject')}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                        <Tooltip title="Chat with Student">
                          <IconButton color="primary">
                            <ChatIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
              </List>
            </TabPanel>

            {/* Session History Tab */}
            <TabPanel value={tabValue} index={1}>
              <List>
                {sessions
                  .filter(session => session.status === 'completed')
                  .map((session) => (
                    <React.Fragment key={session._id}>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${session.student.firstName} ${session.student.lastName}`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {format(new Date(session.date), 'PPP')} at {session.time}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Subject: {session.subject}
                              </Typography>
                            </>
                          }
                        />
                        <Typography variant="body1" color="primary">
                          PKR {session.price}
                        </Typography>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
              </List>
            </TabPanel>

            {/* Earnings Details Tab */}
            <TabPanel value={tabValue} index={2}>
              <List>
                {earnings.perSession.map((earning, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <MoneyIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Session with ${earning.studentName}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {format(new Date(earning.date), 'PPP')}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              Subject: {earning.subject}
                            </Typography>
                          </>
                        }
                      />
                      <Typography variant="body1" color="primary">
                        PKR {earning.amount}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={editForm.firstName}
                onChange={handleEditFormChange('firstName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={editForm.lastName}
                onChange={handleEditFormChange('lastName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={editForm.bio}
                onChange={handleEditFormChange('bio')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Subjects</InputLabel>
                <Select
                  multiple
                  value={editForm.subjects}
                  onChange={handleEditFormChange('subjects')}
                  label="Subjects"
                >
                  <MenuItem value="Mathematics">Mathematics</MenuItem>
                  <MenuItem value="Physics">Physics</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
                  <MenuItem value="Biology">Biology</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hourly Rate (PKR)"
                type="number"
                value={editForm.hourlyRate}
                onChange={handleEditFormChange('hourlyRate')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Availability"
                value={editForm.availability}
                onChange={handleEditFormChange('availability')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                value={editForm.city}
                onChange={handleEditFormChange('city')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleProfileUpdate} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TutorDashboard; 