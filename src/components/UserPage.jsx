import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div>
      <h1>{user.username}s Page</h1>
      <h2>Read Books</h2>
      <ul>
        {user.read_books && JSON.parse(user.read_books).map((book, index) => (
          <li key={index}>{book}</li>
        ))}
      </ul>
      <h2>Plan to Read Books</h2>
      <ul>
        {user.plan_to_read_books && JSON.parse(user.plan_to_read_books).map((book, index) => (
          <li key={index}>{book}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;
