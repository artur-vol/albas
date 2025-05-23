import React from "react";

const ROLES = ["reader", "moderator", "admin"];

export default function UserFilters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  sort,
  setSort,
}) {
  return (
    <div className="d-flex align-items-center mb-3" style={{ gap: 16, flexWrap: "wrap" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Пошук за ПІБ, email, телефоном"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 300 }}
      />
      <select
        className="form-select"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        style={{ maxWidth: 180 }}
      >
        <option value="">Усі ролі</option>
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <select
        className="form-select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={{ maxWidth: 220 }}
      >
        <option value="alphabet">А-Я</option>
        <option value="blocked">Блоковані першими</option>
        <option value="role">За роллю</option>
      </select>
    </div>
  );
}

