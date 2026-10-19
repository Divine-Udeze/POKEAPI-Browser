const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "favorites_token";

export interface Favorite {
  id: number;
  pokemon_name: string;
  user_id: string;
  date_added: string;
  note: string | null;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = typeof body.detail === "string" ? body.detail : "Invalid input";
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 401) clearToken();
    throw new ApiError(res.status, message);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export async function login(username: string): Promise<void> {
  const data = await request<{ access_token: string }>("/login", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
  localStorage.setItem(TOKEN_KEY, data.access_token);
}

export const listFavorites = () => request<Favorite[]>("/favorites");

export const createFavorite = (pokemon_name: string, note?: string) =>
  request<Favorite>("/favorites", {
    method: "POST",
    body: JSON.stringify({ pokemon_name, note }),
  });

export const updateFavoriteNote = (id: number, note: string | null) =>
  request<Favorite>(`/favorites/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ note }),
  });

export const deleteFavorite = (id: number) =>
  request<void>(`/favorites/${id}`, { method: "DELETE" });