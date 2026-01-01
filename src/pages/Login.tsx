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
          title: t("auth.loginSuccess")
        });
        navigate("/dashboard");
      } else {
        notification.error({
          title: response.message || t("auth.loginFailed")
        });
      }
    } catch (error: any) {
      notification.error({
        title: error.message || t("auth.loginFailed")
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{t("common.welcome")}</h2>
        <Text type="secondary">{t("auth.signInSubtitle")}</Text>
      </div>

      <Form form={form} name="login" onFinish={handleLogin} layout="vertical" initialValues={{ remember: true }}>
        <Form.Item
          name="tai_khoan"
          label={t("auth.username")}
          rules={[{ required: true, message: `${t("common.pleaseInput")} ${t("auth.username").toLowerCase()}` }]}
        >
          <Input prefix={<UserOutlined />} placeholder={t("auth.username")} size="large" />
        </Form.Item>

        <Form.Item
          name="mat_khau"
          label={t("auth.password")}
          rules={[{ required: true, message: `${t("common.pleaseInput")} ${t("auth.password").toLowerCase()}` }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t("auth.password")} size="large" />
        </Form.Item>

        <Form.Item>
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>{t("auth.rememberMe")}</Checkbox>
            </Form.Item>
            <Link to="/reset-password" className="text-primary-600 hover:text-primary-700">
              {t("auth.forgotPassword")}
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            {t("auth.signIn")}
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text type="secondary">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              {t("auth.signUp")}
            </Link>
          </Text>
        </div>
      </Form>
    </Card>
  );
};

export default Login;
