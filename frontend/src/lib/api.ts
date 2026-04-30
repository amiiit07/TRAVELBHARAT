const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint: string, options?: RequestInit, includeAuth = false) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(includeAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers
    }
  });
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
}

export const api = {
  getStates: () => fetchAPI('/states'),
  getState: (slug: string) => fetchAPI(`/states/${slug}`),
  getCities: (stateId?: string) => stateId ? fetchAPI(`/cities?stateId=${stateId}`) : fetchAPI('/cities'),
  getCity: (slug: string) => fetchAPI(`/cities/${slug}`),
  getPlaces: (params?: object) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchAPI(`/places?${query}`);
  },
  getPlace: (slug: string) => fetchAPI(`/places/${slug}`),
  getPopularPlaces: () => fetchAPI('/places/popular'),
  getPlacesByCategory: (category: string) => fetchAPI(`/places/category/${category}`),
  createState: (data: any) => fetchAPI('/states', { method: 'POST', body: JSON.stringify(data) }, true),
  updateState: (id: string, data: any) => fetchAPI(`/states/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  deleteState: (id: string) => fetchAPI(`/states/${id}`, { method: 'DELETE' }, true),
  createCity: (data: any) => fetchAPI('/cities', { method: 'POST', body: JSON.stringify(data) }, true),
  updateCity: (id: string, data: any) => fetchAPI(`/cities/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  deleteCity: (id: string) => fetchAPI(`/cities/${id}`, { method: 'DELETE' }, true),
  createPlace: (data: any) => fetchAPI('/places', { method: 'POST', body: JSON.stringify(data) }, true),
  updatePlace: (id: string, data: any) => fetchAPI(`/places/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  deletePlace: (id: string) => fetchAPI(`/places/${id}`, { method: 'DELETE' }, true),
  search: (query: string, filters?: object) => {
    const params = new URLSearchParams({ q: query, ...filters as any }).toString();
    return fetchAPI(`/search?${params}`);
  },
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  }
};

export default api;