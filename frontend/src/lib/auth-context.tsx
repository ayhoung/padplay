"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from "./api";

export interface User {
  id: number;
  email: string;
  wantsUpdates: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: typeof loginUser;
  register: typeof registerUser;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login: typeof loginUser = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data);
    return data;
  };

  const register: typeof registerUser = async (email, password, wantsUpdates) => {
    const data = await registerUser(email, password, wantsUpdates);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
