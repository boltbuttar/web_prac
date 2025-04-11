import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Checkbox,
  Chip,
  Stack,
  Button
} from '@mui/material';
import TutorCard from './TutorCard';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';

const TutorSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);

  // Filter states
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedDays, setSelectedDays] = useState([]);
  const [onlineOnly, setOnlineOnly] = useState(false);

  // Available options for filters
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'English', 'Literature', 'Writing',
    'Computer Science', 'Programming', 'Web Development', 'Biology', 'Medical Sciences',
    'Economics', 'Business Studies', 'Finance', 'History', 'Political Science',
    'Social Studies', 'Urdu', 'Arabic', 'Islamic Studies'
  ];

  const cities = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchTutors();
  }, []);

  useEffect(() => {
    filterTutors();
  }, [tutors, selectedSubjects, selectedCities, priceRange, minRating, selectedDays, onlineOnly]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching tutors...');
      const response = await api.get('/tutor');
      console.log('Raw API Response:', response);

      if (!response || !response.data) {
        throw new Error('No response from server');
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch tutors');
      }

      const tutorsData = response.data.data || [];
      console.log('Tutors data before validation:', tutorsData);

      // Enhanced validation and data transformation
      const validTutors = tutorsData.filter(tutor => {
        const isValid = tutor && 
                       tutor._id &&
                       tutor.user && 
                       tutor.user.firstName && 
                       tutor.user.lastName &&
                       Array.isArray(tutor.subjects);
        
        if (!isValid) {
          console.warn('Invalid tutor data:', tutor);
        }
        return isValid;
      }).map(tutor => ({
        ...tutor,
        rating: tutor.rating || 0,
        totalReviews: tutor.totalReviews || 0,
        subjects: tutor.subjects || [],
        hourlyRate: tutor.hourlyRate || 0,
        availability: tutor.availability || {},
        teachingPreferences: tutor.teachingPreferences || { online: true, inPerson: true }
      }));

      console.log('Valid tutors after transformation:', validTutors);

      if (validTutors.length === 0) {
        setError('No tutors available at the moment.');
        setTutors([]);
      } else {
        setTutors(validTutors);
        setFilteredTutors(validTutors); // Initialize filtered tutors
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError(error.message || 'Failed to load tutors. Please try again later.');
      setTutors([]);
      setFilteredTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTutors = () => {
    let filtered = [...tutors];

    // Filter by subjects
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(tutor =>
        selectedSubjects.some(subject => tutor.subjects.includes(subject))
      );
    }

    // Filter by cities
    if (selectedCities.length > 0) {
      filtered = filtered.filter(tutor =>
        selectedCities.includes(tutor.user.city)
      );
    }

    // Filter by price range
    filtered = filtered.filter(tutor =>
      tutor.hourlyRate >= priceRange[0] && tutor.hourlyRate <= priceRange[1]
    );

    // Filter by rating
    filtered = filtered.filter(tutor =>
      tutor.rating >= minRating
    );

    // Filter by availability
    if (selectedDays.length > 0) {
      filtered = filtered.filter(tutor =>
        selectedDays.some(day => {
          const dayLower = day.toLowerCase();
          return tutor.availability[dayLower]?.start && tutor.availability[dayLower]?.end;
        })
      );
    }

    // Filter by online availability
    if (onlineOnly) {
      filtered = filtered.filter(tutor =>
        tutor.teachingPreferences?.online === true
      );
    }

    setFilteredTutors(filtered);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubjects(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCities(event.target.value);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue);
  };

  const handleDayToggle = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleOnlineToggle = (event) => {
    setOnlineOnly(event.target.checked);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Filters
        </Typography>
        <Grid container spacing={2}>
          {/* Subjects Filter */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Subjects</InputLabel>
              <Select
                multiple
                value={selectedSubjects}
                onChange={handleSubjectChange}
                label="Subjects"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Cities Filter */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Cities</InputLabel>
              <Select
                multiple
                value={selectedCities}
                onChange={handleCityChange}
                label="Cities"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Price Range Filter */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Price Range (PKR/hour)</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              step={100}
              marks={[
                { value: 0, label: '0' },
                { value: 1000, label: '1000' },
                { value: 2000, label: '2000' }
              ]}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">PKR {priceRange[0]}</Typography>
              <Typography variant="body2">PKR {priceRange[1]}</Typography>
            </Box>
          </Grid>

          {/* Rating Filter */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Slider
              value={minRating}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 2.5, label: '2.5' },
                { value: 5, label: '5' }
              ]}
            />
            <Typography variant="body2" align="center">
              {minRating} / 5
            </Typography>
          </Grid>

          {/* Days Filter */}
          <Grid item xs={12}>
            <Typography gutterBottom>Available Days</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {days.map((day) => (
                <Chip
                  key={day}
                  label={day}
                  onClick={() => handleDayToggle(day)}
                  color={selectedDays.includes(day) ? 'primary' : 'default'}
                />
              ))}
            </Stack>
          </Grid>

          {/* Online Only Filter */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={onlineOnly}
                  onChange={handleOnlineToggle}
                />
              }
              label="Online Sessions Only"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      <Typography variant="h6" gutterBottom>
        Available Tutors ({filteredTutors.length})
      </Typography>
      {filteredTutors.length === 0 ? (
        <Alert severity="info">
          No tutors found matching your criteria.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredTutors.map((tutor) => (
            <Grid item xs={12} sm={6} md={4} key={tutor._id}>
              <TutorCard
                tutor={tutor}
                onBookSession={(tutorId) => navigate(`/book-session/${tutorId}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TutorSearch; 