import React, { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";

export default function BorrowFormModal({ show, onClose, onSubmit }) {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    if (!show) return;

    apiRequest("/users")
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => {});

    apiRequest("/books")
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => {});
  }, [show]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!userId || !bookId) {
      alert("Оберіть користувача і книгу");
      return;
    }

    onSubmit({ user_id: userId, book_id: bookId });
  }

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Оформити видачу</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Користувач</label>
                <select className="form-select" value={userId} onChange={(e) => setUserId(e.target.value)} required>
                  <option value="">Оберіть користувача</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.full_name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Книга</label>
                <select className="form-select" value={bookId} onChange={(e) => setBookId(e.target.value)} required>
                  <option value="">Оберіть книгу</option>
                  {books
                    .filter((b) => b.copies_available > 0)
                    .map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title} ({b.copies_available} шт.)
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Оформити</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Скасувати</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

