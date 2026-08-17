import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, OnboardingState, UserRole } from '../types/auth';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  onboarding: OnboardingState;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; requiresOtp: boolean }>;
  verifyOtp: (code: string) => Promise<boolean>;
  completeOnboarding: (workspaceName: string, useCase: 'hobby' | 'startup' | 'industrial') => void;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
  pendingEmail: string | null;
}

const DEFAULT_ORG: Organization = {
  id: 'org_fadli_01',
  name: "Muhamad Fadli's IoT Workspace",
  slug: 'muhamad-fadli-iot-workspace',
  plan: 'pro',
  deviceLimit: 250,
  devicesCount: 3,
  role: 'owner'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.get('user', null));
  const [organization, setOrganization] = useState<Organization | null>(() => storage.get('org', DEFAULT_ORG));
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => 
    storage.get('onboarding', { isCompleted: false, workspaceName: 'My IoT Project', useCase: 'hobby', experienceLevel: 'intermediate' })
  );
  const [pendingEmail, setPendingEmail] = useState<string | null>(() => storage.get('pendingEmail', null));

  useEffect(() => {
    if (user) storage.set('user', user);
    else storage.remove('user');
  }, [user]);

  useEffect(() => {
    if (organization) storage.set('org', organization);
  }, [organization]);

  useEffect(() => {
    storage.set('onboarding', onboarding);
  }, [onboarding]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Simulated instant login
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].toUpperCase(),
      email,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
      role: 'owner',
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, _password?: string) => {
    setPendingEmail(email);
    storage.set('pendingEmail', email);
    // In production this triggers email OTP dispatch
    return { success: true, requiresOtp: true };
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    // Accepts 6-digit code or "123456"
    if (code.length === 6) {
      const email = pendingEmail || 'developer@iothub.local';
      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email: email,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
        role: 'owner',
        isEmailVerified: true,
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      setPendingEmail(null);
      storage.remove('pendingEmail');
      return true;
    }
    return false;
  };

  const completeOnboarding = (workspaceName: string, useCase: 'hobby' | 'startup' | 'industrial') => {
    setOnboarding({
      isCompleted: true,
      workspaceName,
      useCase,
      experienceLevel: 'intermediate'
    });
    setOrganization({
      id: 'org_' + Math.random().toString(36).substring(2, 9),
      name: workspaceName,
      slug: workspaceName.toLowerCase().replace(/\s+/g, '-'),
      plan: 'free',
      deviceLimit: 5,
      devicesCount: 3,
      role: 'owner'
    });
  };

  const logout = () => {
    setUser(null);
    storage.remove('user');
  };

  const updateUserRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const isAuthenticated = !!user && user.isEmailVerified;

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        onboarding,
        isAuthenticated,
        login,
        register,
        verifyOtp,
        completeOnboarding,
        logout,
        updateUserRole,
        pendingEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
