import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddBookToPlan from './AddBookToPlan';
import AddReadBook from './AddReadBook';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/books/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch book details');
                }
                const data = await res.json();
                setBook(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBook();
    }, [id]);

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!book) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const { volumeInfo } = book;

    const goToUserPage = () => {
        const userId = localStorage.getItem('userId');
        console.log('User ID:', userId); // Debugging line
        if (userId) {
            navigate(`/userpage/${userId}`);
        } else {
            console.error('User ID not found in localStorage');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h2" gutterBottom sx={{ fontSize: "2.2rem"}}>
                {volumeInfo?.title || 'No title available'}
            </Typography>
            {volumeInfo?.imageLinks?.thumbnail && (
                <Box component="img" src={volumeInfo.imageLinks.thumbnail} alt={volumeInfo.title} sx={{ width: '100%', maxWidth: 300, mb: 2 }} />
            )}
            <Typography variant="body1" paragraph>
                {volumeInfo?.description || 'No description available'}
            </Typography>
            <Typography variant="body2">
                Authors: {volumeInfo?.authors?.join(', ') || 'Unknown'}
            </Typography>
            <Typography variant="body2">
                Published Date: {volumeInfo?.publishedDate || 'Unknown'}
            </Typography>
            <Typography variant="body2">
                Publisher: {volumeInfo?.publisher || 'Unknown'}
            </Typography>
            <Typography variant="body2" paragraph>
                Page Count: {volumeInfo?.pageCount || 'Unknown'}
            </Typography>
            <AddBookToPlan userId={userId} bookId={id} />
            <AddReadBook userId={userId} bookId={id} />
            <Button variant="contained" onClick={goToUserPage} sx={{ mt: 2 }}>
                Go to My Page
            </Button>
        </Box>
    );
};

export default BookDetail;
