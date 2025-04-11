import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ReviewList = ({ reviews, onEdit, onDelete, currentUserId }) => {
  return (
    <Grid container spacing={3}>
      {reviews.map((review) => (
        <Grid item xs={12} key={review._id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {review.student.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {format(new Date(review.createdAt), 'MMMM dd, yyyy')}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                </Box>
                {review.student._id === currentUserId && (
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(review)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(review._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1">
                {review.comment}
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Session: {review.session.subject} on {format(new Date(review.session.date), 'MMMM dd, yyyy')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {reviews.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary" align="center">
            No reviews found
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ReviewList; 