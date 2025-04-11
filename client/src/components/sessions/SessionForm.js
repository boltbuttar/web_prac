import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

const SessionForm = ({ onSubmit, initialData, isEdit }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    if (initialData) {
      setDate(new Date(initialData.date));
      setStartTime(new Date(`2000-01-01T${initialData.startTime}`));
      setDuration(initialData.duration);
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (data) => {
    if (!date || !startTime) {
      enqueueSnackbar('Please select date and time', { variant: 'error' });
      return;
    }

    const formattedData = {
      ...data,
      date: date.toISOString().split('T')[0],
      startTime: startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      duration: parseInt(duration),
      price: parseFloat(data.price),
    };

    onSubmit(formattedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {isEdit ? 'Edit Session' : 'Create New Session'}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Subject"
            {...register('subject', { required: 'Subject is required' })}
            error={!!errors.subject}
            helperText={errors.subject?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={setDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Duration (minutes)</InputLabel>
            <Select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              label="Duration (minutes)"
            >
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={90}>1.5 hours</MenuItem>
              <MenuItem value={120}>2 hours</MenuItem>
              <MenuItem value={180}>3 hours</MenuItem>
              <MenuItem value={240}>4 hours</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Location"
            {...register('location', { required: 'Location is required' })}
            error={!!errors.location}
            helperText={errors.location?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' },
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            {...register('notes')}
            error={!!errors.notes}
            helperText={errors.notes?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            {isEdit ? 'Update Session' : 'Create Session'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionForm; 