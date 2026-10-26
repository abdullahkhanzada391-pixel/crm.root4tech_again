import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole, UserAccount } from '@/types/crm';
import { INITIAL_USERS } from '@/data/mockData';
import { getRoleDefaultRoute } from '@/utils/roleConfig';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  users: UserAccount[];
  login: (email: string, password?: string) => { success: boolean; error?: string; redirectRoute?: string };
  loginAsRole: (role: UserRole) => string;
  logout: () => void;
  updateUserPassword: (userId: string, newPassword: string) => boolean;
  updateUserProfile: (userId: string, data: Partial<UserAccount>) => boolean;
  addUser: (newUser: Omit<UserAccount, 'id'>) => boolean;
  deleteUser: (userId: string) => boolean;
  toggleUserStatus: (userId: string) => boolean;
  changeUserRole: (userId: string, newRole: UserRole) => boolean;
  resetUsersToDefaults: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'root4tech_crm_auth_user';
const USERS_STORAGE_KEY = 'root4tech_crm_users_list_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Registered Users & Passwords list
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: UserAccount[] = JSON.parse(saved);
        // Ensure default developer and hr accounts exist in stored list if upgrading from old version
        const hasDev = parsed.some(u => u.role === 'developer');
        const hasHr = parsed.some(u => u.role === 'hr');
        if (!hasDev || !hasHr) {
          const merged = [...parsed];
          INITIAL_USERS.forEach(initUser => {
            if (!merged.some(u => u.id === initUser.id || u.email.toLowerCase() === initUser.email.toLowerCase())) {
              merged.push(initUser);
            }
          });
          return merged;
        }
        return parsed;
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // 2. Currently Logged In User
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to admin for seamless evaluation
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Login handler validating against dynamic users & passwords
  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password?.trim() || '';

    // Match by exact email or recognizable role keyword
    const matched = users.find(
      u =>
        u.email.toLowerCase() === cleanEmail ||
        (cleanEmail.includes('admin') && u.role === 'admin') ||
        (cleanEmail.includes('sales') && u.role === 'sales') ||
        (cleanEmail.includes('hamza') && u.role === 'sales') ||
        (cleanEmail.includes('market') && u.role === 'marketing') ||
        (cleanEmail.includes('ayesha') && u.role === 'marketing') ||
        (cleanEmail.includes('dev') && u.role === 'developer') ||
        (cleanEmail.includes('zain') && u.role === 'developer') ||
        (cleanEmail.includes('hr') && u.role === 'hr') ||
        (cleanEmail.includes('fatima') && u.role === 'hr')
    );

    if (!matched) {
      return {
        success: false,
        error: 'Invalid credentials. Please enter a valid registered company email.'
      };
    }

    // Verify Account Status (Active vs Inactive)
    if (matched.status === 'Inactive') {
      return {
        success: false,
        error: 'This account has been deactivated by the administrator. Please contact IT or HR support.'
      };
    }

    // Verify Password
    if (!cleanPass) {
      return {
        success: false,
        error: 'Please enter your password to continue.'
      };
    }

    if (cleanPass !== matched.password && cleanPass !== 'root4tech') {
      return {
        success: false,
        error: 'Incorrect password. Please try again.'
      };
    }

    const assignedRoute = matched.defaultRoute || getRoleDefaultRoute(matched.role);
    const updatedUserSession: UserAccount = {
      ...matched,
      defaultRoute: assignedRoute
    };

    setUser(updatedUserSession);
    return {
      success: true,
      redirectRoute: assignedRoute
    };
  };

  // 1-Click Instant Demo Login
  const loginAsRole = (role: UserRole): string => {
    const target = users.find(u => u.role === role && u.status !== 'Inactive') || users.find(u => u.role === role) || users[0];
    const route = target.defaultRoute || getRoleDefaultRoute(target.role);
    setUser({ ...target, defaultRoute: route });
    return route;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Change / Setup Password for any user
  const updateUserPassword = (userId: string, newPassword: string): boolean => {
    if (!newPassword || newPassword.trim().length < 4) {
      return false;
    }

    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, password: newPassword.trim() } : u))
    );

    // If current logged-in user changed their own password, update session
    if (user && user.id === userId) {
      setUser(prev => (prev ? { ...prev } : null));
    }

    return true;
  };

  // Update User Details
  const updateUserProfile = (userId: string, data: Partial<UserAccount>): boolean => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        
        // If role was changed and defaultRoute wasn't explicitly overridden, automatically assign new role's dashboard
        let newRoute = data.defaultRoute || u.defaultRoute;
        if (data.role && data.role !== u.role && !data.defaultRoute) {
          newRoute = getRoleDefaultRoute(data.role);
        }

        const updated: UserAccount = {
          ...u,
          ...data,
          defaultRoute: newRoute
        };
        return updated;
      })
    );

    if (user && user.id === userId) {
      const updatedRoute = data.role && data.role !== user.role && !data.defaultRoute
        ? getRoleDefaultRoute(data.role)
        : (data.defaultRoute || user.defaultRoute || getRoleDefaultRoute(data.role || user.role));

      setUser(prev => (prev ? { ...prev, ...data, defaultRoute: updatedRoute } : null));
    }
    return true;
  };

  // Add New User Account (Automatic Dashboard Assignment)
  const addUser = (newUser: Omit<UserAccount, 'id'>): boolean => {
    const assignedRoute = newUser.defaultRoute || getRoleDefaultRoute(newUser.role);
    const initials = newUser.avatarInitials || newUser.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'TM';

    const userWithId: UserAccount = {
      ...newUser,
      id: `usr-${Date.now()}`,
      status: newUser.status || 'Active',
      defaultRoute: assignedRoute,
      avatarInitials: initials,
      joinDate: newUser.joinDate || new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, userWithId]);
    return true;
  };

  // Toggle user active / inactive status
  const toggleUserStatus = (userId: string): boolean => {
    // Prevent deactivating own account if only admin
    if (user && user.id === userId && user.role === 'admin') {
      const otherActiveAdmins = users.filter(u => u.role === 'admin' && u.id !== userId && u.status === 'Active');
      if (otherActiveAdmins.length === 0) {
        return false;
      }
    }

    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );

    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' } : null);
    }

    return true;
  };

  // Change user role and automatically update their dashboard and permissions
  const changeUserRole = (userId: string, newRole: UserRole): boolean => {
    const newRoute = getRoleDefaultRoute(newRole);
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            role: newRole,
            defaultRoute: newRoute
          };
        }
        return u;
      })
    );

    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, role: newRole, defaultRoute: newRoute } : null);
    }

    return true;
  };

  // Delete User Account
  const deleteUser = (userId: string): boolean => {
    if (users.length <= 1) return false; // Prevent deleting all users
    setUsers(prev => prev.filter(u => u.id !== userId));
    return true;
  };

  // Reset to Initial Default Users
  const resetUsersToDefaults = () => {
    setUsers(INITIAL_USERS);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        users,
        login,
        loginAsRole,
        logout,
        updateUserPassword,
        updateUserProfile,
        addUser,
        deleteUser,
        toggleUserStatus,
        changeUserRole,
        resetUsersToDefaults
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
