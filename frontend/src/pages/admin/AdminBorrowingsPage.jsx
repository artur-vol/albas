import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import BorrowFormModal from "../../components/BorrowFormModal/BorrowFormModal";
import { apiRequest } from "../../api/api";

export default function AdminBorrowingsPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("borrow_date");
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  function fetchBorrowings() {
    setLoading(false);
    apiRequest("/borrow/all")
      .then((r) => r.json())
      .then(setBorrowings)
      .finally(() => setLoading(false));
  }

  useEffect(fetchBorrowings, []);

  async function handleReturn(borrowing) {
    const confirmed = window.confirm("Підтвердити повернення книги?");
    if (!confirmed) return;

    await apiRequest("/borrow/admin-return", {
      method: "POST",
      body: JSON.stringify({
        book_id: borrowing.book_id._id,
        user_id: borrowing.user_id._id,
      }),
    });

    fetchBorrowings();
  }

  async function handleCreateBorrowing({ user_id, book_id }) {
    await apiRequest("/borrow/admin", {
      method: "POST",
      body: JSON.stringify({ user_id, book_id }),
    });

    setShowBorrowModal(false);
    fetchBorrowings();
  }

  // 🔍 Пошук + фільтр
  let filtered = borrowings.filter(b => {
    const matchesSearch =
      !search ||
      b.book_id?.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.user_id?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user_id?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !b.return_date) ||
      (statusFilter === "returned" && b.return_date);

    return matchesSearch && matchesStatus;
  });

  // 🔃 Сортування
  if (sort === "borrow_date") {
    filtered.sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));
  } else if (sort === "due_date") {
    filtered.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Видачі книг</h3>

        <div className="mb-3">
          <button className="btn btn-success" onClick={() => setShowBorrowModal(true)}>
            Оформити видачу
          </button>
        </div>

        {/* Панель фільтрів */}
        <div className="d-flex align-items-center mb-3" style={{ gap: 16, flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Пошук за користувачем або книгою"
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
            <option value="active">Активні</option>
            <option value="returned">Повернені</option>
          </select>

          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="borrow_date">За датою видачі</option>
            <option value="due_date">За терміном повернення</option>
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
                <th>Книга</th>
                <th>Дата видачі</th>
                <th>Термін до</th>
                <th>Повернено</th>
                <th>Штраф</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td>{b.user_id?.full_name}</td>
                  <td>{b.user_id?.email}</td>
                  <td>{b.book_id?.title}</td>
                  <td>{new Date(b.borrow_date).toLocaleDateString()}</td>
                  <td>{new Date(b.due_date).toLocaleDateString()}</td>
                  <td>{b.return_date ? new Date(b.return_date).toLocaleDateString() : "—"}</td>
                  <td>{b.fine ? `${b.fine} грн` : "—"}</td>
                  <td>
                    {!b.return_date && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleReturn(b)}>
                        Повернути
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Модальне вікно оформлення видачі */}
        <BorrowFormModal
          show={showBorrowModal}
          onClose={() => setShowBorrowModal(false)}
          onSubmit={handleCreateBorrowing}
        />
      </div>
    </div>
  );
}

