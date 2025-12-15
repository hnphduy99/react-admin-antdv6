import { UserRole, Permission, rolePermissions, menuPermissions } from "@/types/permissions";

/**
 * Check if a role has a specific permission
 * @param role - User role
 * @param permission - Permission to check
 * @returns boolean indicating if role has permission
 */
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
};

/**
 * Check if user has a specific role
 * @param userRole - User's current role
 * @param requiredRole - Required role to check
 * @returns boolean indicating if user has the required role
 */
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  // Role hierarchy: Admin > Moderator > User
  const roleHierarchy = {
    [UserRole.ADMIN]: 3,
    [UserRole.MODERATOR]: 2,
    [UserRole.USER]: 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Check if user can access a specific route
 * @param role - User role
 * @param path - Route path
 * @returns boolean indicating if user can access the route
 */
export const canAccessRoute = (role: UserRole, path: string): boolean => {
  const requiredPermissions = menuPermissions[path];

  // If no permissions required, everyone can access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // Check if user has at least one of the required permissions
  const userPermissions = rolePermissions[role] || [];
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
};

/**
 * Get all accessible routes for a role
 * @param role - User role
 * @returns Array of accessible route paths
 */
export const getAccessibleRoutes = (role: UserRole): string[] => {
  return Object.keys(menuPermissions).filter((path) => canAccessRoute(role, path));
};

/**
 * Check if user has any of the provided permissions
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if user has at least one permission
 */
export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
  const userPermissions = rolePermissions[role] || [];
  return permissions.some((permission) => userPermissions.includes(permission));
};

/**
 * Check if user has all of the provided permissions
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if user has all permissions
 */
export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
  const userPermissions = rolePermissions[role] || [];
  return permissions.every((permission) => userPermissions.includes(permission));
};
