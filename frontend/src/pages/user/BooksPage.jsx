import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import BookFilters from '../../components/BookFilters/BookFilters';
import BookCard from '../../components/BookCard/BookCard';
import { apiRequest } from '../../api/api';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [sort, setSort] = useState('alphabet');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/genres').then(r => r.json()).then(setGenres).catch(() => {});
    apiRequest('/authors').then(r => r.json()).then(setAuthors).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(false);
    apiRequest('/books')
      .then(r => r.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  let filtered = books.filter(b =>
    (!search || [b.title, b.isbn, b.author_id?.name].join(' ').toLowerCase().includes(search.toLowerCase())) &&
    (!genre || b.genre_id?._id === genre) &&
    (!author || b.author_id?._id === author)
  );

  if (sort === 'available') filtered = filtered.sort((a, b) => b.copies_available - a.copies_available);
  else if (sort === 'alphabet') filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'author') filtered = filtered.sort((a, b) => a.author_id?.name?.localeCompare(b.author_id?.name));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Всі книги</h3>
        <BookFilters
          search={search}
          setSearch={setSearch}
          genre={genre}
          setGenre={setGenre}
          author={author}
          setAuthor={setAuthor}
          genres={genres}
          authors={authors}
          sort={sort}
          setSort={setSort}
        />
        {loading ? (
          <div>Завантаження…</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {filtered.slice(0, 16).map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

