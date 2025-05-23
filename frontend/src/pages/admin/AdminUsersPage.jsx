import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import UserFilters from "../../components/UserFilters/UserFilters";
import { apiRequest } from "../../api/api";

const ROLES = ["reader", "admin"];
const SUPER_ADMIN_EMAIL = "admin@example.com";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sort, setSort] = useState("alphabet");

  function fetchUsers() {
    setLoading(false);
    apiRequest("/users")
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }

  useEffect(fetchUsers, []);

  async function handleBlock(id) {
    await apiRequest(`/users/${id}/block`, { method: "POST" });
    fetchUsers();
  }

  async function handleUnblock(id) {
    await apiRequest(`/users/${id}/unblock`, { method: "POST" });
    fetchUsers();
  }

  async function handleDelete(id) {
    if (window.confirm("Видалити користувача?")) {
      await apiRequest(`/users/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  }

  async function handleRoleChange(id, role) {
    await apiRequest(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  }

  let filtered = users.filter((u) =>
    (!search || [u.full_name, u.email, u.phone].join(" ").toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter)
  );

  if (sort === "alphabet") filtered.sort((a, b) => a.full_name.localeCompare(b.full_name));
  else if (sort === "blocked") filtered.sort((a, b) => b.blocked - a.blocked);
  else if (sort === "role") filtered.sort((a, b) => a.role.localeCompare(b.role));

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Користувачі</h3>

        <UserFilters
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          sort={sort}
          setSort={setSort}
        />

        {loading ? (
          <div>Завантаження…</div>
        ) : (
          <table className="table table-bordered bg-white">
            <thead>
              <tr>
                <th>ПІБ</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Роль</th>
                <th>Блоковано</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isSuperAdmin = u.email === SUPER_ADMIN_EMAIL;
                const isLastAdmin =
                  u.role === "admin" && users.filter((usr) => usr.role === "admin").length === 1;

                return (
                  <tr key={u._id}>
                    <td>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      {isSuperAdmin ? (
                        <span>{u.role} (головний адмін)</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={isLastAdmin}
                          style={{ minWidth: 90 }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>{u.blocked ? "Так" : "Ні"}</td>
                    <td>
                      {isSuperAdmin ? (
                        <span className="text-muted">Захищений</span>
                      ) : (
                        <>
                          {u.blocked ? (
                            <button className="btn btn-success btn-sm" onClick={() => handleUnblock(u._id)}>
                              Розблокувати
                            </button>
                          ) : (
                            <button className="btn btn-warning btn-sm" onClick={() => handleBlock(u._id)}>
                              Заблокувати
                            </button>
                          )}{" "}
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                            Видалити
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

