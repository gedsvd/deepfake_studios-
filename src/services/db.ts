/**
 * SQLite3-emulated storage client using LocalStorage for persistent user accounts
 * Matches users schema: id, name, city, email UNIQUE, mobile, password
 */

import { User } from '../types';

const STORAGE_KEY_USERS = 'deepfake_platform_users_v1';
const STORAGE_KEY_SESSION = 'deepfake_platform_session_v1';

export const ADMIN_EMAIL = 'admin@admin.com';
export const ADMIN_PASS = 'admin123@admin.com';

const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Administrator',
    city: 'Washington DC',
    email: 'admin@admin.com',
    mobile: '+1 (202) 555-0199',
    password: 'admin123@admin.com',
    role: 'admin',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    city: 'San Francisco',
    email: 'sarah.chen@biometric.ai',
    mobile: '+1 (415) 555-0142',
    password: 'user123',
    role: 'user',
    createdAt: '2026-09-12T14:32:00Z',
  },
  {
    id: 3,
    name: 'Alex Rivera',
    city: 'New York',
    email: 'alex.r@forensics.org',
    mobile: '+1 (212) 555-0188',
    password: 'user123',
    role: 'user',
    createdAt: '2026-09-18T09:15:00Z',
  },
  {
    id: 4,
    name: 'Dr. Marcus Vance',
    city: 'London',
    email: 'm.vance@neuraltech.io',
    mobile: '+44 20 7946 0912',
    password: 'user123',
    role: 'user',
    createdAt: '2026-09-24T16:45:00Z',
  },
];

// Initialize users database in localStorage if not already present
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read users from storage', e);
    return INITIAL_USERS;
  }
}

function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to storage', e);
  }
}

/**
 * Register a new user (with UNIQUE email check)
 */
export function registerUser(userData: {
  name: string;
  city: string;
  email: string;
  mobile: string;
  password: string;
}): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();

  // Check unique email
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, error: 'Email already registered.' };
  }

  const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const newUser: User = {
    id: nextId,
    name: userData.name.trim(),
    city: userData.city.trim(),
    email: normalizedEmail,
    mobile: userData.mobile.trim(),
    password: userData.password,
    role: normalizedEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

/**
 * Verify credentials and authenticate user/admin
 */
export function authenticateUser(
  email: string,
  pass: string
): { success: boolean; user?: User; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();

  // Admin special shortcut / credentials verification
  if (normalizedEmail === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASS) {
    const users = getUsers();
    let admin = users.find(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (!admin) {
      admin = {
        id: 1,
        name: 'Administrator',
        city: 'HQ Command',
        email: ADMIN_EMAIL,
        mobile: '+1 (202) 555-0199',
        password: ADMIN_PASS,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      users.unshift(admin);
      saveUsers(users);
    }
    setSession(admin);
    return { success: true, user: admin };
  }

  const users = getUsers();
  const found = users.find(
    u => u.email.toLowerCase() === normalizedEmail && u.password === pass
  );

  if (found) {
    setSession(found);
    return { success: true, user: found };
  }

  return { success: false, error: 'Invalid credentials.' };
}

/**
 * Delete a user by ID (Admin operation)
 */
export function deleteUser(userId: number): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== userId);
  if (filtered.length !== users.length) {
    saveUsers(filtered);
    return true;
  }
  return false;
}

/**
 * Session persistence
 */
export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setSession(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to set session', e);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}
