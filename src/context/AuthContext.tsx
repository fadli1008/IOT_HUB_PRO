import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, OnboardingState, UserRole } from '../types/auth';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  onboarding: OnboardingState;
  isAuthenticated: boolean;
  allUsers: User[];
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; requiresOtp: boolean }>;
  verifyOtp: (code: string) => Promise<boolean>;
  completeOnboarding: (workspaceName: string, useCase: 'hobby' | 'startup' | 'industrial') => void;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
  pendingEmail: string | null;
  // User Management
  addUser: (name: string, email: string, role: UserRole, deviceLimit?: number) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const DEFAULT_ORG: Organization = {
  id: 'org_default',
  name: "My IoT Workspace",
  slug: 'my-iot-workspace',
  plan: 'free',
  deviceLimit: 5,
  devicesCount: 0,
  role: 'operator'
};

const INITIAL_SUPER_ADMIN: User = {
  id: 'usr_super_admin_fadli',
  name: 'Muhamad Fadli',
  email: 'admin@iothub.local',
  avatarUrl: 'https://avatars.githubusercontent.com/u/fadli1008',
  role: 'owner',
  isEmailVerified: true,
  createdAt: '2026-08-01T00:00:00Z',
  status: 'active',
  deviceLimit: 500,
  devicesCount: 8,
  lastLogin: 'Just now'
};

