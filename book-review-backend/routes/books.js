/* eslint-disable no-undef */
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Route to search for books
router.get('/books', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`);
        res.json(response.data.items);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Route to get a single book by ID
router.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    if (!bookId) {
        return res.status(400).json({ error: 'Book ID is required' });
    }

    try {
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        console.log(`Using API key: ${apiKey}`);

        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

export default router;
