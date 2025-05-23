import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem('token');
    window.location = '/login';
  }

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
      <h4>Моя бібліотека</h4>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/books" style={{ color: location.pathname === "/books" ? "#ffd700" : "#fff" }}>Всі книги</Link>
        <Link to="/my-books" style={{ color: location.pathname === "/my-books" ? "#ffd700" : "#fff" }}>Мої книги</Link>
        <Link to="/my-fines" style={{ color: location.pathname === "/my-fines" ? "#ffd700" : "#fff" }}>Мої штрафи</Link>
        <Link to="/profile" style={{ color: location.pathname === "/profile" ? "#ffd700" : "#fff" }}>Профіль</Link>
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

export default Sidebar;

