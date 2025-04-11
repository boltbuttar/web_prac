import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { School as SchoolIcon } from '@mui/icons-material';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: 'student',
    grade: '',
    // Tutor specific fields
    subjects: [],
    hourlyRate: '',
    education: '',
    experience: '',
    bio: '',
    availability: {
      monday: { start: '', end: '' },
      tuesday: { start: '', end: '' },
      wednesday: { start: '', end: '' },
      thursday: { start: '', end: '' },
      friday: { start: '', end: '' },
      saturday: { start: '', end: '' },
      sunday: { start: '', end: '' }
    },
    teachingPreferences: {
      online: true,
      inPerson: true,
      location: ''
    }
  });

  const steps = ['Basic Information', 'Role Selection', 'Additional Details'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Format the data according to backend expectations
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        role: formData.role,
        grade: formData.grade
      };

      // Add role-specific data
      if (formData.role === 'tutor') {
        registrationData.subjects = formData.subjects;
        registrationData.hourlyRate = Number(formData.hourlyRate);
        registrationData.education = formData.education.trim();
        registrationData.experience = formData.experience.trim();
        registrationData.bio = formData.bio.trim();
        registrationData.availability = formData.availability;
        registrationData.teachingPreferences = formData.teachingPreferences;
      }

      console.log('Sending registration data:', registrationData); // Debug log
      
      const response = await register(registrationData);
      console.log('Registration successful:', response); // Debug log
      
      setSuccess('Registration successful! Redirecting...');
      
      // Redirect based on role
      setTimeout(() => {
        switch (formData.role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'tutor':
            navigate('/tutor/dashboard');
            break;
          default:
            navigate('/');
        }
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectsChange = (e) => {
    setFormData(prev => ({
      ...prev,
      subjects: e.target.value
    }));
  };

  const handleAvailabilityChange = (day, field) => (e) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: e.target.value
        }
      }
    }));
  };

  const handleTeachingPreferencesChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      teachingPreferences: {
        ...prev.teachingPreferences,
        [field]: e.target.checked
      }
    }));
  };

  const renderBasicInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
      </Grid>
    </Grid>
  );

  const renderRoleSelection = () => (
    <FormControl fullWidth>
      <InputLabel>Select Role</InputLabel>
      <Select
        name="role"
        value={formData.role}
        onChange={handleInputChange}
        label="Select Role"
        required
      >
        <MenuItem value="student">Student</MenuItem>
        <MenuItem value="tutor">Tutor</MenuItem>
      </Select>
    </FormControl>
  );

  const renderAdditionalDetails = () => (
    <Grid container spacing={2}>
      {formData.role === 'tutor' ? (
        <>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Experience (years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hourly Rate (PKR)"
              name="hourlyRate"
              type="number"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Subjects</InputLabel>
              <Select
                multiple
                value={formData.subjects}
                onChange={handleSubjectsChange}
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
            <Typography variant="h6" gutterBottom>Availability</Typography>
            {Object.entries(formData.availability).map(([day, times]) => (
              <Grid container spacing={2} key={day} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ textTransform: 'capitalize' }}>{day}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={times.start}
                    onChange={handleAvailabilityChange(day, 'start')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={times.end}
                    onChange={handleAvailabilityChange(day, 'end')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Teaching Preferences</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.teachingPreferences.online}
                  onChange={handleTeachingPreferencesChange('online')}
                />
              }
              label="Online Teaching"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.teachingPreferences.inPerson}
                  onChange={handleTeachingPreferencesChange('inPerson')}
                />
              }
              label="In-Person Teaching"
            />
            {formData.teachingPreferences.inPerson && (
              <TextField
                fullWidth
                label="Location"
                value={formData.teachingPreferences.location}
                onChange={(e) => handleTeachingPreferencesChange('location')(e)}
                required
                sx={{ mt: 2 }}
              />
            )}
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="School"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </>
      )}
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderRoleSelection();
      case 2:
        return renderAdditionalDetails();
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join EduConnect Pakistan and start your learning journey
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!formData.role && activeStep === 1}
              >
                Next
              </Button>
            )}
          </Box>
        </form>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Already have an account?
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            color="primary"
            fullWidth
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage; 