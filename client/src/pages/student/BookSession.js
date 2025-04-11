import React from 'react';
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import BookSessionComponent from '../../components/sessions/BookSession';

const BookSession = () => {
  const { tutorId } = useParams();
  
  if (!tutorId) {
    return <div>Error: No tutor ID provided</div>;
  }

  return (
    <Container>
      <BookSessionComponent tutorId={tutorId} />
    </Container>
  );
};

export default BookSession; 