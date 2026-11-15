
"use client";

import { getMe, login, logout, register } from "@/utils/authService";
import { createContext, useState, useEffect, useContext } from "react";
import type { PropsWithChildren } from "react";

type AuthContextState = {
  user: AuthUser | null;
  isPending: boolean;
  login: (email: string, password: string) => Promise<void | string>;
  register: (email: string, password: string) => Promise<void | string>;
  logout: () => Promise<void>;
};

const defaultState: AuthContextState = {
  user: null,
  isPending: true,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext<AuthContextState>(defaultState);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  const _getMe = async () => {
    setIsPending(true);

    try {
      const user = await getMe();
      setUser(user);
    } catch (e) {
      console.warn("Error getting user", e);
      setUser(null);
    } finally {
      setIsPending(false);
    }
  };

  const _login: AuthContextState["login"] = async (email, password) => {
    try {
      const authenticated = await login(email, password);

      if (!authenticated) {
        return "Invalid credentials";
      }

      await _getMe();
    } catch (e) {
      console.warn("Error logging in", e);
      return "Invalid credentials";
    }
  };

  const _register: AuthContextState["register"] = async (email, password) => {
    try {
      const registered = await register(email, password);

      if (!registered) {
        return "Could not create account";
      }

      await _getMe();
    } catch (e) {
      console.warn("Error registering", e);
      return "Could not create account";
    }
  };

  const _logout = async () => {
    try {
      const success = await logout();

      if (success) {
        setUser(null);
      } else {
        console.warn("Could not log out");
      }
    } catch (e) {
      console.warn("Error logging out", e);
    }
  };

  useEffect(() => {
    _getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isPending,
        login: _login,
        register: _register,
        logout: _logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
