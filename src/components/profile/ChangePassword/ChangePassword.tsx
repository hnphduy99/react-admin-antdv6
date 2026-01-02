import { useState } from "react";
import { Card, Form, Input, Button, Progress } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { profileApi } from "@/apis/profile.api";
import { useNotification } from "@/providers/NotificationProvider";

export const ChangePassword = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const notification = useNotification();

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
    console.log("Change password:", values);
    try {
      const response = await profileApi.changePassword(
        values.currentPassword,
        values.newPassword,
        values.confirmPassword
      );
      if (response.data === 200) {
        notification.success({
          title: t("common.success"),
          description: t("password.passwordChanged")
        });
        form.resetFields();
        setPasswordStrength(0);
      } else {
        notification.error({
          title: t("common.error"),
          description: Array.isArray(response?.data) ? response.data.join(", ") : response.message
        });
      }
    } catch (error: any) {
      notification.error({
        title: t("common.error"),
        description: error?.message || t("common.updateFailed")
      });
    }
  };

  return (
    <Card title={t("password.changePassword")} className="shadow-sm">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={t("password.currentPassword")}
          name="currentPassword"
          rules={[{ required: true, message: t("validation.passwordRequired") }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t("password.enterCurrent")} />
        </Form.Item>

        <Form.Item
          label={t("password.newPassword")}
          name="newPassword"
          rules={[
            { required: true, message: t("validation.passwordRequired") },
            { min: 6, message: t("password.requirements") }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("password.enterNew")}
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
            <Progress percent={passwordStrength} strokeColor={getStrengthColor(passwordStrength)} showInfo={false} />
          </div>
        )}

        <Form.Item
          label={t("password.confirmNewPassword")}
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: t("validation.passwordRequired") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("validation.passwordMismatch")));
              }
            })
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t("password.confirmNew")} />
        </Form.Item>

        <Form.Item>
          <div className="flex gap-3 mt-2">
            <Button type="primary" htmlType="submit">
              {t("password.changePassword")}
            </Button>
            <Button htmlType="reset">{t("common.reset")}</Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChangePassword;
