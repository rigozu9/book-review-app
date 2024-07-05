import { useState } from 'react';

const AddBookToPlan = ({ userId, bookId }) => {
  const [message, setMessage] = useState('');

  const handleAddBook = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/plan_to_read_books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Book added to plan to read list');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <button onClick={handleAddBook}>Add to Plan to Read</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddBookToPlan;
