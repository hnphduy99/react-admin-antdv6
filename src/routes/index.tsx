import { RESOURCE } from "@/configs/api-config";
import { ROUTE } from "@/configs/route-config";
import { withLoading } from "@/hocs/withLoading.hoc";
import { useAppSelector } from "@/hooks/useRedux";
import { AuthLayout } from "@/layouts/AuthLayout/AuthLayout";
import { MainLayout } from "@/layouts/Main/MainLayout/MainLayout";
import type { ResourceAction } from "@/types/permissions";
import { hasActionPermission } from "@/utils/permissions";
import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPassword"));
const CreateNewPasswordPage = lazy(() => import("@/pages/CreateNewPassword"));
const FormExamplePage = lazy(() => import("@/pages/FormExample"));
const UserProfilePage = lazy(() => import("@/pages/UserProfile"));
const ProductListPage = lazy(() => import("@/pages/products/ProductList"));
const UserListPage = lazy(() => import("@/pages/users/UserList"));
const ChangePasswordPage = lazy(() => import("@/pages/ChangePassword"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const NotificationPageContent = lazy(() => import("@/pages/ui/NotificationPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
/*import-component-here*/

const Dashboard = withLoading(DashboardPage);
const Login = withLoading(LoginPage);
const Register = withLoading(RegisterPage);
const ResetPassword = withLoading(ResetPasswordPage);
const CreateNewPassword = withLoading(CreateNewPasswordPage);
const FormExample = withLoading(FormExamplePage);
const UserProfile = withLoading(UserProfilePage);
const ProductList = withLoading(ProductListPage);
const UserList = withLoading(UserListPage);
const ChangePassword = withLoading(ChangePasswordPage);
const Settings = withLoading(SettingsPage);
const NotificationPage = withLoading(NotificationPageContent);
const NotFound = withLoading(NotFoundPage);
/*import-component-with-loading-here*/

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Permission Route wrapper
const PermissionRoute = ({
  permissionKey,
  action = "index",
  children
}: {
  permissionKey?: string;
  action?: keyof ResourceAction;
  children: React.ReactNode;
}) => {
  if (!permissionKey) return <>{children}</>;

  if (!hasActionPermission(permissionKey, action)) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper (redirect to dashboard if already authenticated)
// const PublicRoute = ({ children }: { children: React.ReactNode }) => {
//   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <>{children}</>;
// };

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with AuthLayout */}
        <Route
          element={
            // <PublicRoute>
            <AuthLayout />
            // </PublicRoute>
          }
        >
          <Route path={ROUTE.LOGIN} element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-password/:token" element={<CreateNewPassword />} />
        </Route>

        {/* Protected routes with MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form" element={<FormExample />} />
          <Route path="/users/profile" element={<UserProfile />} />
          <Route
            path="/products"
            element={
              <PermissionRoute permissionKey="products">
                <ProductList />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTE.USER}
            element={
              <PermissionRoute permissionKey={RESOURCE.USER}>
                <UserList />
              </PermissionRoute>
            }
          />
          {/*Declare route here*/}
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="ui">
            <Route path="notification" element={<NotificationPage />} />
          </Route>
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
