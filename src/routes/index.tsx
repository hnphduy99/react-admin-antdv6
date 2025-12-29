import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { hasActionPermission } from "@/utils/permissions";
import type { ResourceAction } from "@/types/permissions";
import { MainLayout } from "@/layouts/Main/MainLayout/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { NotFound } from "@/pages/NotFound";
import { TableExample } from "@/pages/TableExample";
import { FormExample } from "@/pages/FormExample";
import { UserProfile } from "@/pages/UserProfile";
import { UserList } from "@/pages/users/UserList";
import { ChangePassword } from "@/pages/ChangePassword";
import { ResetPassword } from "@/pages/ResetPassword";
import { CreateNewPassword } from "@/pages/CreateNewPassword";
import { Settings } from "@/pages/Settings";
import { AuthLayout } from "@/layouts/AuthLayout/AuthLayout";
import { ProductList } from "@/pages/products/ProductList";
import NotificationPage from "@/pages/ui/NotificationPage";

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
  const user = useAppSelector((state) => state.auth.user);
  const { phan_quyen } = user || {};

  if (!permissionKey) return <>{children}</>;

  if (!hasActionPermission(phan_quyen, permissionKey, action)) {
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-password" element={<CreateNewPassword />} />
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
          <Route path="/table" element={<TableExample />} />
          <Route path="/form" element={<FormExample />} />
          <Route
            path="/users/profile"
            element={
              <PermissionRoute permissionKey="profile">
                <UserProfile />
              </PermissionRoute>
            }
          />
          <Route
            path="/products/list"
            element={
              <PermissionRoute permissionKey="products">
                <ProductList />
              </PermissionRoute>
            }
          />
          <Route
            path="/users/list"
            element={
              <PermissionRoute permissionKey="users">
                <UserList />
              </PermissionRoute>
            }
          />
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
