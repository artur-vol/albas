// const API_BASE = 'http://localhost:5001';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function apiRequest(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': 'Bearer ' + token } : {})
  };

  const response = await fetch(API_BASE + url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  return response;
}

