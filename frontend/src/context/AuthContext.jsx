import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'reshmi_auth_token';
const USER_KEY = 'reshmi_auth_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync session with server on initial mount
  useEffect(() => {
    const verifySession = async () => {
      const activeToken = token || localStorage.getItem(TOKEN_KEY);
      if (!activeToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth-me', {
          headers: {
            'Authorization': `Bearer ${activeToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          } else {
            clearSession();
          }
        } else {
          clearSession();
        }
      } catch (err) {
        console.warn('Session verification notice:', err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const setSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.warn('Failed to store session in localStorage', e);
    }
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  };

  const login = async (email, password) => {
    const res = await fetch('/api/auth-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }

    setSession(data.token, data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const res = await fetch('/api/auth-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Registration failed. Please try again.');
    }

    setSession(data.token, data.user);
    return data;
  };

  const logout = () => {
    clearSession();
  };

  const isAdmin = !!(user && (user.role === 'admin' || (user.email || '').toLowerCase().includes('admin')));

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        isAdmin,
        login,
        register,
        logout,
        setSession,
        clearSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
