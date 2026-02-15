const TOKEN_KEY = 'acep_token';
const USER_KEY = 'acep_user';

export const authStorage = {
  getToken: () => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken: () => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser: () => {
    if (typeof window === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: unknown) => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser: () => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(USER_KEY);
  },
  clearAll: () => {
    authStorage.clearToken();
    authStorage.clearUser();
  }
};
