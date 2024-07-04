import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

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

    return (
        <div>
            <h2>{volumeInfo.title}</h2>
            <img src={volumeInfo.imageLinks?.thumbnail} alt={volumeInfo.title} />
            <p>{volumeInfo.description}</p>
            <p>Authors: {volumeInfo.authors.join(', ')}</p>
            <p>Published Date: {volumeInfo.publishedDate}</p>
            <p>Publisher: {volumeInfo.publisher}</p>
            <p>Page Count: {volumeInfo.pageCount}</p>
        </div>
    );
};

export default BookDetail;
