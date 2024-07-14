import { useState } from 'react';
import { Box, Button, Typography, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

const AddBookToPlan = ({ userId, bookId }) => {
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddBook = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/plan_to_read_books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage('Book added to plan to read list');
        setSnackbarSeverity('success');
      } else {
        setMessage(data.error);
        setSnackbarMessage(data.error);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
      setSnackbarMessage('Error: ' + error.message);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ paddingLeft: 0, paddingBottom: 2}}>
      <Button variant="contained" onClick={handleAddBook}>
        Add to Plan to Read
      </Button>
      {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        open={snackbarOpen} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddBookToPlan;
