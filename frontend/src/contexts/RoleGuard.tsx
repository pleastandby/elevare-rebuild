import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FacultyDashboard from '../pages/FacultyDashboard';
import StudentDashboard from '../pages/StudenDashboard';

interface RoleGuardProps {
  children?: ReactNode;
  allowedRoles?: string[];
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles = [],
  fallback = <div>Access denied</div>
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to access this content</div>;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const FacultyOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGuard allowedRoles={['faculty']}>
    {children}
  </RoleGuard>
);

export const StudentOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGuard allowedRoles={['student']}>
    {children}
  </RoleGuard>
);

export const FacultyDashboardGuard: React.FC<{ setToken: (token: string) => void }> = ({ setToken }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setToken('');
  };

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold">Faculty Dashboard - Welcome to Elevare</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <FacultyDashboard setToken={setToken} />
    </div>
  );
};

export const StudentDashboardGuard: React.FC<{ setToken: (token: string) => void }> = ({ setToken }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setToken('');
  };

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold">Student Dashboard - Welcome to Elevare</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <StudentDashboard setToken={setToken} />
    </div>
  );
};
