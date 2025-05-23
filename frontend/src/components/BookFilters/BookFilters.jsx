import React from 'react';

function BookFilters({ search, setSearch, genre, setGenre, author, setAuthor, genres, authors, sort, setSort }) {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      marginBottom: '2rem'
    }}>
      <input
        type="text"
        placeholder="Пошук за назвою, автором або ISBN"
        className="form-control"
        style={{ maxWidth: 240 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select className="form-select" style={{ maxWidth: 160 }} value={genre} onChange={e => setGenre(e.target.value)}>
        <option value="">Жанр</option>
        {genres.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
      </select>
      <select className="form-select" style={{ maxWidth: 160 }} value={author} onChange={e => setAuthor(e.target.value)}>
        <option value="">Автор</option>
        {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
      </select>
      <select className="form-select" style={{ maxWidth: 180 }} value={sort} onChange={e => setSort(e.target.value)}>
        <option value="alphabet">За назвою</option>
        <option value="available">Спочатку доступні</option>
        <option value="author">За автором</option>
      </select>
    </div>
  );
}

export default BookFilters;

