import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddBookToPlan from './AddBookToPlan';
import AddReadBook from './AddReadBook';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            const res = await fetch(`http://localhost:3000/api/books/${id}`);
            const data = await res.json();
            setBook(data);
        };

        fetchBook();
    }, [id]);

    if (!book) {
        return <div>Loading...</div>;
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
        <div>
            <h2>{volumeInfo.title}</h2>
            <img src={volumeInfo.imageLinks?.thumbnail} alt={volumeInfo.title} />
            <p>{volumeInfo.description}</p>
            <p>Authors: {volumeInfo.authors.join(', ')}</p>
            <p>Published Date: {volumeInfo.publishedDate}</p>
            <p>Publisher: {volumeInfo.publisher}</p>
            <p>Page Count: {volumeInfo.pageCount}</p>
            <AddBookToPlan userId={userId} bookId={id} />
            <AddReadBook userId={userId} bookId={id} />
            <button onClick={goToUserPage}>Go to My Page</button>
        </div>
    );
};

export default BookDetail;
