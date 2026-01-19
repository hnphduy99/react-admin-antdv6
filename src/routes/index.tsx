import ProfileLayout from "@/components/profile/ProfileLayout";
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
const PersonalInfoPage = lazy(() => import("@/pages/PersonalInfoPage"));
const ProductListPage = lazy(() => import("@/pages/products/ProductList"));
const UserListPage = lazy(() => import("@/pages/users/UserList"));
const ProductFormPage = lazy(() => import("@/pages/products/ProductFormPage"));
const ChangePasswordPage = lazy(() => import("@/pages/ChangePasswordPage"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const NotificationPageContent = lazy(() => import("@/pages/ui/NotificationPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const FirstLoginPage = lazy(() => import("@/components/auth/FirstLogin/FirstLogin"));
const RolesPage = lazy(() => import("@/pages/roles/RolesList"));
/*import-component-here*/

const Dashboard = withLoading(DashboardPage);
const Login = withLoading(LoginPage);
const Register = withLoading(RegisterPage);
const ResetPassword = withLoading(ResetPasswordPage);
const CreateNewPassword = withLoading(CreateNewPasswordPage);
const FormExample = withLoading(FormExamplePage);
const PersonalInfo = withLoading(PersonalInfoPage);
const ProductList = withLoading(ProductListPage);
const UserList = withLoading(UserListPage);
const ProductForm = withLoading(ProductFormPage);
const ChangePassword = withLoading(ChangePasswordPage);
const Settings = withLoading(SettingsPage);
const NotificationPage = withLoading(NotificationPageContent);
const NotFound = withLoading(NotFoundPage);
const FirstLogin = withLoading(FirstLoginPage);
const RolesList = withLoading(RolesPage);
/*import-component-with-loading-here*/

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTE.LOGIN} replace />;
  }

  if (user?.need_change_password === 1 && window.location.pathname !== ROUTE.FIRST_LOGIN) {
    return <Navigate to={ROUTE.FIRST_LOGIN} replace />;
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
    return <Navigate to={ROUTE.NOT_FOUND} replace />;
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
          <Route path={ROUTE.REGISTER} element={<Register />} />
          <Route path={ROUTE.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTE.CREATE_PASSWORD + "/:token"} element={<CreateNewPassword />} />
          <Route
            path={ROUTE.FIRST_LOGIN}
            element={
              <ProtectedRoute>
                <FirstLogin />
              </ProtectedRoute>
            }
          />
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
          <Route path={ROUTE.PROFILE} element={<ProfileLayout />}>
            <Route path={`${ROUTE.PROFILE}/${ROUTE.PERSONAL_INFO}`} element={<PersonalInfo />} />
            <Route path={`${ROUTE.PROFILE}/${ROUTE.CHANGE_PASSWORD}`} element={<ChangePassword />} />
          </Route>
          <Route path="/products">
            <Route
              index
              element={
                <PermissionRoute permissionKey="products">
                  <ProductList />
                </PermissionRoute>
              }
            />
            <Route
              path="create"
              element={
                <PermissionRoute permissionKey="products" action="create">
                  <ProductForm />
                </PermissionRoute>
              }
            />
            <Route
              path="edit/:id"
              element={
                <PermissionRoute permissionKey="products" action="edit">
                  <ProductForm />
                </PermissionRoute>
              }
            />
          </Route>
          <Route
            path={ROUTE.USER}
            element={
              <PermissionRoute permissionKey={RESOURCE.USER}>
                <UserList />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTE.ROLES}
            element={
              <PermissionRoute permissionKey={RESOURCE.ROLES}>
                <RolesList />
              </PermissionRoute>
            }
          />
          {/*Declare route here*/}
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
