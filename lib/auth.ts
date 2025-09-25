// Frontend authentication utilities for API calls and token management

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type UserType = "admin" | "student" | "alumni";

export type LoginResponse = {
  success: boolean;
  message: string;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user_data?: {
    id: string;
    email: string;
    full_name?: string;
    user_type: UserType;
    is_active: boolean;
  };
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: any) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function login({
  email,
  password,
  user_type,
}: {
  email: string;
  password: string;
  user_type: UserType;
}): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, user_type }),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore json parse error
  }
  if (!res.ok) {
    const msg = data?.detail || data?.message || `HTTP ${res.status}`;
    const err: any = new Error(msg);
    err.status = res.status;
    err.details = data;
    throw err;
  }
  if (data.access_token && data.user_data) setAuth(data.access_token, data.user_data);
  return data;
}

export async function registerStudent(payload: {
  email: string;
  password: string;
  full_name: string;
  student_id: string;
  phone?: string;
  department?: string;
  graduation_year?: string;
  current_semester?: number;
}) {
  const res = await fetch(`${API_BASE}/api/auth/register/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.message || "Registration failed");
  return data;
}

export async function registerAdmin(payload: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  department?: string;
}) {
  const res = await fetch(`${API_BASE}/api/auth/register/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.message || "Registration failed");
  return data;
}

export async function fetchProfile() {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "Failed to fetch profile");
  return data;
}

export function logout() {
  clearAuth();
}


