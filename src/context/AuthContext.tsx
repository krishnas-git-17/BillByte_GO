import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, LoginResponse } from '../services/auth.service';

/* ================= TYPES ================= */

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  role: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  /* ===== INIT AUTH ===== */
  useEffect(() => {
    const initAuth = async () => {
      const loggedIn = await AuthService.isLoggedIn();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const storedToken = await AuthService.getToken();
        setToken(storedToken);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /* ===== LOGIN ===== */
 const login = async (username: string, password: string) => {
  const res: LoginResponse = await AuthService.login(username, password);

  setToken(res.token);
  setRole(res.role);
  setEmail(res.email);
  setIsLoggedIn(true);
};

  /* ===== LOGOUT ===== */
  const logout = async () => {
    await AuthService.logout();
    setToken(null);
    setRole(null);
    setEmail(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        token,
        role,
        email,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => useContext(AuthContext);
