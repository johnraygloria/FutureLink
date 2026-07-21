// Reads the logged-in user that the login flow persists in localStorage.
// There is no shared auth context yet, so components read it here.
export interface CurrentUser {
  id?: number;
  hr_department?: string;
  full_name?: string;
  role?: number;
}

export function getCurrentUser(): CurrentUser | null {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    return JSON.parse(stored) as CurrentUser;
  } catch {
    return null;
  }
}

// Admin = role 0 (see server/config/roles.js) or the "Admin" department.
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 0 || user?.hr_department === 'Admin';
}
