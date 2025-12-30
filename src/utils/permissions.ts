import type { ResourceAction, UserPermission } from "@/types/permissions";
import { getUserPermissions } from "./redux";
import { DEFAULT_PERMISSION } from "@/constants/constants";

const fullAccess: ResourceAction = {
  index: true,
  create: true,
  edit: true,
  delete: true,
  show: true,
  export: true
};

/**
 * Check permission based on resource and action
 * @param resource - Resource name
 * @param action - Action to check (default to showMenu)
 * @param defaultIfMissing - Whether to allow access if resource/permissions list is missing
 * @returns boolean indicating if user has permission
 */
export const hasActionPermission = (
  resource?: string,
  action: keyof ResourceAction = "showMenu",
  defaultIfMissing = DEFAULT_PERMISSION
): boolean => {
  if (!resource) return defaultIfMissing;

  const rawPermissions = getUserPermissions();
  if (!rawPermissions) return defaultIfMissing;

  let permissions: UserPermission[];

  try {
    permissions = Array.isArray(rawPermissions) ? rawPermissions : JSON.parse(rawPermissions);
  } catch {
    return defaultIfMissing;
  }

  if (!Array.isArray(permissions)) return defaultIfMissing;

  return permissions.find((p) => p.name === resource)?.actions?.[action] ?? defaultIfMissing;
};

/**
 * Get permission by resource
 * @param resource - Resource name
 * @param defaultFullAccess - Whether to allow access if resource/permissions list is missing
 * @returns permission object or undefined
 */
export const getPermissionByResource = (
  resource?: string,
  defaultFullAccess = DEFAULT_PERMISSION
): ResourceAction | undefined => {
  const fallback = defaultFullAccess ? fullAccess : undefined;
  if (!resource) return fallback;

  const rawPermissions = getUserPermissions();
  if (!rawPermissions) return fallback;

  let permissions: UserPermission[];

  try {
    permissions = Array.isArray(rawPermissions) ? rawPermissions : JSON.parse(rawPermissions);
  } catch {
    return fallback;
  }

  if (!Array.isArray(permissions)) return fallback;

  return permissions.find((p) => p.name === resource)?.actions ?? fallback;
};
