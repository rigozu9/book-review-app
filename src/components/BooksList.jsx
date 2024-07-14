import { Link } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography } from '@mui/material';

const BooksList = ({ books }) => {
    if (!Array.isArray(books)) {
        return <Typography>No books found.</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4, p: 5 }}>
            {books.map((book) => {
                const imageLinks = book.volumeInfo.imageLinks;
                const imageUrl = imageLinks?.thumbnail || imageLinks?.smallThumbnail;

                return (
                    <Card 
                        key={book.id} 
                        sx={{ 
                            width: 300, 
                            position: 'relative', 
                            borderRadius: '7px',
                            overflow: 'hidden', 
                            transition: 'transform 0.3s ease', 
                            '&:hover': { 
                                transform: 'scale(1.1)', 
                                '& .overlay': { 
                                    transform: 'translateY(0)' 
                                } 
                            } 
                        }}
                    >
                        <Link to={`/books/${book.id}`}>
                            {imageUrl && <CardMedia component="img" image={imageUrl} alt="book cover" sx={{ height: 450, cursor: 'pointer' }} />}
                        </Link>
                        <CardContent 
                            className="overlay" 
                            sx={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                left: 0, 
                                right: 0, 
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                                transform: 'translateY(100%)', 
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            <Typography variant="h6" color="white" sx={{ fontSize: '1.2rem' }}>
                                {book.volumeInfo.title}
                            </Typography>
                            <Typography variant="body2" color="white">By: {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : "Anon"}</Typography>
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
};

export default BooksList;
