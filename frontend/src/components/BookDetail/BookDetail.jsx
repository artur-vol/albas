import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/api';

function getRandomColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const color = '#' + (
    ((hash & 0xffffff) | 0x444444)
  ).toString(16).padStart(6, '0');
  return color;
}

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    apiRequest(`/books/${id}`)
      .then(r => r.json())
      .then(setBook);
  }, [id]);

  async function handleBooking() {
    setLoadingBooking(true);
    setBookingStatus('');
    try {
      const res = await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({ book_id: book._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingStatus(data.message || 'Не вдалося забронювати');
      } else {
        setBookingStatus('Бронювання створено!');
      }
    } catch {
      setBookingStatus('Помилка мережі');
    }
    setLoadingBooking(false);
  }

  if (!book) return <div>Завантаження...</div>;

  return (
    <div className="container py-5 d-flex gap-4">
      {/* Обкладинка */}
      <div style={{
        width: 210,
        height: 300,
        borderRadius: 22,
        background: getRandomColor(book.title),
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 6px 18px rgba(0,0,0,0.14)",
        fontWeight: 500,
        padding: 24,
        marginRight: 32
      }}>
        <div style={{
          width: '100%',
          fontSize: 22,
          fontWeight: 700,
          marginTop: 10,
          textAlign: "center"
        }}>{book.title}</div>
        <div style={{
          width: '100%',
          fontSize: 17,
          marginBottom: 10,
          textAlign: "center",
          opacity: 0.9
        }}>{book.author_id?.name || 'Автор невідомий'}</div>
      </div>

      {/* Дані про книгу */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>Назад</button>
        <h2 style={{ marginTop: 0 }}>{book.title}</h2>
        <div style={{ fontSize: 17, color: "#666" }}>{book.author_id?.name || 'Автор невідомий'}</div>
        <hr />
        <div><strong>Жанр:</strong> {book.genre_id?.name || '-'}</div>
        <div><strong>Видавець:</strong> {book.publisher_id?.name || '-'}</div>
        <div><strong>Рік:</strong> {book.year}</div>
        <div><strong>ISBN:</strong> {book.isbn}</div>
        <div><strong>Опис:</strong> {book.description || '—'}</div>
        <div className="mt-3">
          <span className={"badge " + (book.copies_available > 0 ? "bg-success" : "bg-danger")}>
            {book.copies_available > 0 ? "Доступна" : "Немає в наявності"}
          </span>
        </div>
        {/* Кнопка бронювання */}
        <div className="mt-4">
          <button
            className="btn btn-primary"
            onClick={handleBooking}
            disabled={loadingBooking}
          >
            {loadingBooking ? 'Бронюємо...' : 'Забронювати'}
          </button>
          {bookingStatus && (
            <div className="mt-2 alert alert-info">{bookingStatus}</div>
          )}
        </div>
      </div>
    </div>
  );
}

