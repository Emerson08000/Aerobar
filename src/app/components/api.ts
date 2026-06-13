import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export const BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;

function getAdminToken() {
  return localStorage.getItem('aerobar_admin_token');
}

async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function adminHeaders() {
  const token = getAdminToken();
  return { 'Authorization': `Bearer ${token}` };
}

// Menu
export const menuApi = {
  getAll: () => fetchJSON(`${BASE_URL}/menu`),
  getById: (id: string) => fetchJSON(`${BASE_URL}/menu/${id}`),
  create: (data: object) => fetchJSON(`${BASE_URL}/menu`, {
    method: 'POST', body: JSON.stringify(data), headers: adminHeaders()
  }),
  update: (id: string, data: object) => fetchJSON(`${BASE_URL}/menu/${id}`, {
    method: 'PUT', body: JSON.stringify(data), headers: adminHeaders()
  }),
  delete: (id: string) => fetchJSON(`${BASE_URL}/menu/${id}`, {
    method: 'DELETE', headers: adminHeaders()
  }),
};

// Orders
export const ordersApi = {
  getAll: () => fetchJSON(`${BASE_URL}/orders`, { headers: adminHeaders() }),
  getById: (id: string) => fetchJSON(`${BASE_URL}/orders/${id}`),
  create: (data: object) => fetchJSON(`${BASE_URL}/orders`, {
    method: 'POST', body: JSON.stringify(data)
  }),
  update: (id: string, data: object) => fetchJSON(`${BASE_URL}/orders/${id}`, {
    method: 'PUT', body: JSON.stringify(data), headers: adminHeaders()
  }),
};

// Auth
export const authApi = {
  login: (username: string, password: string) => fetchJSON(`${BASE_URL}/auth/login`, {
    method: 'POST', body: JSON.stringify({ username, password })
  }),
  logout: () => fetchJSON(`${BASE_URL}/auth/logout`, {
    method: 'POST', headers: adminHeaders()
  }),
  verify: () => fetchJSON(`${BASE_URL}/auth/verify`, { headers: adminHeaders() }),
};

// Upload
export const uploadApi = {
  image: (dataUri: string, filename: string) => fetchJSON(`${BASE_URL}/upload/image`, {
    method: 'POST', body: JSON.stringify({ dataUri, filename }), headers: adminHeaders()
  }),
};

// Seed reset
export const seedApi = {
  reset: () => fetchJSON(`${BASE_URL}/seed/reset`, {
    method: 'POST', body: JSON.stringify({}), headers: adminHeaders()
  }),
};

// Payment
export const paymentApi = {
  create: (orderId: string, total: number, customerName: string, customerEmail?: string) =>
    fetchJSON(`${BASE_URL}/payment/create`, {
      method: 'POST', body: JSON.stringify({ orderId, total, customerName, customerEmail })
    }),
};
