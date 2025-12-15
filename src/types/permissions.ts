/**
 * User roles
 */
export const UserRole = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Permissions
 */
export const Permission = {
  // Dashboard
  VIEW_DASHBOARD: "view_dashboard",

  // Users
  VIEW_USERS: "view_users",
  CREATE_USER: "create_user",
  EDIT_USER: "edit_user",
  DELETE_USER: "delete_user",

  // Content
  VIEW_TABLE: "view_table",
  VIEW_FORM: "view_form",

  // Settings
  VIEW_SETTINGS: "view_settings",
  MANAGE_SETTINGS: "manage_settings",

  // Password
  CHANGE_PASSWORD: "change_password"
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

/**
 * Role-permission mapping
 */
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.DELETE_USER,
    Permission.VIEW_TABLE,
    Permission.VIEW_FORM,
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
    Permission.CHANGE_PASSWORD
  ],
  [UserRole.MODERATOR]: [
    // Moderator has most permissions except user management
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.VIEW_TABLE,
    Permission.VIEW_FORM,
    Permission.VIEW_SETTINGS,
    Permission.CHANGE_PASSWORD
  ],
  [UserRole.USER]: [
    // Regular user has limited permissions
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_TABLE,
    Permission.VIEW_FORM,
    Permission.VIEW_SETTINGS,
    Permission.CHANGE_PASSWORD
  ]
};

/**
 * Menu item permission requirements
 */
export const menuPermissions: Record<string, Permission[]> = {
  "/dashboard": [Permission.VIEW_DASHBOARD],
  "/table": [Permission.VIEW_TABLE],
  "/form": [Permission.VIEW_FORM],
  "/users/list": [Permission.VIEW_USERS],
  "/users/profile": [], // Everyone can view their own profile
  "/change-password": [Permission.CHANGE_PASSWORD],
  "/reset-password": [], // Public route
  "/settings": [Permission.VIEW_SETTINGS]
};
