import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
        const response = await fetch(`http://localhost:3000/api/users/userpage/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store the JWT token in localStorage
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setUser(data);

        const readBooksIds = JSON.parse(data.read_books);
        const planToReadBooksIds = JSON.parse(data.plan_to_read_books);

        const fetchBookDetails = async (bookIds) => {
          const bookDetails = await Promise.all(bookIds.map(async (bookId) => {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
            return res.json();
          }));
          return bookDetails;
        };

        setReadBooks(await fetchBookDetails(readBooksIds));
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
