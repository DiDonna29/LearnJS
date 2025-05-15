
// src/lib/types.ts

export interface User {
  id: string; // Typically Firebase UID
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'SIMPLE_USER' | 'PRO_USER' | 'ADMIN' | 'VISITOR';
  createdAt?: Date; // Or string if serialized
  updatedAt?: Date; // Or string if serialized
}

export interface Course {
  id: string;
  title: string;
  description: string;
  displayOrder?: number;
  contentLink?: string;
  // topics?: string[]; // Topics are not currently in constants.ts for mock data
}

export interface Roadmap {
  id: string; // e.g., 'frontend', 'backend'
  title: string;
  description: string;
  courses: Course[];
  iconName?: string; // For UI, e.g., 'MonitorSmartphone'
  displayOrder?: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'Article' | 'Tutorial' | 'Documentation';
  source: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  category: string;
  externalLink?: string; // Link to the actual content
  createdAt?: Date; // Or string
}

export interface UserProgress {
  id: string; // UUID
  userId: string; // Foreign Key to User.id
  courseId: string; // Foreign Key to Course.id
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  startedAt?: Date;
  completedAt?: Date;
  updatedAt?: Date;
}

export interface AiLearningPath {
  id: string; // UUID
  userId: string; // Foreign Key to User.id
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  careerGoals: string;
  suggestedPath: string;
  savedAt: Date;
}

export interface SubscriptionType {
  id: string; // e.g., 'simple', 'pro'
  name: string; // "Simple User", "PRO User"
  monthlyPrice: number;
  description?: string;
}
