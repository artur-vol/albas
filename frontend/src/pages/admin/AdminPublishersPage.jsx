import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import PublisherFormModal from "../../components/PublisherFormModal/PublisherFormModal";
import { apiRequest } from "../../api/api";

export default function AdminPublishersPage() {
  const [publishers, setPublishers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [sort, setSort] = useState("name");
  const [cityFilter, setCityFilter] = useState("");

  function fetchPublishers() {
    setLoading(false);
    apiRequest("/publishers")
      .then((r) => r.json())
      .then(setPublishers)
      .finally(() => setLoading(false));
  }

  useEffect(fetchPublishers, []);

  function handleOpenAdd() {
    setSelectedPublisher(null);
    setShowModal(true);
  }

  function handleOpenEdit(publisher) {
    setSelectedPublisher(publisher);
    setShowModal(true);
  }

  async function handleSubmitPublisher(data) {
    const method = selectedPublisher ? "PATCH" : "POST";
    const url = selectedPublisher ? `/publishers/${selectedPublisher._id}` : "/publishers";

    await apiRequest(url, {
      method,
      body: JSON.stringify(data),
    });

    setShowModal(false);
    fetchPublishers();
  }

  async function handleDelete(id) {
    if (window.confirm("Видалити видавництво?")) {
      await apiRequest(`/publishers/${id}`, { method: "DELETE" });
      fetchPublishers();
    }
  }

  const uniqueCities = Array.from(new Set(publishers.map(p => p.city).filter(Boolean)));

  let filtered = publishers.filter((p) =>
    (!search || `${p.name} ${p.city}`.toLowerCase().includes(search.toLowerCase())) &&
    (!cityFilter || p.city === cityFilter)
  );

  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "city") {
    filtered.sort((a, b) => (a.city || "").localeCompare(b.city || ""));
  } else if (sort === "year") {
    filtered.sort((a, b) => (a.founded_year || 0) - (b.founded_year || 0));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Видавництва</h3>

        <div className="mb-3">
          <button className="btn btn-success" onClick={handleOpenAdd}>
            Додати видавництво
          </button>
        </div>

        {/* Панель фільтрів */}
        <div className="d-flex align-items-center mb-3" style={{ gap: 16, flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Пошук за назвою або містом"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />

          <select
            className="form-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="">Усі міста</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="name">За назвою</option>
            <option value="city">За містом</option>
            <option value="year">За роком заснування</option>
          </select>
        </div>

        {loading ? (
          <div>Завантаження…</div>
        ) : (
          <table className="table table-bordered bg-white">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Місто</th>
                <th>Рік</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((publisher) => (
                <tr key={publisher._id}>
                  <td>{publisher.name}</td>
                  <td>{publisher.city || "—"}</td>
                  <td>{publisher.founded_year || "—"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleOpenEdit(publisher)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(publisher._id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <PublisherFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitPublisher}
          publisher={selectedPublisher}
        />
      </div>
    </div>
  );
}

