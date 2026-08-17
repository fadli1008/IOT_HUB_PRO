import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, OnboardingState, UserRole } from '../types/auth';
import { storage } from '../utils/storage';

interface PendingRegistration {
  name: string;
  email: string;
  password?: string;
  otpCode: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  onboarding: OnboardingState;
  isAuthenticated: boolean;
  allUsers: User[];
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; requiresOtp: boolean; generatedOtp: string }>;
  verifyOtp: (code: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'github', emailOrUser: string) => Promise<boolean>;
  completeOnboarding: (workspaceName: string, useCase: 'hobby' | 'startup' | 'industrial') => void;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
  pendingEmail: string | null;
  pendingOtp: string | null;
  // User Management
  addUser: (name: string, email: string, role: UserRole, deviceLimit?: number, password?: string) => void;
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
  email: 'muhamadfadli10.mf@gmail.com',
  password: 'admin123',
  avatarUrl: 'https://avatars.githubusercontent.com/u/fadli1008',
  role: 'owner',
  isEmailVerified: true,
  createdAt: '2026-08-01T00:00:00Z',
  status: 'active',
  deviceLimit: 500,
  devicesCount: 8,
  lastLogin: 'Just now'
};

const INITIAL_ADMIN_ALIAS: User = {
  id: 'usr_admin_alias',
  name: 'Super Admin',
  email: 'admin@iothub.local',
  password: 'admin123',
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
  INITIAL_ADMIN_ALIAS,
  {
    id: 'usr_sarah_02',
    name: 'Sarah Connor',
    email: 'sarah.engineer@factory.io',
    password: 'password123',
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
    password: 'password123',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=budi',
    role: 'operator',
    isEmailVerified: true,
    createdAt: '2026-08-10T14:15:00Z',
    status: 'active',
    deviceLimit: 15,
    devicesCount: 2,
    lastLogin: 'Yesterday'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.get('user', null));
  const [allUsers, setAllUsers] = useState<User[]>(() => storage.get('all_users', INITIAL_USERS));
  const [organization, setOrganization] = useState<Organization | null>(() => storage.get('org', DEFAULT_ORG));
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => 
    storage.get('onboarding', { isCompleted: false, workspaceName: "My IoT Workspace", useCase: 'hobby', experienceLevel: 'beginner' })
  );
  const [pendingReg, setPendingReg] = useState<PendingRegistration | null>(() => storage.get('pending_reg', null));

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

  useEffect(() => {
    if (pendingReg) storage.set('pending_reg', pendingReg);
    else storage.remove('pending_reg');
  }, [pendingReg]);

  // =========================================================================
  // 1. STRICT SIGN IN (Must be registered with correct password)
  // =========================================================================
  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      throw new Error('Silakan masukkan alamat email Anda.');
    }

    if (!password) {
      throw new Error('Silakan masukkan password akun Anda.');
    }

    // Find account in registered users database
    const foundUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      throw new Error('Akun dengan email ini belum terdaftar. Silakan klik "Sign Up for Free" untuk membuat akun baru.');
    }

    // Check account status
    if (foundUser.status === 'suspended') {
      throw new Error('Akun Anda dinonaktifkan (suspended) oleh Super Admin. Hubungi administrator.');
    }

    // Check password
    if (foundUser.password && foundUser.password !== password) {
      throw new Error('Password yang Anda masukkan salah. Silakan coba lagi.');
    }

    // Successful Login
    const updatedUser = { ...foundUser, lastLogin: 'Just now' };
    setUser(updatedUser);

    const isSuper = foundUser.role === 'owner';
    setOrganization({
      id: 'org_' + foundUser.id,
      name: isSuper ? "Muhamad Fadli's Enterprise Hub" : `${foundUser.name}'s Workspace`,
      slug: foundUser.name.toLowerCase().replace(/\s+/g, '-'),
      plan: isSuper ? 'enterprise' : foundUser.role === 'admin' ? 'pro' : 'free',
      deviceLimit: foundUser.deviceLimit || 5,
      devicesCount: foundUser.devicesCount || 0,
      role: foundUser.role
    });

    return true;
  };

  // =========================================================================
  // 2. SIGN UP / REGISTRATION (Generates 6-Digit OTP)
  // =========================================================================
  const register = async (name: string, email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail || !password) {
      throw new Error('Semua kolom (Nama, Email, Password) wajib diisi.');
    }

    if (password.length < 6) {
      throw new Error('Password minimal harus 6 karakter demi keamanan akun.');
    }

    // Check if email already registered
    const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('Email ini sudah terdaftar. Silakan Sign In menggunakan akun Anda.');
    }

    // Generate unique 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const regData: PendingRegistration = {
      name: cleanName,
      email: cleanEmail,
      password,
      otpCode: generatedOtp
    };

    setPendingReg(regData);
    return { success: true, requiresOtp: true, generatedOtp };
  };

  // =========================================================================
  // 3. OTP VERIFICATION (Creates account only after valid OTP)
  // =========================================================================
  const verifyOtp = async (code: string): Promise<boolean> => {
    if (!pendingReg) {
      throw new Error('Sesi pendaftaran telah kedaluwarsa. Silakan lakukan registrasi ulang.');
    }

    const cleanCode = code.trim();

    // Verify OTP code (or universal demo code 123456)
    if (cleanCode !== pendingReg.otpCode && cleanCode !== '123456') {
      throw new Error('Kode OTP tidak valid. Silakan masukkan 6 digit kode yang sesuai.');
    }

    // Create new verified user in database
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: pendingReg.name,
      email: pendingReg.email,
      password: pendingReg.password,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${pendingReg.email}`,
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

    // Set new user organization and trigger Onboarding Wizard
    setOrganization({
      id: 'org_' + newUser.id,
      name: `${newUser.name}'s Workspace`,
      slug: newUser.name.toLowerCase().replace(/\s+/g, '-'),
      plan: 'free',
      deviceLimit: 5,
      devicesCount: 0,
      role: 'operator'
    });

    setOnboarding({
      isCompleted: false, // Must complete onboarding wizard
      workspaceName: `${newUser.name}'s Workspace`,
      useCase: 'hobby',
      experienceLevel: 'beginner'
    });

    setPendingReg(null);
    storage.remove('pending_reg');
    return true;
  };

  // =========================================================================
  // 4. SOCIAL OAUTH (Google / GitHub with strict registration check)
  // =========================================================================
  const socialLogin = async (provider: 'google' | 'github', emailOrUser: string): Promise<boolean> => {
    const cleanEmail = emailOrUser.trim().toLowerCase();

    // Strict email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error(`Alamat email tidak valid. Silakan masukkan format email yang benar (contoh: nama@${provider === 'google' ? 'gmail.com' : 'domain.com'}).`);
    }

    const targetUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!targetUser) {
      throw new Error(`Akun ${provider.toUpperCase()} (${cleanEmail}) belum terdaftar di IoT Hub Pro. Silakan klik "Sign Up for Free" untuk membuat akun baru terlebih dahulu.`);
    }

    if (targetUser.status === 'suspended') {
      throw new Error('Akun Anda dinonaktifkan (suspended) oleh Super Admin.');
    }

    setUser({ ...targetUser, lastLogin: 'Just now' });
    const isSuper = targetUser.role === 'owner';
    setOrganization({
      id: 'org_' + targetUser.id,
      name: isSuper ? "Muhamad Fadli's Enterprise Hub" : `${targetUser.name}'s Workspace`,
      slug: targetUser.name.toLowerCase().replace(/\s+/g, '-'),
      plan: isSuper ? 'enterprise' : targetUser.role === 'admin' ? 'pro' : 'free',
      deviceLimit: targetUser.deviceLimit || 5,
      devicesCount: targetUser.devicesCount || 0,
      role: targetUser.role
    });

    return true;
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
    storage.remove('onboarding');
  };

  const updateUserRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
  };

  // User Management Actions (Super Admin)
  const addUser = (name: string, email: string, role: UserRole, deviceLimit = 10, password = 'password123') => {
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email: email.trim().toLowerCase(),
      password,
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
        socialLogin,
        completeOnboarding,
        logout,
        updateUserRole,
        pendingEmail: pendingReg?.email || null,
        pendingOtp: pendingReg?.otpCode || null,
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
