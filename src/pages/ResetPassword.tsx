import { Card, Form, Input, Button, message, Result } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { mockApi } from "@/services/mock";

export const ResetPassword = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSendEmail = async (values: any) => {
    try {
      setLoading(true);
      setEmail(values.email);

      // Call API to request password reset
      const response = await mockApi.auth.requestPasswordReset(values.email);

      if (response.success) {
        message.success(response.message || "Reset link sent to your email!");
        setEmailSent(true);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <Result
              status="success"
              title="Email Sent!"
              subTitle={
                <div className="space-y-2">
                  <p>We've sent a password reset link to:</p>
                  <p className="font-semibold text-primary-600">{email}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Please check your inbox and click the link to create a new password. The link will expire in 24
                    hours.
                  </p>
                </div>
              }
              extra={[
                <Button type="primary" key="login" onClick={() => (window.location.href = "/login")}>
                  Back to Login
                </Button>,
                <Button key="resend" onClick={() => setEmailSent(false)}>
                  Resend Email
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

        <Card title={t("password.resetPassword")} className="shadow-xl">
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <Form form={form} layout="vertical" onFinish={onSendEmail} requiredMark={false}>
            <Form.Item
              label={t("auth.email")}
              name="email"
              rules={[
                { required: true, message: t("validation.emailRequired") },
                { type: "email", message: t("validation.emailInvalid") }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="your.email@example.com" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                Send Reset Link
              </Button>
            </Form.Item>

            <div className="text-center">
              <Button type="link" onClick={() => (window.location.href = "/login")}>
                Back to Login
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};
