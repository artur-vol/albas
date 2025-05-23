import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/api';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/books');
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          phone
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || 'Помилка реєстрації');
        return;
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/books');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Помилка мережі');
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow" style={{ minWidth: 350 }}>
        <h2 className="mb-4 text-center">Реєстрація</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ПІБ</label>
            <input type="text" className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Пошта</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Телефон</label>
            <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Пароль</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-dark w-100">Зареєструватися</button>
        </form>
        <div className="text-center mt-3">
          Вже маєте акаунт? <Link to="/login">Увійти</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

