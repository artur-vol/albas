import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import GenreFormModal from "../../components/GenreFormModal/GenreFormModal";
import { apiRequest } from "../../api/api";

export default function AdminGenresPage() {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  function fetchGenres() {
    setLoading(false);
    apiRequest("/genres")
      .then((r) => r.json())
      .then(setGenres)
      .finally(() => setLoading(false));
  }

  useEffect(fetchGenres, []);

  function handleOpenAdd() {
    setSelectedGenre(null);
    setShowModal(true);
  }

  function handleOpenEdit(genre) {
    setSelectedGenre(genre);
    setShowModal(true);
  }

  async function handleSubmitGenre(data) {
    const method = selectedGenre ? "PATCH" : "POST";
    const url = selectedGenre ? `/genres/${selectedGenre._id}` : "/genres";

    await apiRequest(url, {
      method,
      body: JSON.stringify(data),
    });

    setShowModal(false);
    fetchGenres();
  }

  async function handleDelete(id) {
    if (window.confirm("Видалити жанр?")) {
      await apiRequest(`/genres/${id}`, { method: "DELETE" });
      fetchGenres();
    }
  }

  const filtered = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Жанри</h3>

        <div className="mb-3">
          <button className="btn btn-success" onClick={handleOpenAdd}>
            Додати жанр
          </button>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Пошук за назвою"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
        </div>

        {loading ? (
          <div>Завантаження…</div>
        ) : (
          <table className="table table-bordered bg-white">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((genre) => (
                <tr key={genre._id}>
                  <td>{genre.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleOpenEdit(genre)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(genre._id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <GenreFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitGenre}
          genre={selectedGenre}
        />
      </div>
    </div>
  );
}

