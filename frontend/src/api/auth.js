// Accessing the environment variable for deployment
// Vite requires the VITE_ prefix to expose variables to the client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/auth`;

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  // Handling errors from the server (e.g., User already exists)
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  
  return data;
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  
  // Handling errors from the server (e.g., Access Denied)
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  return data;
};