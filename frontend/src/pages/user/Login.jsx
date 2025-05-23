import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        navigate('/admin/users');
      } else {
        navigate('/books');
      }
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || 'Помилка входу');
        return;
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        if (data.role === 'admin') {
          navigate('/admin/users');
        } else {
          navigate('/books');
        }
      }
    } catch (err) {
      setError('Помилка мережі');
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow" style={{ minWidth: 350 }}>
        <h2 className="mb-4 text-center">Вхід до бібліотеки</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Пошта</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Введіть email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введіть пароль"
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">Увійти</button>
        </form>
        <div className="text-center mt-3">
          Ще не маєте акаунта? <Link to="/register">Зареєструйтеся</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

