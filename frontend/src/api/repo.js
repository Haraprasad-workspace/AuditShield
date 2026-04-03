const API_URL = 'http://localhost:5000/repo';

export const connectRepo = async (repo, token) => {
  const response = await fetch(`${API_URL}/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo, token })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Connection failed');
  return data;
};

export const disconnectRepo = async (repo) => {
  const response = await fetch(`${API_URL}/disconnect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo })
  });
  return response.json();
};

export const listRepos = async () => {
  const response = await fetch(`${API_URL}/list`);
  return response.json();
};