import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import BooksList from './BooksList';
import { Box, Button, TextField, CircularProgress } from '@mui/material';

const SearchBook = () => {
    const [books, setBooks] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useState({});
    const navigate = useNavigate();

    const debouncedGetBooks = debounce(() => {
        getBooks();
    }, 500);

    useEffect(() => {
        if (input) {
            if (cache[input]) {
                setBooks(cache[input]);
            } else {
                debouncedGetBooks();
            }
        }
    }, [input, debouncedGetBooks, cache]);

    const getBooks = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/books?q=${input}`);
        const data = await res.json();
        setLoading(false);
        if (data) {
            setBooks(data);
            setCache(prevCache => ({ ...prevCache, [input]: data }));
        }
    };

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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search..."
                    autoFocus
                    sx={{ maxWidth: 600 }}
                    InputProps={{
                        sx: {
                            color: 'white',
                            borderRadius: '20px'
                        },
                    }}
                />
            </Box>
            <Button variant="contained" onClick={goToUserPage}>
                Go to My Page
            </Button>
            {loading ? (
                <Box sx={{ mt: 2 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <BooksList books={books} />
            )}
        </Box>
    );
};

export default SearchBook;
