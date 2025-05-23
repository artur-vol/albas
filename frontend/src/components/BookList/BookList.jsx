import { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/books`)
      .then(res => setBooks(res.data))
      .catch(err => console.error('Error fetching books:', err));
  }, []);

  return (
    <div>
      <h2>Список книг</h2>
      <ul>
        {books.map(book => (
          <li key={book._id}>
            <strong>{book.title}</strong> — {book.author_id?.name || 'Невідомий автор'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
