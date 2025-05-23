import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import BookCard from '../../components/BookCard/BookCard';
import { apiRequest } from '../../api/api';

const PAGE_SIZE = 8;

export default function MyBooksPage() {
  const [borrowingsActive, setBorrowingsActive] = useState([]);
  const [borrowingsReturned, setBorrowingsReturned] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeShown, setActiveShown] = useState(PAGE_SIZE);
  const [returnedShown, setReturnedShown] = useState(PAGE_SIZE);
  const [bookingsShown, setBookingsShown] = useState(PAGE_SIZE);

  useEffect(() => {
    setLoading(false);
    apiRequest('/my-books')
      .then(r => r.json())
      .then(data => {
        console.log(data);
        setBorrowingsActive(data.borrowings_active || []);
        setBorrowingsReturned(data.borrowings_returned || []);
        setBookings(data.bookings || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Завантаження…</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="my-books" />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Мої книги</h3>

        {/* Видані книги */}
        <div>
          <h5>Видані книги</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {borrowingsActive.length === 0 && <div className="text-muted">Немає виданих книг</div>}
            {borrowingsActive.slice(0, activeShown).map(item => (
              <div key={item._id} style={{ position: "relative" }}>
                <BookCard book={item.book_id} />
                <div style={{
                  position: "absolute", top: 8, left: 8, background: "#fff8", padding: "2px 8px",
                  borderRadius: 8, fontSize: 13
                }}>
                  {new Date(item.due_date) < new Date() ? "Прострочена" : "Видана"}
                </div>
              </div>
            ))}
          </div>
          {borrowingsActive.length > activeShown && (
            <div className="mt-3 text-center">
              <button className="btn btn-outline-primary"
                      onClick={() => setActiveShown(s => s + PAGE_SIZE)}>
                Показати ще
              </button>
            </div>
          )}
        </div>

        {/* Повернуті книги */}
        <div className="mt-5">
          <h5>Повернуті книги</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {borrowingsReturned.length === 0 && <div className="text-muted">Немає повернутих книг</div>}
            {borrowingsReturned.slice(0, returnedShown).map(item => (
              <div key={item._id} style={{ position: "relative" }}>
                <BookCard book={item.book_id} />
                <div style={{
                  position: "absolute", top: 8, left: 8, background: "#fff8", padding: "2px 8px",
                  borderRadius: 8, fontSize: 13
                }}>
                  Повернена {item.return_date && (new Date(item.return_date).toLocaleDateString())}
                </div>
              </div>
            ))}
          </div>
          {borrowingsReturned.length > returnedShown && (
            <div className="mt-3 text-center">
              <button className="btn btn-outline-primary"
                      onClick={() => setReturnedShown(s => s + PAGE_SIZE)}>
                Показати ще
              </button>
            </div>
          )}
        </div>

        {/* Активні бронювання */}
        <div className="mt-5">
          <h5>Мої бронювання</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {bookings.length === 0 && <div className="text-muted">Немає бронювань</div>}
            {bookings.slice(0, bookingsShown).map(item => (
              <div key={item._id} style={{ position: "relative" }}>
                <BookCard book={item.book_id} />
                <div style={{
                  position: "absolute", top: 8, left: 8, background: "#fff8", padding: "2px 8px",
                  borderRadius: 8, fontSize: 13
                }}>
                  Бронь до {new Date(item.expires_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          {bookings.length > bookingsShown && (
            <div className="mt-3 text-center">
              <button className="btn btn-outline-primary"
                      onClick={() => setBookingsShown(s => s + PAGE_SIZE)}>
                Показати ще
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

