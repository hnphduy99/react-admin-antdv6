import { useState } from "react";
import { Card, Form, Input, Button, Checkbox, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useRedux";
import { login } from "@/store/slices/authSlice";
import { useTranslation } from "react-i18next";
import { mockApi } from "@/services/mock";

const { Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      // Call API to authenticate
      const response = await mockApi.auth.login(values.email, values.password);

      if (response.success) {
        // Dispatch to Redux store
        dispatch(
          login({
            ...response.data.user,
            token: response.data.token
          })
        );

        message.success(response.message || "Login successful!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      message.error(error.message || "Login failed. Please try again.");
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

      <Form
        form={form}
        name="login"
        onFinish={handleLogin}
        layout="vertical"
        requiredMark={false}
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="admin@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" size="large" />
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
