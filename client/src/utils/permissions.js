// Define permissions for different roles
const permissions = {
  student: ['view_own_sessions', 'book_sessions', 'submit_reviews'],
  tutor: ['manage_sessions', 'view_own_sessions', 'create_sessions'],
  admin: ['view_reports', 'manage_users', 'manage_sessions', 'view_own_sessions']
};

// Check if a user has a specific permission
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  return permissions[user.role]?.includes(permission) || false;
};

// Check if a user has any of the given permissions
export const hasAnyPermission = (user, permissionList) => {
  if (!user || !user.role) return false;
  return permissionList.some(permission => hasPermission(user, permission));
};

// Check if a user has all of the given permissions
export const hasAllPermissions = (user, permissionList) => {
  if (!user || !user.role) return false;
  return permissionList.every(permission => hasPermission(user, permission));
};

// Get all permissions for a role
export const getRolePermissions = (role) => {
  return permissions[role] || [];
}; 