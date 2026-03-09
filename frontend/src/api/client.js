const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  getDashboardStats: () => request('/contracts/dashboard/stats'),
  getContracts: (query = '') => request(`/contracts${query}`),
  getContract: (id) => request(`/contracts/${id}`),
  createContract: (payload) => request('/contracts', { method: 'POST', body: JSON.stringify(payload) }),
  updateContract: (id, payload) => request(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteContract: (id) => request(`/contracts/${id}`, { method: 'DELETE' }),
  uploadContractFile: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request(`/contracts/${id}/upload`, { method: 'POST', body: formData });
  },
};
