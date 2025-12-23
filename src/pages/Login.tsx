import { authApi } from "@/apis/auth.api";
import { useAppDispatch } from "@/hooks/useRedux";
import { useNotification } from "@/providers/NotificationProvider";
import { login } from "@/store/slices/authSlice";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const { Text } = Typography;

interface LoginFormValues {
  tai_khoan: string;
  mat_khau: string;
  remember: boolean;
}

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      // Call API to authenticate
      const response = await authApi.login(values.tai_khoan, values.mat_khau);

      if (response.code === 200) {
        dispatch(login(response.data));

        notification.success({
          title: "Login successful!",
          message: response.message || "Login successful!"
        });
        navigate("/dashboard");
      } else {
        notification.error({
          title: "Login failed!",
          message: response.message || "Login failed. Please try again."
        });
      }
    } catch (error: any) {
      notification.error({
        title: "Login failed!",
        message: error.message || "Login failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{t("common.welcome")}</h2>
        <Text type="secondary">Sign in to your account to continue</Text>
      </div>

      <Form form={form} name="login" onFinish={handleLogin} layout="vertical" initialValues={{ remember: true }}>
        <Form.Item
          name="tai_khoan"
          label={t("auth.user_name")}
          rules={[{ required: true, message: `Please input your ${t("auth.user_name").toLowerCase()}` }]}
        >
          <Input prefix={<UserOutlined />} placeholder={t("auth.user_name")} size="large" />
        </Form.Item>

        <Form.Item
          name="mat_khau"
          label={t("auth.password")}
          rules={[{ required: true, message: `Please input your ${t("auth.password").toLowerCase()}` }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t("auth.password")} size="large" />
        </Form.Item>

        <Form.Item>
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to="/reset-password" className="text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Sign In
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text type="secondary">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </Text>
        </div>
      </Form>
    </Card>
  );
};
