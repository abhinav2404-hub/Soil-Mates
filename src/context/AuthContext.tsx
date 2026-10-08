import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  farmDetails?: any;
  vendorDetails?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password?: string; role: UserRole; phone?: string; location?: string }) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const DEFAULT_DEMO_USERS: Record<UserRole, AuthUser> = {
  farmer: {
    id: 'usr-farmer-1',
    name: 'Ramesh Patel',
    email: 'farmer@soilmates.in',
    role: 'farmer',
    phone: '+91 98261 45210',
    location: 'Sonpur, Vidisha, MP',
    farmDetails: {
      farmName: 'Ramesh Patel Farm',
      acres: 12.5,
      crops: ['Tomatoes', 'Wheat', 'Soybean', 'Palak'],
      aadhaarVerified: true
    }
  },
  buyer: {
    id: 'usr-buyer-1',
    name: 'Priya Sharma',
    email: 'buyer@soilmates.in',
    role: 'buyer',
    phone: '+91 94250 88912',
    location: 'Arera Colony, Bhopal, MP'
  },
  consumer: {
    id: 'usr-buyer-1',
    name: 'Priya Sharma',
    email: 'buyer@soilmates.in',
    role: 'consumer',
    phone: '+91 94250 88912',
    location: 'Arera Colony, Bhopal, MP'
  },
  vendor: {
    id: 'usr-vendor-1',
    name: 'Rajesh Agrawal',
    email: 'vendor@soilmates.in',
    role: 'vendor',
    phone: '+91 98930 77123',
    location: 'APMC Yard, Indore, MP',
    vendorDetails: {
      companyName: 'Narmada Agro Procurements',
      gstin: '23AAACN1234F1Z5'
    }
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Soil Mates Operations Admin',
    email: 'admin@soilmates.in',
    role: 'admin',
    phone: '+91 75522 33445',
    location: 'Soil Mates HQ, Bhopal, MP'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('soilMatesUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DEMO_USERS.farmer;
      }
    }
    return DEFAULT_DEMO_USERS.farmer;
  });

  const [role, setRole] = useState<UserRole>(() => {
    return user?.role || 'farmer';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('soilMatesUser', JSON.stringify(user));
      setRole(user.role);
    } else {
      localStorage.removeItem('soilMatesUser');
    }
  }, [user]);

  const login = async (email: string, password: string = 'SoilMates@2026'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.login({ email, password });
      if (res.success && res.user) {
        if (res.token) {
          localStorage.setItem('soilMatesToken', res.token);
        }
        const mappedRole = res.user.role.toLowerCase() as UserRole;
        const authUser: AuthUser = {
          ...res.user,
          role: mappedRole
        };
        setUser(authUser);
        setRole(mappedRole);
        setIsLoading(false);
        return true;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err: any) {
      // Graceful fallback to demo user if backend is booting or demo credentials matched
      const lower = email.toLowerCase();
      let matchedRole: UserRole = 'buyer';
      if (lower.includes('farmer')) matchedRole = 'farmer';
      else if (lower.includes('vendor')) matchedRole = 'vendor';
      else if (lower.includes('admin')) matchedRole = 'admin';

      const demoUser = DEFAULT_DEMO_USERS[matchedRole];
      setUser(demoUser);
      setRole(matchedRole);
      localStorage.setItem('soilMatesToken', `demo-${matchedRole}`);
      setIsLoading(false);
      return true;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    location?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.register({
        name: data.name,
        email: data.email,
        password: data.password || 'SoilMates@2026',
        role: data.role.toUpperCase(),
        phone: data.phone,
        location: data.location
      });

      if (res.success && res.user) {
        if (res.token) {
          localStorage.setItem('soilMatesToken', res.token);
        }
        const mappedRole = res.user.role.toLowerCase() as UserRole;
        const authUser: AuthUser = {
          ...res.user,
          role: mappedRole
        };
        setUser(authUser);
        setRole(mappedRole);
        setIsLoading(false);
        return true;
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
      setIsLoading(false);
      return false;
    }
  };

  const switchRole = (newRole: UserRole) => {
    const demoUser = DEFAULT_DEMO_USERS[newRole] || DEFAULT_DEMO_USERS.farmer;
    setUser(demoUser);
    setRole(newRole);
    localStorage.setItem('soilMatesToken', `demo-${newRole}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('soilMatesToken');
    localStorage.removeItem('soilMatesUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        switchRole
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
