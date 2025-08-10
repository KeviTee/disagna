export type Role = 'student' | 'editor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  plan?: string;
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  institution: string;
  programme: string;
  supervisor: string;
  deadlines: string[];
  status: string;
}

export interface Section {
  id: string;
  projectId: string;
  key: string;
  content: string;
  notes: string;
  status: string;
}

export interface Plan {
  id: string;
  userId: string;
  tier: string;
  provider: string;
  renewalDate: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
}

export interface AIEvent {
  id: string;
  userId: string;
  projectId: string;
  sectionId: string;
  tokens: number;
  cost: number;
  type: string;
}
