import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { apiRequest } from "../../api/api";
import BookFormModal from "../../components/BookFormModal/BookFormModal";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sort, setSort] = useState("alphabet");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  function fetchData() {
    setLoading(false);
    Promise.all([
      apiRequest("/books").then((r) => r.json()),
      apiRequest("/genres").then((r) => r.json()),
      apiRequest("/authors").then((r) => r.json()),
    ])
      .then(([booksData, genresData, authorsData]) => {
        setBooks(booksData);
        setGenres(genresData);
        setAuthors(authorsData);
      })
      .finally(() => setLoading(false));
  }

  useEffect(fetchData, []);

  function handleOpenAdd() {
    setSelectedBook(null);
    setShowModal(true);
  }

  function handleOpenEdit(book) {
    setSelectedBook(book);
    setShowModal(true);
  }

  async function handleSubmitBook(data) {
    const method = selectedBook ? "PATCH" : "POST";
    const url = selectedBook ? `/books/${selectedBook._id}` : "/books";

    await apiRequest(url, {
      method,
      body: JSON.stringify(data),
    });

    setShowModal(false);
    fetchData();
  }

  async function handleDelete(id) {
    if (window.confirm("Видалити книгу повністю?")) {
      await apiRequest(`/books/${id}`, { method: "DELETE" });
      fetchData();
    }
  }

  async function handleUpdateCopies(id, current) {
    const input = prompt("Введіть нову кількість копій:", current);
    if (!input) return;

    const parsed = parseInt(input);
    if (isNaN(parsed) || parsed < 0) {
      alert("Невірна кількість");
      return;
    }

    await apiRequest(`/books/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ copies_available: parsed }),
    });

    fetchData();
  }

  let filtered = books.filter((b) =>
    (!search || [b.title, b.isbn, b.author_id?.name].join(" ").toLowerCase().includes(search.toLowerCase())) &&
    (!genreFilter || b.genre_id?._id === genreFilter) &&
    (!authorFilter || b.author_id?._id === authorFilter)
  );

  if (sort === "alphabet") filtered.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "available") filtered.sort((a, b) => b.copies_available - a.copies_available);
  else if (sort === "author") filtered.sort((a, b) => a.author_id?.name.localeCompare(b.author_id?.name));

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Книги</h3>

        <div className="mb-3">
          <button className="btn btn-success" onClick={handleOpenAdd}>Додати книгу</button>
        </div>

        <div className="d-flex align-items-center mb-3" style={{ gap: 16, flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Пошук за назвою, ISBN, автором"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <select
            className="form-select"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">Усі жанри</option>
            {genres.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">Усі автори</option>
            {authors.map((a) => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="alphabet">А-Я</option>
            <option value="available">Наявні копії</option>
            <option value="author">За автором</option>
          </select>
        </div>

        {loading ? (
          <div>Завантаження…</div>
        ) : (
          <table className="table table-bordered bg-white">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Автор</th>
                <th>Жанр</th>
                <th>ISBN</th>
                <th>Копій</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author_id?.name}</td>
                  <td>{book.genre_id?.name}</td>
                  <td>{book.isbn}</td>
                  <td>
                    {book.copies_available}
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={() => handleUpdateCopies(book._id, book.copies_available)}
                    >
                      Змінити
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleOpenEdit(book)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(book._id)}
                    >
                      Видалити повністю
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <BookFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitBook}
          book={selectedBook}
          genres={genres}
          authors={authors}
        />
      </div>
    </div>
  );
}

