/**
 * Centralized TanStack Query keys factory
 * Dùng factory pattern để dễ invalidate từng phần của cache
 */

export const queryKeys = {
  // Auth
  auth: {
    all: ["auth"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const
  },

  // Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    activities: (limit?: number) => [...queryKeys.dashboard.all, "activities", { limit }] as const
  },

  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string | number) => [...queryKeys.users.details(), id] as const
  },

  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string | number) => [...queryKeys.products.details(), id] as const
  },

  // Roles
  roles: {
    all: ["roles"] as const,
    lists: () => [...queryKeys.roles.all, "list"] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.roles.lists(), params] as const,
    details: () => [...queryKeys.roles.all, "detail"] as const,
    detail: (id: string | number) => [...queryKeys.roles.details(), id] as const,
    defaultPermissions: () => [...queryKeys.roles.all, "default-permissions"] as const,
    options: () => [...queryKeys.roles.all, "options"] as const
  },

  // Profile
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: () => [...queryKeys.notifications.all, "list"] as const
  }
};
