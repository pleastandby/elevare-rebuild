import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  rollNo?: number;
  facultyId?: string;
}

interface AuthContextType {
  student: Student | null;
  token: string | null;
  login: (token: string, student: Student) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app start
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // TODO: Validate token and fetch user data from backend
      // For now, we'll rely on the Dashboard component to fetch user role
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, studentData: Student) => {
    setToken(newToken);
    setStudent(studentData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('student', JSON.stringify(studentData));
  };

  const logout = () => {
    setToken(null);
    setStudent(null);
    localStorage.removeItem('token');
    localStorage.removeItem('student');
  };

  const value: AuthContextType = {
    student,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
