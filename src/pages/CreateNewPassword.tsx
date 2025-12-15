import { useState } from "react";
import { Card, Form, Input, Button, message, Progress, Result } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { mockApi } from "@/services/mock";

export const CreateNewPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getStrengthText = (strength: number): string => {
    if (strength < 40) return t("password.weak");
    if (strength < 70) return t("password.medium");
    return t("password.strong");
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 40) return "#ff4d4f";
    if (strength < 70) return "#faad14";
    return "#52c41a";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // Call API to reset password with token
      const response = await mockApi.auth.resetPassword(token || "", values.password);

      if (response.success) {
        message.success(response.message || t("password.passwordReset"));
        setSuccess(true);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <Result
              status="success"
              title={t("password.passwordReset")}
              subTitle="Your password has been successfully reset. You can now login with your new password."
              extra={[
                <Button type="primary" key="login" onClick={() => navigate("/login")} size="large">
                  Go to Login
                </Button>
              ]}
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{t("common.admin")}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t("common.subtitle")}</p>
        </div>

        <Card title={t("password.createNewPassword")} className="shadow-xl">
          {token ? (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✓ Password reset link verified. Please create your new password below.
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                ⚠ No reset token found. Please request a new password reset link.
              </p>
            </div>
          )}

          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} disabled={!token}>
            <Form.Item
              label={t("password.newPassword")}
              name="password"
              rules={[
                { required: true, message: t("validation.passwordRequired") },
                { min: 6, message: t("password.requirements") }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t("password.enterNew")}
                size="large"
                onChange={handlePasswordChange}
              />
            </Form.Item>

            {passwordStrength > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{t("password.passwordStrength")}</span>
                  <span className="text-sm font-medium" style={{ color: getStrengthColor(passwordStrength) }}>
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
                <Progress
                  percent={passwordStrength}
                  strokeColor={getStrengthColor(passwordStrength)}
                  showInfo={false}
                />
              </div>
            )}

            <Form.Item
              label={t("password.confirmNewPassword")}
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: t("validation.passwordRequired") },
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
              <Input.Password prefix={<LockOutlined />} placeholder={t("password.confirmNew")} size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                {t("password.createNewPassword")}
              </Button>
            </Form.Item>

            <div className="text-center mt-4">
              <Button type="link" onClick={() => navigate("/login")}>
                Back to Login
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};
