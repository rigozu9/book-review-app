import { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

const AddReadBook = ({ userId, bookId }) => {
  const [rating, setRating] = useState('');
  const [dateStarted, setDateStarted] = useState('');
  const [dateFinished, setDateFinished] = useState('');
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddBook = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/read_books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id: bookId, rating, date_started: dateStarted, date_finished: dateFinished, review }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Book added to read list');
        setSnackbarMessage('Book added to read list');
        setSnackbarOpen(true);
        handleClose();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen}>
        Add to Read Books
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add Book Details
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            label="Rating (1-10)"
            variant="outlined"
            margin="normal"
            inputProps={{ min: 1, max: 10, step: 0.1 }}
          />
          <TextField
            fullWidth
            type="date"
            value={dateStarted}
            onChange={(e) => setDateStarted(e.target.value)}
            label="Start Date"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="date"
            value={dateFinished}
            onChange={(e) => setDateFinished(e.target.value)}
            label="Finish Date"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            value={review}
            onChange={(e) => setReview(e.target.value)}
            label="Write a review"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
          />
          <Button variant="contained" onClick={handleAddBook} sx={{ mt: 2 }}>
            Submit
          </Button>
          {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
        </Box>
      </Modal>
      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddReadBook;
