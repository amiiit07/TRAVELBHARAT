const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
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