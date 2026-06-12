// Autenticação local — sem Supabase
const TOKEN_KEY = 'aerobar_admin_token';
const VALID_TOKEN = 'foguinho-admin-authenticated';

export function isAuthenticated(): boolean {
  return localStorage.getItem(TOKEN_KEY) === VALID_TOKEN;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
