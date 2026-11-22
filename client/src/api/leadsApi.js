const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('lead_token') : null;
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors.join(', ') : null) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

    if (!isJson) {
      throw new Error(
        'Received an unexpected non-JSON response. Check that VITE_API_URL points to the API server.'
      );
    }

  return data;
}

export async function getLeads(search = '', status = '') {
  const params = new URLSearchParams({
    search: search ?? '',
    status: status ?? '',
  });
  return request(`/api/leads?${params.toString()}`);
}

export async function createLead(data) {
  return request('/api/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLead(id, data) {
  return request(`/api/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLead(id) {
  return request(`/api/leads/${id}`, {
    method: 'DELETE',
  });
}

export async function getStats() {
  return request('/api/leads/stats');
}

export async function loginUser(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
