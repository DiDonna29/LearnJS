
// src/lib/types.ts
import type { USER_ROLES } from "./constants"; // Ensure USER_ROLES is imported

// Type for roles, derived from USER_ROLES object keys
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User { // Represents Firebase Auth User structure primarily
  id: string; // Firebase UID
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  // role is typically stored in your Firestore 'users' document, not directly in Auth user object
  // createdAt & updatedAt also from Firestore document
}

// For data stored in your Firestore 'users' collection
export interface UserProfileData {
  id: string; // Firebase UID, same as User.id
  displayName: string;
  email: string; // Can be denormalized here
  photoURL: string | null;
  role: UserRole;
  address: string;
  createdAt: Date;
  updatedAt?: Date;
}

// For updating user profile via server action
export interface UserProfileUpdateData {
  displayName?: string;
  address?: string;
  photoURL?: string | null; // If allowing photoURL updates
}


export interface Course {
  id: string;
  title: string;
  description: string;
  displayOrder?: number;
  contentLink?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  iconName?: string;
  displayOrder?: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'Article' | 'Tutorial' | 'Documentation'; // Keep as specific enum/union
  source: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  category: string;
  externalLink?: string;
  createdAt?: Date; // Firestore Timestamps will be converted to Date
}

export interface UserProgress {
  id: string; // UUID for the progress record itself
  userId: string; // Foreign Key to User.id
  courseId: string; // Foreign Key to Course.id
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  startedAt?: Date;
  completedAt?: Date;
  updatedAt?: Date;
}

export interface AiLearningPath {
  id?: string; // Optional: Firestore will auto-generate if not provided on creation
  userId: string; // Foreign Key to User.id
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  careerGoals: string;
  suggestedPath: string;
  savedAt: Date; // Firestore Timestamps will be converted to Date
}

export interface SubscriptionType {
  id: string; // e.g., 'simple', 'pro'
  name: string; // "Simple User", "PRO User"
  monthlyPrice: number;
  description?: string;
}
