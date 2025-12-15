import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export const AuthLayout = () => {
  return (
    <Layout className="h-screen">
      <Content className="flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Modern Admin Dashboard Template</p>
          </div>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};