const INITIAL_USERS: User[] = [
  INITIAL_SUPER_ADMIN,
  {
    id: 'usr_sarah_02',
    name: 'Sarah Connor',
    email: 'sarah.engineer@factory.io',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=sarah',
    role: 'admin',
    isEmailVerified: true,
    createdAt: '2026-08-05T10:30:00Z',
    status: 'active',
    deviceLimit: 50,
    devicesCount: 4,
    lastLogin: '2 hours ago'
  },
  {
    id: 'usr_budi_03',
    name: 'Budi Santoso',
    email: 'budi.scada@industry.co.id',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=budi',
    role: 'operator',
    isEmailVerified: true,
    createdAt: '2026-08-10T14:15:00Z',
    status: 'active',
    deviceLimit: 15,
    devicesCount: 2,
    lastLogin: 'Yesterday'
  },
  {
    id: 'usr_guest_04',
    name: 'Viewer Client',
    email: 'auditor@investor.com',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=auditor',
    role: 'viewer',
    isEmailVerified: true,
    createdAt: '2026-08-14T08:00:00Z',
    status: 'active',
    deviceLimit: 5,
    devicesCount: 0,
    lastLogin: '3 days ago'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.get('user', null));
  const [allUsers, setAllUsers] = useState<User[]>(() => storage.get('all_users', INITIAL_USERS));
  const [organization, setOrganization] = useState<Organization | null>(() => storage.get('org', DEFAULT_ORG));
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => 
    storage.get('onboarding', { isCompleted: true, workspaceName: "Muhamad Fadli's IoT Workspace", useCase: 'industrial', experienceLevel: 'expert' })
  );
  const [pendingEmail, setPendingEmail] = useState<string | null>(() => storage.get('pendingEmail', null));

  useEffect(() => {
    if (user) storage.set('user', user);
    else storage.remove('user');
  }, [user]);

  useEffect(() => {
    storage.set('all_users', allUsers);
  }, [allUsers]);

  useEffect(() => {
    if (organization) storage.set('org', organization);
  }, [organization]);

  useEffect(() => {
    storage.set('onboarding', onboarding);
  }, [onboarding]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Super Admin Login Authentication
    if (cleanEmail === 'admin@iothub.local' || cleanEmail === 'fadli@iothub.pro' || cleanEmail === 'muhamad.fadli@gmail.com') {
      if (password !== 'oauth_social_token' && password !== 'admin123' && password !== 'fadli123' && password !== 'admin') {
        throw new Error('Password salah untuk akun Super Admin. (Default: admin123)');
      }
      setUser(INITIAL_SUPER_ADMIN);
      setOrganization({
        id: 'org_super_admin',
        name: "Muhamad Fadli's Enterprise Hub",
        slug: 'muhamad-fadli-enterprise',
        plan: 'enterprise',
        deviceLimit: 500,
        devicesCount: 8,
        role: 'owner'
      });
      return true;
    }

    // 2. Existing Registered User Login
    const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.status === 'suspended') {
        throw new Error('Akun Anda dinonaktifkan (suspended) oleh Super Admin.');
      }
      setUser({ ...existing, lastLogin: 'Just now' });
      setOrganization({
        id: 'org_' + existing.id,
        name: `${existing.name}'s Workspace`,
        slug: existing.name.toLowerCase().replace(/\s+/g, '-'),
        plan: existing.role === 'admin' ? 'pro' : 'free',
        deviceLimit: existing.deviceLimit || 5,
        devicesCount: existing.devicesCount || 0,
        role: existing.role
      });
      return true;
    }

    // 3. New User Registration / Guest Fallback
    const displayName = email.split('@')[0].toUpperCase();
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: displayName,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
      role: 'operator',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      status: 'active',
      deviceLimit: 5,
      devicesCount: 0,
      lastLogin: 'Just now'
    };

    setAllUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    setOrganization({
      id: 'org_' + newUser.id,
      name: `${displayName}'s Workspace`,
      slug: displayName.toLowerCase(),
      plan: 'free',
      deviceLimit: 5,
      devicesCount: 0,
      role: 'operator'
    });
    return true;
  };

  const register = async (name: string, email: string, _password?: string) => {
    setPendingEmail(email);
    storage.set('pendingEmail', email);
    return { success: true, requiresOtp: true };
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    if (code.length === 6) {
      const email = pendingEmail || 'user@iothub.local';
      const isSuper = email.includes('fadli') || email.includes('admin');
      const displayName = isSuper ? 'Muhamad Fadli' : email.split('@')[0];

      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: displayName,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
        role: isSuper ? 'owner' : 'operator',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        status: 'active',
        deviceLimit: isSuper ? 500 : 5,
        devicesCount: 0,
        lastLogin: 'Just now'
      };

      setAllUsers(prev => [newUser, ...prev.filter(u => u.email !== email)]);
      setUser(newUser);
      setOrganization({
        id: 'org_' + newUser.id,
        name: `${displayName}'s Workspace`,
        slug: displayName.toLowerCase().replace(/\s+/g, '-'),
        plan: isSuper ? 'enterprise' : 'free',
        deviceLimit: isSuper ? 500 : 5,
        devicesCount: 0,
        role: isSuper ? 'owner' : 'operator'
      });
      storage.remove('pendingEmail');
      setPendingEmail(null);
      return true;
    }
    return false;
  };

  const completeOnboarding = (workspaceName: string, useCase: 'hobby' | 'startup' | 'industrial') => {
    const updated: OnboardingState = {
      isCompleted: true,
      workspaceName,
      useCase,
      experienceLevel: 'expert'
    };
    setOnboarding(updated);
    if (organization) {
      setOrganization({
        ...organization,
        name: workspaceName
      });
    }
  };

  const logout = () => {
    setUser(null);
    storage.remove('user');
    storage.remove('org');
  };

  const updateUserRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
  };

  // User Management Actions
  const addUser = (name: string, email: string, role: UserRole, deviceLimit = 10) => {
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
      role,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      status: 'active',
      deviceLimit,
      devicesCount: 0,
      lastLogin: 'Never'
    };
    setAllUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (id: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        onboarding,
        isAuthenticated: !!user,
        allUsers,
        login,
        register,
        verifyOtp,
        completeOnboarding,
        logout,
        updateUserRole,
        pendingEmail,
        addUser,
        updateUser,
        deleteUser
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
