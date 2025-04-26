export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  } as const,
};

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 