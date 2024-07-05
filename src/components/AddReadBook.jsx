import { useState } from 'react';

const AddReadBook = ({ userId, bookId }) => {
  const [rating, setRating] = useState('');
  const [dateStarted, setDateStarted] = useState('');
  const [dateFinished, setDateFinished] = useState('');
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');

  const handleAddBook = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/read_books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id: bookId, rating, date_started: dateStarted, date_finished: dateFinished, review }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Book added to read list');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Rating (1-10)"
        min="1"
        max="10"
        step="0.1"
      />
      <input
        type="date"
        value={dateStarted}
        onChange={(e) => setDateStarted(e.target.value)}
        placeholder="Start Date"
      />
      <input
        type="date"
        value={dateFinished}
        onChange={(e) => setDateFinished(e.target.value)}
        placeholder="Finish Date"
      />
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write a review"
      />
      <button onClick={handleAddBook}>Add to Read Books</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddReadBook;
