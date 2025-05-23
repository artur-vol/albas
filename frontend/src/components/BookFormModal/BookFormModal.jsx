import React, { useEffect, useState } from "react";

export default function BookFormModal({ show, onClose, onSubmit, book, genres, authors }) {
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [copies, setCopies] = useState(1);
  const [genreId, setGenreId] = useState("");
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setIsbn(book.isbn || "");
      setCopies(book.copies_available || 1);
      setGenreId(book.genre_id?._id || "");
      setAuthorId(book.author_id?._id || "");
    } else {
      setTitle("");
      setIsbn("");
      setCopies(1);
      setGenreId("");
      setAuthorId("");
    }
  }, [book]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title,
      isbn,
      copies_available: Number(copies),
      genre_id: genreId,
      author_id: authorId,
    });
  }

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{book ? "Редагувати книгу" : "Додати книгу"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Назва</label>
                <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">ISBN</label>
                <input type="text" className="form-control" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Кількість копій</label>
                <input type="number" className="form-control" value={copies} onChange={(e) => setCopies(e.target.value)} min="1" />
              </div>
              <div className="mb-3">
                <label className="form-label">Жанр</label>
                <select className="form-select" value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
                  <option value="">Оберіть жанр</option>
                  {genres.map((g) => (
                    <option key={g._id} value={g._id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Автор</label>
                <select className="form-select" value={authorId} onChange={(e) => setAuthorId(e.target.value)} required>
                  <option value="">Оберіть автора</option>
                  {authors.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Зберегти</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Скасувати</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

