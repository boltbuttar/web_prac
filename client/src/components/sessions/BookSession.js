import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { format, addMinutes, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import api from '../../config/api';

const steps = ['Select Subject', 'Choose Time', 'Confirm Booking'];

const BookSession = ({ tutorId }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    date: null,
    duration: 60,
    location: 'online',
    notes: ''
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Fetch tutor details
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await api.get(`/tutor/${tutorId}`);
        if (response.data.success) {
          setTutor(response.data.data);
          // Set default subject if available
          if (response.data.data.subjects?.length > 0) {
            setFormData(prev => ({ ...prev, subject: response.data.data.subjects[0] }));
          }
        } else {
          setError('Failed to fetch tutor details');
        }
      } catch (error) {
        setError(error.message || 'Error fetching tutor details');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const start = startOfDay(date);
      const end = endOfDay(date);
      const response = await api.get(`/sessions/available-slots/${tutorId}`, {
        params: {
          startDate: start.toISOString(),
          endDate: end.toISOString()
        }
      });

      if (response.data.success) {
        setAvailableSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate
    });
  };

  const calculatePrice = () => {
    if (!tutor || !formData.duration) return 0;
    return (tutor.hourlyRate * formData.duration) / 60;
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await api.post('/sessions/book', {
        tutorId,
        ...formData
      });

      if (response.data.success) {
        setBookingConfirmed(true);
        setTimeout(() => {
          navigate('/student/sessions');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to book session');
      }
    } catch (error) {
      setError(error.message || 'Error booking session');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={formData.subject}
                  onChange={handleInputChange('subject')}
                  required
                >
                  {tutor.subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  required
                >
                  {tutor.teachingPreferences.online && (
                    <MenuItem value="online">Online</MenuItem>
                  )}
                  {tutor.teachingPreferences.inPerson && (
                    <MenuItem value={tutor.teachingPreferences.location}>
                      In Person - {tutor.teachingPreferences.location}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DateTimePicker
                label="Session Date & Time"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
                minDate={new Date()}
                minTime={new Date(0, 0, 0, 9)}
                maxTime={new Date(0, 0, 0, 20)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Duration (minutes)</InputLabel>
                <Select
                  value={formData.duration}
                  onChange={handleInputChange('duration')}
                  required
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                  <MenuItem value={90}>1.5 hours</MenuItem>
                  <MenuItem value={120}>2 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {availableSlots.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Available Time Slots:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableSlots.map((slot) => (
                    <Chip
                      key={slot}
                      label={format(new Date(slot), 'h:mm a')}
                      onClick={() => handleDateChange(new Date(slot))}
                      color={formData.date && format(formData.date, 'HH:mm') === format(new Date(slot), 'HH:mm') ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Tutor:</strong> {tutor.user.firstName} {tutor.user.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Subject:</strong> {formData.subject}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Date:</strong> {formData.date ? format(formData.date, 'PPP') : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Time:</strong> {formData.date ? format(formData.date, 'p') : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Duration:</strong> {formData.duration} minutes
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Location:</strong> {formData.location}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Price:</strong> PKR {calculatePrice()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange('notes')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tutor) {
    return (
      <Alert severity="error">
        Tutor not found
      </Alert>
    );
  }

  if (bookingConfirmed) {
    return (
      <Alert severity="success">
        Session booked successfully! Redirecting to your sessions...
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Book a Session with {tutor.user.firstName} {tutor.user.lastName}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Confirm Booking
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && !formData.subject) ||
                      (activeStep === 1 && !formData.date)
                    }
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default BookSession; 