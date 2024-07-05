import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BooksList from './BooksList';

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [readBooks, setReadBooks] = useState([]);
  const [planToReadBooks, setPlanToReadBooks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        // Fetch user data
        const response = await fetch(`http://localhost:3000/api/users/userpage/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        setUser(data);

        // Fetch read books
        const readBooksResponse = await fetch(`http://localhost:3000/api/users/${id}/read_books`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!readBooksResponse.ok) throw new Error(`Error: ${readBooksResponse.statusText}`);

        const readBooksData = await readBooksResponse.json();
        const readBookIds = readBooksData.map(book => book.book_id);

        // Fetch plan to read books
        const planToReadBooksIds = JSON.parse(data.plan_to_read_books);

        // Fetch book details
        const fetchBookDetails = async (bookIds) => {
          const bookDetails = await Promise.all(bookIds.map(async (bookId) => {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
            return res.json();
          }));
          return bookDetails;
        };

        setReadBooks(await fetchBookDetails(readBookIds));
        setPlanToReadBooks(await fetchBookDetails(planToReadBooksIds));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const goToSearchPage = () => {
    navigate(`/search`);
  };

  return (
    <div>
      <h1>{user.username}s Page</h1>
      <button onClick={goToSearchPage}>Go to search</button>
      <h2>Read</h2>
      <BooksList books={readBooks} />
      <h2>Plan to read</h2>
      <BooksList books={planToReadBooks} />
    </div>
  );
};

export default UserPage;
