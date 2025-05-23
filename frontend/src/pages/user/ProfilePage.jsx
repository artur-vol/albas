import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { apiRequest } from '../../api/api';

export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/users/me')
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setFullName(data.full_name);
        setPhone(data.phone);
        setEmail(data.email);
      });
  }, []);

  if (!user) return <div>Завантаження…</div>;

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await apiRequest(`/users/${user._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
          email: email
        })
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Помилка');
      } else {
        const updated = await res.json();
        setUser(updated);
        setEdit(false);
      }
    } catch (e) {
      setError('Помилка мережі');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: "#f5f6fa" }}>
      <Sidebar active="profile" />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h3 className="mb-4">Профіль</h3>
        <div
          style={{
            maxWidth: 420,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 16px #0001",
            padding: "2rem",
            marginLeft: 0,
            marginTop: 0
          }}
        >
          {edit ? (
            <>
              <div className="mb-3">
                <label>Імʼя</label>
                <input className="form-control"
                       value={fullName}
                       onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label>Телефон</label>
                <input className="form-control"
                       value={phone}
                       onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input className="form-control"
                       value={email}
                       onChange={e => setEmail(e.target.value)} />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <button className="btn btn-primary me-2" onClick={handleSave} disabled={saving}>Зберегти</button>
              <button className="btn btn-outline-secondary" onClick={() => setEdit(false)} disabled={saving}>Відміна</button>
            </>
          ) : (
            <>
              <div><b>Імʼя:</b> {user.full_name}</div>
              <div><b>Email:</b> {user.email}</div>
              <div><b>Телефон:</b> {user.phone}</div>
              <div><b>Роль:</b> {user.role === "admin" ? "Адмін" : "Читач"}</div>
              <div>
                <b>Статус:</b> {user.blocked ? <span style={{ color: "red" }}>Заблокований</span> : "Активний"}
              </div>
              <button className="btn btn-outline-dark mt-3" onClick={() => setEdit(true)}>Редагувати</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

