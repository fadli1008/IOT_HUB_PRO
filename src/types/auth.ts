export type UserRole = 'owner' | 'admin' | 'operator' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'maker' | 'pro' | 'enterprise';
  deviceLimit: number;
  devicesCount: number;
  role: UserRole;
}

export interface OnboardingState {
  isCompleted: boolean;
  workspaceName: string;
  useCase: 'hobby' | 'startup' | 'industrial';
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
}
