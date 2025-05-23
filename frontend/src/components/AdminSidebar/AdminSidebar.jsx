import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem('token');
    window.location = '/login';
  }

  const navStyle = path =>
    ({ color: location.pathname.startsWith(path) ? "#ffd700" : "#fff" });

  return (
    <div style={{
      width: 220,
      minHeight: '100vh',
      background: '#23272f',
      color: '#fff',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <h4>Адмін-панель</h4>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/admin/users" style={navStyle("/admin/users")}>Користувачі</Link>
        <Link to="/admin/books" style={navStyle("/admin/books")}>Книги</Link>
        <Link to="/admin/authors" style={navStyle("/admin/authors")}>Автори</Link>
        <Link to="/admin/genres" style={navStyle("/admin/genres")}>Жанри</Link>
        <Link to="/admin/publishers" style={navStyle("/admin/publishers")}>Видавництва</Link>
        <Link to="/admin/borrowings" style={navStyle("/admin/borrowings")}>Видачі</Link>
        <Link to="/admin/bookings" style={navStyle("/admin/bookings")}>Бронювання</Link>
        <Link to="/admin/fines" style={navStyle("/admin/fines")}>Штрафи</Link>
      </nav>
      <div style={{ marginTop: "auto", fontSize: "0.95em", opacity: 0.7, display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 12,
            background: "#2c313c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 0",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 500
          }}
        >
          Вийти
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;

