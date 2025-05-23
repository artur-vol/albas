import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { apiRequest } from "../../api/api";

export default function AdminFinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("amount");

  function fetchFines() {
    setLoading(false);
apiRequest("/fines/all")
  .then(async (r) => {
    if (!r.ok) throw new Error("HTTP error " + r.status);
    const data = await r.json();
    if (!Array.isArray(data)) throw new Error("Expected array, got: " + JSON.stringify(data));
    setFines(data);
  })
  .catch(err => {
    console.error("Помилка завантаження штрафів:", err);
    setFines([]);
  })
  .finally(() => setLoading(false));

  }

  useEffect(fetchFines, []);

  async function handleMarkPaid(fineId) {
    const confirmed = window.confirm("Позначити цей штраф як сплачений?");
    if (!confirmed) return;

    await apiRequest(`/fines/${fineId}`, { method: "PATCH" });
    fetchFines();
  }

  let filtered = fines.filter((f) => {
    const matchesSearch =
      !search ||
      f.user_id?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      f.user_id?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && f.paid) ||
      (statusFilter === "unpaid" && !f.paid);

    return matchesSearch && matchesStatus;
  });

  // 🔃 Сортування
  if (sort === "amount") {
    filtered.sort((a, b) => b.amount - a.amount);
  } else if (sort === "recent") {
    filtered.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Штрафи користувачів</h3>

        {/* Панель фільтрів */}
        <div className="d-flex align-items-center mb-3" style={{ gap: 16, flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Пошук за користувачем або email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="all">Усі</option>
            <option value="unpaid">Несплачені</option>
            <option value="paid">Сплачені</option>
          </select>

          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="amount">За сумою</option>
            <option value="recent">За датою</option>
          </select>
        </div>

        {loading ? (
          <div>Завантаження…</div>
        ) : (
          <table className="table table-bordered bg-white">
            <thead>
              <tr>
                <th>Користувач</th>
                <th>Email</th>
                <th>Причина</th>
                <th>Сума</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f._id}>
                  <td>{f.user_id?.full_name}</td>
                  <td>{f.user_id?.email}</td>
                  <td>{f.reason}</td>
                  <td>{f.amount} грн</td>
                  <td>{f.paid ? "Сплачено" : "Несплачено"}</td>
                  <td>
                    {!f.paid && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleMarkPaid(f._id)}
                      >
                        Позначити як сплачений
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

