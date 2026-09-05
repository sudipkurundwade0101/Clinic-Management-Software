import React, { createContext, useContext, useState } from 'react';

export interface User {
  name?: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: { name: 'Dr. Sarah Smith', email: 'sarah.smith@medicare.com' },
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@medicare.com',
  });

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
