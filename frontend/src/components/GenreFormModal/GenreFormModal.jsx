import React, { useEffect, useState } from "react";

export default function GenreFormModal({ show, onClose, onSubmit, genre }) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(genre?.name || "");
  }, [genre]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Назва не може бути порожньою");
    onSubmit({ name: name.trim() });
  }

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{genre ? "Редагувати жанр" : "Додати жанр"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Назва жанру</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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

