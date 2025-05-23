import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiRequest } from '../../api/api';

function PrivateRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('token');
    if (!token) {
      setChecking(false);
      setBlocked(false);
      return;
    }
    apiRequest('/users/me')
      .then(async r => {
        if (r.status === 403) {
          if (!cancelled) setBlocked(true);
        } else if (r.status === 200) {
          const user = await r.json();
          if (!cancelled) setBlocked(user.blocked);
        } else {
          localStorage.removeItem('token');
          window.location.href = "/login";
        }
      })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, []);

  if (checking) return null;

  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;
  if (blocked) {
    localStorage.removeItem('token');
    return (
      <div style={{ color: "red", padding: 32, textAlign: "center" }}>
        Ваш обліковий запис заблоковано.<br />
        Зверніться до адміністратора.<br />
        <a href="/login">На сторінку входу</a>
      </div>
    );
  }

  return children;
}

export default PrivateRoute;

