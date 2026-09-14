const API = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Request failed.');
  }
  return body;
}

export const api = {
  health() {
    return request('/health');
  },
  templatesFull() {
    return request('/templates/full');
  },
  createSession(name) {
    return request('/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  },
  uploadPhoto(sessionId, file) {
    const form = new FormData();
    form.append('photo', file);
    return request(`/sessions/${sessionId}/photo`, { method: 'POST', body: form });
  },
  generate(sessionId) {
    return request(`/sessions/${sessionId}/generate`, { method: 'POST' });
  },
  recordDownload(sessionId, templateId) {
    return request(`/sessions/${sessionId}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId }),
    });
  },
};
