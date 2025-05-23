import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { apiRequest } from "../../api/api";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("booking_date");

  const fetchBookings = async () => {
    setLoading(false);
    try {
      const res = await apiRequest("/bookings/all");
      const data = await res.json();
      if (!Array.isArray(data)) {
        setBookings([]);
      } else {
        setBookings(data);
      }
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  let filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.book_id?.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.user_id?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user_id?.email?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && b.active) ||
      (statusFilter === "inactive" && !b.active);

    return matchSearch && matchStatus;
  });

  // 🔃 Сортування
  if (sort === "booking_date") {
    filtered.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
  } else if (sort === "expires_at") {
    filtered.sort((a, b) => new Date(a.expires_at) - new Date(b.expires_at));
  }

  const handleCancel = async (bookingId) => {
  if (!window.confirm("Скасувати це бронювання?")) return;

  try {
    await apiRequest(`/bookings/${bookingId}`, { method: "DELETE" });
    fetchBookings();
  } catch (err) {
    console.error("Помилка при скасуванні бронювання:", err);
  }
};


  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Бронювання книг</h3>

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
            <option value="inactive">Неактивні</option>
          </select>

          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="booking_date">За датою бронювання</option>
            <option value="expires_at">За терміном закінчення</option>
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
                <th>Дата бронювання</th>
                <th>Дійсне до</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td>{b.user_id?.full_name}</td>
                  <td>{b.user_id?.email}</td>
                  <td>{b.book_id?.title}</td>
                  <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                  <td>{new Date(b.expires_at).toLocaleDateString()}</td>
                  <td>{b.active ? "Активне" : "Неактивне"}</td>
                  <td>
                    {b.active && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancel(b._id)}
                      >
                        Скасувати
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

