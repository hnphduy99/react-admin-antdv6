// Query Keys
export { queryKeys } from "./queryKeys";

// Auth
export {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation
} from "./useAuthQueries";

// Dashboard
export { useDashboardStats, useDashboardActivities } from "./useDashboardQueries";

// Users
export { useUserList, useUserById, useCreateUser, useUpdateUser, useDeleteUser } from "./useUserQueries";
export type { UserListParams } from "./useUserQueries";

// Products
export {
  useProductList,
  useProductById,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct
} from "./useProductQueries";
export type { ProductListParams } from "./useProductQueries";

// Roles
export {
  useRolesList,
  useRolesById,
  useDefaultPermissions,
  useCreateRoles,
  useUpdateRoles,
  useDeleteRoles
} from "./useRolesQueries";
export type { RolesListParams } from "./useRolesQueries";

// Profile
export { useProfile, useUpdateProfile, useChangePassword, useUpdateAvatar } from "./useProfileQueries";

// Notifications
export { useNotifications, useMarkAsRead, useMarkAllAsRead } from "./useNotificationQueries";

// Options
export { useRolesOptions } from "./useOptionsQueries";
