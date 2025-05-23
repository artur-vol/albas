import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AuthorFormModal from "../../components/AuthorFormModal/AuthorFormModal";
import { apiRequest } from "../../api/api";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [sort, setSort] = useState("name");
  const [filterAlive, setFilterAlive] = useState("");

  function fetchAuthors() {
    setLoading(false);
    apiRequest("/authors")
      .then((r) => r.json())
      .then(setAuthors)
      .finally(() => setLoading(false));
  }

  useEffect(fetchAuthors, []);

  function handleOpenAdd() {
    setSelectedAuthor(null);
    setShowModal(true);
  }

  function handleOpenEdit(author) {
    setSelectedAuthor(author);
    setShowModal(true);
  }

  async function handleSubmitAuthor(data) {
    const method = selectedAuthor ? "PATCH" : "POST";
    const url = selectedAuthor ? `/authors/${selectedAuthor._id}` : "/authors";

    await apiRequest(url, {
      method,
      body: JSON.stringify(data),
    });

    setShowModal(false);
    fetchAuthors();
  }

  async function handleDelete(id) {
    if (window.confirm("Видалити автора?")) {
      await apiRequest(`/authors/${id}`, { method: "DELETE" });
      fetchAuthors();
    }
  }

  let filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterAlive === ""
      || (filterAlive === "alive" && !a.death_year)
      || (filterAlive === "dead" && a.death_year))
  );

  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "birth_year") {
    filtered.sort((a, b) => (a.birth_year || 0) - (b.birth_year || 0));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Автори</h3>

        <div className="mb-3">
          <button className="btn btn-success" onClick={handleOpenAdd}>
            Додати автора
          </button>
        </div>

        {/* Фільтри */}
        <div className="d-flex align-items-center mb-3" style={{ gap: 16, flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Пошук за іменем"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />

          <select
            className="form-select"
            value={filterAlive}
            onChange={(e) => setFilterAlive(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="">Усі</option>
            <option value="alive">Живі</option>
            <option value="dead">Померлі</option>
          </select>

          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="name">За іменем</option>
            <option value="birth_year">За роком народження</option>
          </select>
        </div>

        {loading ? (
          <div>Завантаження…</div>
        ) : (
          <table className="table table-bordered bg-white">
            <thead>
              <tr>
                <th>Ім’я</th>
                <th>Народж.</th>
                <th>Смерть</th>
                <th>Біографія</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((author) => (
                <tr key={author._id}>
                  <td>{author.name}</td>
                  <td>{author.birth_year || "—"}</td>
                  <td>{author.death_year || "—"}</td>
                  <td style={{ maxWidth: 300 }}>{author.biography}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleOpenEdit(author)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(author._id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <AuthorFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitAuthor}
          author={selectedAuthor}
        />
      </div>
    </div>
  );
}

