import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Divider,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon
} from '@mui/icons-material';

const ReviewsPage = () => {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Mock data - would be replaced with API data
  const reviews = [
    {
      id: 1,
      student: {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40'
      },
      tutor: {
        name: 'Dr. Sarah Khan',
        subject: 'Mathematics'
      },
      rating: 5,
      comment: 'Excellent tutor! Very patient and explains concepts clearly.',
      date: '2024-03-15',
      helpful: true,
      wouldRecommend: true,
      likes: 12,
      dislikes: 0
    },
    {
      id: 2,
      student: {
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40'
      },
      tutor: {
        name: 'Prof. Ahmed Hassan',
        subject: 'Physics'
      },
      rating: 4,
      comment: 'Good session overall. Helped me understand complex topics.',
      date: '2024-03-14',
      helpful: true,
      wouldRecommend: true,
      likes: 8,
      dislikes: 1
    },
    // Add more mock reviews as needed
  ];

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1); // Reset to first page when sort changes
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const ReviewCard = ({ review }) => (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={review.student.avatar} alt={review.student.name} />
        }
        title={review.student.name}
        subheader={new Date(review.date).toLocaleDateString()}
        action={
          <Box>
            <Tooltip title="Helpful">
              <IconButton size="small">
                <ThumbUpIcon color="primary" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {review.likes}
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Not Helpful">
              <IconButton size="small">
                <ThumbDownIcon color="error" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {review.dislikes}
                </Typography>
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={review.rating} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {review.tutor.subject}
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          {review.comment}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {review.helpful && (
            <Chip
              label="Helpful"
              color="success"
              size="small"
            />
          )}
          {review.wouldRecommend && (
            <Chip
              label="Would Recommend"
              color="primary"
              size="small"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reviews
      </Typography>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                onChange={handleFilterChange}
                label="Filter"
                startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Reviews</MenuItem>
                <MenuItem value="helpful">Helpful Reviews</MenuItem>
                <MenuItem value="recommended">Recommended</MenuItem>
                <MenuItem value="recent">Recent Reviews</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sort}
                onChange={handleSortChange}
                label="Sort By"
                startAdornment={<SortIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="highest">Highest Rated</MenuItem>
                <MenuItem value="helpful">Most Helpful</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Reviews"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by tutor, subject, or content..."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Reviews List */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Grid>
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={10} // This would be replaced with actual total pages from API
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default ReviewsPage; 