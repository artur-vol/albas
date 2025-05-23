import React from 'react';
import { useNavigate } from 'react-router-dom';

function getRandomColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const color = '#' + (
    ((hash & 0xffffff) | 0x444444)
  ).toString(16).padStart(6, '0');
  return color;
}

function BookCard({ book }) {
  const author = book.author_id?.name || 'Автор невідомий';
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/books/${book._id}`);
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: 180,
        height: 260,
        borderRadius: 20,
        background: getRandomColor(book.title),
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        padding: 18,
        cursor: "pointer",
        transition: "transform .15s",
        fontWeight: 500,
        textAlign: "center"
      }}
    >
      <div style={{
        width: '100%',
        marginTop: 10,
        fontSize: 19,
        fontWeight: 600,
        lineHeight: 1.15,
        wordBreak: "break-word",
        flexGrow: 1,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center"
      }}>
        {book.title}
      </div>
      <div style={{
        width: '100%',
        fontSize: 15,
        fontWeight: 400,
        marginBottom: 8,
        opacity: 0.94,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        minHeight: 28
      }}>
        {author}
      </div>
    </div>
  );
}

export default BookCard;

