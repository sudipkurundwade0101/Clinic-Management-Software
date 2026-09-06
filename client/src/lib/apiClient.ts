const BASE_URL = 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  data?: any;
}

export const apiClient = async (endpoint: string, options: FetchOptions = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.data) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.data);
  }

  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'API request failed');
  }

  // Handle empty responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  get: (endpoint: string, options?: FetchOptions) => apiClient(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options?: FetchOptions) => apiClient(endpoint, { ...options, method: 'POST', data }),
  put: (endpoint: string, data?: any, options?: FetchOptions) => apiClient(endpoint, { ...options, method: 'PUT', data }),
  patch: (endpoint: string, data?: any, options?: FetchOptions) => apiClient(endpoint, { ...options, method: 'PATCH', data }),
  delete: (endpoint: string, options?: FetchOptions) => apiClient(endpoint, { ...options, method: 'DELETE' }),
};
