import { useState } from "react";
import { Card, Form, Input, Button, Checkbox, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/hooks/useRedux";
import { login } from "@/store/slices/authSlice";
import { mockApi } from "@/services/mock";

const { Text } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setLoading(true);

      // Call API to register
      const response = await mockApi.auth.register(values.name, values.email, values.password);

      if (response.success) {
        // Auto-login after successful registration
        dispatch(
          login({
            ...response.data.user,
            token: response.data.token
          })
        );

        message.success(response.message || t("auth.registerSuccess"));
        navigate("/dashboard");
      }
    } catch (error: any) {
      message.error(error.message || t("validation.registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{t("auth.createAccount")}</h2>
        <Text type="secondary">{t("auth.signUpSubtitle")}</Text>
      </div>

      <Form form={form} name="register" onFinish={handleRegister} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label={t("auth.fullName")}
          rules={[{ required: true, message: t("validation.nameRequired") }]}
        >
          <Input prefix={<UserOutlined />} placeholder={t("auth.namePlaceholder")} size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("auth.email")}
          rules={[
            { required: true, message: t("validation.emailRequired") },
            { type: "email", message: t("validation.emailInvalid") }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder={t("auth.emailPlaceholder")} size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label={t("auth.password")}
          rules={[
            { required: true, message: t("validation.passwordRequired") },
            { min: 6, message: t("validation.passwordMin") }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("auth.createPasswordPlaceholder")}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t("auth.confirmPassword")}
          dependencies={["password"]}
          rules={[
            { required: true, message: t("validation.confirmPasswordRequired") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("validation.passwordMismatch")));
              }
            })
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error(t("validation.termsRequired")))
            }
          ]}
        >
          <Checkbox>{t("auth.agreeTerms")}</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            {t("auth.createAccount")}
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text type="secondary">
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              {t("auth.signIn")}
            </Link>
          </Text>
        </div>
      </Form>
    </Card>
  );
};
