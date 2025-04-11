import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  CardActions,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  LocationOn,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tutorsAPI, sessionsAPI, wishlistAPI } from '../../utils/api';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import TutorSearch from '../../components/TutorSearch';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessions, setSessions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all available tutors first
      console.log('Fetching tutors...');
      const tutorsResponse = await tutorsAPI.getAll();
      console.log('Tutors response:', tutorsResponse);
      
      if (tutorsResponse?.data?.success) {
        const tutorData = tutorsResponse.data.data;
        console.log('Setting tutors:', tutorData);
        setTutors(tutorData || []);
      } else {
        console.error('Failed to fetch tutors:', tutorsResponse);
        throw new Error(tutorsResponse?.data?.message || 'Failed to fetch tutors');
      }

      // Fetch all sessions
      console.log('Fetching sessions...');
      const sessionsResponse = await sessionsAPI.getAll();
      console.log('Sessions response:', sessionsResponse);
      if (sessionsResponse?.data?.success) {
        setSessions(sessionsResponse.data.data || []);
      }

      // Fetch wishlist
      console.log('Fetching wishlist...');
      const wishlistResponse = await wishlistAPI.getAll();
      console.log('Wishlist response:', wishlistResponse);
      if (wishlistResponse?.data?.success) {
        setWishlist(wishlistResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error?.response?.data?.message || error.message || 'Error fetching data');
      setTutors([]);
      setSessions([]);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const handleAddToWishlist = async (tutorId) => {
    try {
      const response = await wishlistAPI.add(tutorId);
      if (response.data.success) {
        setWishlist([...wishlist, response.data.data]);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setError(error.response?.data?.message || error.message || 'Error adding to wishlist');
    }
  };

  const handleRemoveFromWishlist = async (tutorId) => {
    try {
      await wishlistAPI.remove(tutorId);
      setWishlist(wishlist.filter(item => item.tutor !== tutorId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError(error.response?.data?.message || error.message || 'Error removing from wishlist');
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
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Welcome back, {user?.firstName}!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Continue your learning journey
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Upcoming Sessions" />
              <Tab label="Find Tutors" />
              <Tab label="My Tutors" />
              <Tab label="Wishlist" />
            </Tabs>

            {/* Upcoming Sessions Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
                    All Sessions
            </Typography>
                  {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Alert severity="error">{error}</Alert>
                  ) : sessions.length === 0 ? (
                    <Alert severity="info">No sessions available at the moment.</Alert>
                  ) : (
            <List>
                      {sessions.map((session) => (
                        <React.Fragment key={session._id}>
                          <ListItem>
                            <ListItemIcon>
                              <CalendarIcon color="primary" />
                            </ListItemIcon>
                  <ListItemText
                              primary={`Session with ${session.tutor?.firstName} ${session.tutor?.lastName}`}
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
                                    Amount: PKR {session.price * session.duration}
                                  </Typography>
                                </>
                              }
                            />
                            <Chip
                              icon={getStatusIcon(session.status)}
                              label={session.status}
                              color={getStatusColor(session.status)}
                    size="small"
                            />
                </ListItem>
                          <Divider />
                        </React.Fragment>
              ))}
            </List>
                  )}
        </Grid>
              </Grid>
            </TabPanel>

            {/* Find Tutors Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Available Tutors
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : !tutors || tutors.length === 0 ? (
                <Alert severity="info">
                  No tutors available at the moment.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {tutors.map((tutor) => (
                    <Grid item xs={12} sm={6} md={4} key={tutor._id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              src={tutor.profilePicture}
                              alt={`${tutor.firstName} ${tutor.lastName}`}
                              sx={{ width: 56, height: 56, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="h6">
                                {tutor.firstName} {tutor.lastName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                {tutor.city}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Subjects:</strong>
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {tutor.subjects && tutor.subjects.map((subject, index) => (
                              <Chip
                                key={index}
                                label={subject}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            <strong>Rate:</strong> Rs. {tutor.hourlyRate}/hour
                          </Typography>

                          {tutor.experience && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              <strong>Experience:</strong> {tutor.experience}
                            </Typography>
                          )}

                          {tutor.education && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              <strong>Education:</strong> {tutor.education}
                            </Typography>
                          )}

                          {tutor.bio && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {tutor.bio}
                            </Typography>
                          )}

                          {tutor.teachingPreferences && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Teaching Mode:</strong>
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                {tutor.teachingPreferences.online && (
                                  <Chip size="small" label="Online" color="primary" variant="outlined" />
                                )}
                                {tutor.teachingPreferences.inPerson && (
                                  <Chip size="small" label="In-Person" color="primary" variant="outlined" />
                                )}
                              </Box>
                            </Box>
                          )}
                        </CardContent>

                        <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => navigate(`/book-session/${tutor._id}`)}
                            startIcon={<CalendarIcon />}
                          >
                            Book Session
                          </Button>
                          <IconButton
                            size="small"
                            color={wishlist.some(item => item.tutor === tutor._id) ? "error" : "default"}
                            onClick={() => {
                              const isInWishlist = wishlist.some(item => item.tutor === tutor._id);
                              if (isInWishlist) {
                                handleRemoveFromWishlist(tutor._id);
                              } else {
                                handleAddToWishlist(tutor._id);
                              }
                            }}
                          >
                            <FavoriteIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* My Tutors Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                My Tutors
              </Typography>
              {sessions.length === 0 ? (
                <Alert severity="info">
                  You haven't had any sessions with tutors yet.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {Array.from(new Set(sessions.map(session => session.tutor?._id))).map(tutorId => {
                    const tutor = sessions.find(session => session.tutor?._id === tutorId)?.tutor;
                    if (!tutor) return null;
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={tutorId}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {tutor.firstName} {tutor.lastName}
                            </Typography>
                            <Typography color="textSecondary" gutterBottom>
                              <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {tutor.city}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <PersonIcon fontSize="small" />
                                Subjects: {tutor.subjects?.join(', ')}
                              </Box>
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Rate: PKR {tutor.hourlyRate}/hour
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {sessions.filter(s => s.tutor?._id === tutorId).length} sessions taken
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              component={Link}
                              to={`/sessions/book/${tutorId}`}
                              startIcon={<CalendarIcon />}
                            >
                              Book Again
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </TabPanel>

            {/* Wishlist Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                My Wishlist
              </Typography>
              {wishlist.length === 0 ? (
                <Alert severity="info">
                  Your wishlist is empty. Add tutors you're interested in!
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {wishlist.map((item) => {
                    const tutor = tutors.find(t => t._id === item.tutor);
                    if (!tutor) return null;

                    return (
                      <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {tutor.firstName} {tutor.lastName}
                            </Typography>
                            <Typography color="textSecondary" gutterBottom>
                              <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {tutor.city}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <PersonIcon fontSize="small" />
                                Subjects: {tutor.subjects?.join(', ')}
                              </Box>
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Rate: PKR {tutor.hourlyRate}/hour
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {tutor.bio}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              component={Link}
                              to={`/sessions/book/${tutor._id}`}
                              startIcon={<CalendarIcon />}
                            >
                              Book Session
                            </Button>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveFromWishlist(tutor._id)}
                            >
                              <FavoriteIcon />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 