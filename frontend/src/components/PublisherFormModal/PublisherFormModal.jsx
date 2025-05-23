import React, { useEffect, useState } from "react";

export default function PublisherFormModal({ show, onClose, onSubmit, publisher }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [foundedYear, setFoundedYear] = useState("");

  useEffect(() => {
    if (publisher) {
      setName(publisher.name || "");
      setCity(publisher.city || "");
      setFoundedYear(publisher.founded_year || "");
    } else {
      setName("");
      setCity("");
      setFoundedYear("");
    }
  }, [publisher]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Назва не може бути порожньою");

    onSubmit({
      name: name.trim(),
      city: city.trim(),
      founded_year: foundedYear ? Number(foundedYear) : undefined,
    });
  }

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{publisher ? "Редагувати видавництво" : "Додати видавництво"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Назва</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Місто</label>
                <input
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Рік заснування</label>
                <input
                  type="number"
                  className="form-control"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
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

