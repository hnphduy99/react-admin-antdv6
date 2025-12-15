import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
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
          <Route path="/users/profile" element={<UserProfile />} />
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/users/list" element={<UserList />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-password" element={<CreateNewPassword />} />
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
