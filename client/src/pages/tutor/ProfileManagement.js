import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const ProfileManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    education: '',
    experience: '',
    bio: '',
    subjects: [],
    hourlyRate: '',
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/tutor/profile');
      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);
        setFormData({
          firstName: profileData.user.firstName,
          lastName: profileData.user.lastName,
          education: profileData.education || '',
          experience: profileData.experience || '',
          bio: profileData.bio || '',
          subjects: profileData.subjects || [],
          hourlyRate: profileData.hourlyRate || '',
          availability: profileData.availability || formData.availability,
          teachingPreferences: profileData.teachingPreferences || formData.teachingPreferences
        });
        if (profileData.profilePicture) {
          setPreviewImage(profileData.profilePicture);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
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

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleTeachingPreferencesChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      teachingPreferences: {
        ...prev.teachingPreferences,
        [field]: value
      }
    }));
  };

  const handleSubjectAdd = (subject) => {
    if (subject && !formData.subjects.includes(subject)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    }
  };

  const handleSubjectDelete = (subjectToDelete) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToDelete)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'availability' || key === 'teachingPreferences') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'subjects') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // If there's a new image, append it
      if (previewImage && previewImage.startsWith('data:')) {
        const base64Data = previewImage.split(',')[1];
        formDataToSend.append('profilePicture', base64Data);
      }

      const response = await api.put('/tutor/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess('Profile updated successfully');
        fetchProfile(); // Refresh profile data
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Edit Profile
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                </Grid>
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
                    label="Experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>

                {/* Subjects */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Subjects
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      label="Add Subject"
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSubjectAdd(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <IconButton color="primary" onClick={() => handleSubjectAdd(document.querySelector('input[type="text"]').value)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.subjects.map((subject) => (
                      <Chip
                        key={subject}
                        label={subject}
                        onDelete={() => handleSubjectDelete(subject)}
                        deleteIcon={<DeleteIcon />}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Hourly Rate */}
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

                {/* Availability */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Availability
                  </Typography>
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
                          onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="End Time"
                          type="time"
                          value={times.end}
                          onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>

                {/* Teaching Preferences */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Teaching Preferences
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.teachingPreferences.online}
                            onChange={(e) => handleTeachingPreferencesChange('online', e.target.checked)}
                          />
                        }
                        label="Online Teaching"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.teachingPreferences.inPerson}
                            onChange={(e) => handleTeachingPreferencesChange('inPerson', e.target.checked)}
                          />
                        }
                        label="In-Person Teaching"
                      />
                    </Grid>
                    {formData.teachingPreferences.inPerson && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Teaching Location"
                          name="teachingPreferences.location"
                          value={formData.teachingPreferences.location}
                          onChange={(e) => handleTeachingPreferencesChange('location', e.target.value)}
                          required
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving}
                    sx={{ mt: 2 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Profile Preview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Profile Preview
            </Typography>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={previewImage || '/default-profile.png'}
                alt="Profile"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {formData.firstName} {formData.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {formData.education}
                </Typography>
                <Typography variant="body2" paragraph>
                  {formData.bio}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Subjects:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {formData.subjects.map((subject) => (
                    <Chip key={subject} label={subject} size="small" />
                  ))}
                </Box>
                <Typography variant="subtitle1" gutterBottom>
                  Rate: PKR {formData.hourlyRate}/hour
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Teaching Preferences:
                </Typography>
                <Typography variant="body2">
                  {formData.teachingPreferences.online && 'Online '}
                  {formData.teachingPreferences.inPerson && 'In-Person'}
                </Typography>
                {formData.teachingPreferences.inPerson && (
                  <Typography variant="body2" color="text.secondary">
                    Location: {formData.teachingPreferences.location}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileManagement; 