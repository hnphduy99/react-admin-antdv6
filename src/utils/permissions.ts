import type { ResourceAction, UserPermission } from "@/types/permissions";

/**
 * Check permission based on resource and action (New system)
 * @param permissionsList - List of user permissions (from phan_quyen)
 * @param resource - Resource name
 * @param action - Action to check (default to showMenu)
 * @param defaultIfMissing - Whether to allow access if resource/permissions list is missing (default: false)
 * @returns boolean indicating if user has permission
 */
export const hasActionPermission = (
  permissionsList: UserPermission[] | string | null | undefined,
  resource: string | undefined,
  action: keyof ResourceAction = "showMenu",
  defaultIfMissing: boolean = false
): boolean => {
  if (!permissionsList || !resource) return defaultIfMissing;

  let permissions: UserPermission[] = [];
  try {
    permissions = typeof permissionsList === "string" ? JSON.parse(permissionsList) : permissionsList;
  } catch {
    return defaultIfMissing;
  }

  if (!Array.isArray(permissions)) return defaultIfMissing;

  const resourcePermission = permissions.find((p) => p.name === resource);
  if (!resourcePermission) return defaultIfMissing;

  const actionValue = resourcePermission.actions[action];
  // If action is not defined in the resource's actions, use the default
  if (actionValue === undefined) return defaultIfMissing;

  return !!actionValue;
};
