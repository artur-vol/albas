import React, { useEffect, useState } from "react";

export default function AuthorFormModal({ show, onClose, onSubmit, author }) {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [biography, setBiography] = useState("");

  useEffect(() => {
    if (author) {
      setName(author.name || "");
      setBirthYear(author.birth_year || "");
      setDeathYear(author.death_year || "");
      setBiography(author.biography || "");
    } else {
      setName("");
      setBirthYear("");
      setDeathYear("");
      setBiography("");
    }
  }, [author]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return alert("Ім'я не може бути порожнім");

    const data = {
      name: name.trim(),
      birth_year: birthYear ? Number(birthYear) : undefined,
      death_year: deathYear ? Number(deathYear) : undefined,
      biography: biography.trim(),
    };

    onSubmit(data);
  }

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{author ? "Редагувати автора" : "Додати автора"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Ім’я автора</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Рік народження</label>
                  <input
                    type="number"
                    className="form-control"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                  />
                </div>
                <div className="col mb-3">
                  <label className="form-label">Рік смерті</label>
                  <input
                    type="number"
                    className="form-control"
                    value={deathYear}
                    onChange={(e) => setDeathYear(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Біографія</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
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

