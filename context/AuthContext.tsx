"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 从localStorage恢复登录状态
    const storedUser = localStorage.getItem("happySimUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("happySimUser");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password && password.length >= 6) {
      const mockUser: User = { id: "1", email, name: email.split("@")[0] };
      setUser(mockUser);
      setIsLoggedIn(true);
      localStorage.setItem("happySimUser", JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    // 模拟注册逻辑（实际项目中应该调用API）
    if (email && password && password.length >= 6) {
      const mockUser: User = { id: "1", email, name: name || email.split("@")[0] };
      setUser(mockUser);
      setIsLoggedIn(true);
      localStorage.setItem("happySimUser", JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("happySimUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>
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
