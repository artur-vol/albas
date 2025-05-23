import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/user/Login.jsx";
import Register from "./pages/user/Register.jsx";
import BooksPage from "./pages/user/BooksPage.jsx";
import BookDetail from "./components/BookDetail/BookDetail.jsx";
import MyBooksPage from "./pages/user/MyBooksPage.jsx";
import MyFinesPage from "./pages/user/MyFinesPage.jsx";
import ProfilePage from "./pages/user/ProfilePage.jsx";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";

// ==== Адмін сторінки ====
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminBooksPage from "./pages/admin/AdminBooksPage.jsx";
import AdminAuthorsPage from "./pages/admin/AdminAuthorsPage.jsx";
import AdminGenresPage from "./pages/admin/AdminGenresPage.jsx";
import AdminPublishersPage from "./pages/admin/AdminPublishersPage.jsx";
import AdminBorrowingsPage from "./pages/admin/AdminBorrowingsPage.jsx";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage.jsx";
import AdminFinesPage from "./pages/admin/AdminFinesPage.jsx";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/books" replace />;
  return children;
}

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to={role === "admin" ? "/admin/users" : "/books"} replace />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/books" replace />}
        />
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <BooksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <PrivateRoute>
              <BookDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-books"
          element={
            <PrivateRoute>
              <MyBooksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-fines"
          element={
            <PrivateRoute>
              <MyFinesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* ==== Адмінські сторінки ==== */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <AdminRoute>
              <AdminBooksPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/authors"
          element={
            <AdminRoute>
              <AdminAuthorsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/genres"
          element={
            <AdminRoute>
              <AdminGenresPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/publishers"
          element={
            <AdminRoute>
              <AdminPublishersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/borrowings"
          element={
            <AdminRoute>
              <AdminBorrowingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/fines"
          element={
            <AdminRoute>
              <AdminFinesPage />
            </AdminRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="*"
          element={<Navigate to={token ? (role === "admin" ? "/admin/users" : "/books") : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;

