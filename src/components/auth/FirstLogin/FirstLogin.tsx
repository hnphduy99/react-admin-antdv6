import { profileApi } from "@/apis/profile.api";
import { ROUTE } from "@/configs/route-config";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useNotification } from "@/providers/NotificationProvider";
import { updateUser } from "@/store/slices/authSlice";
import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Progress, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const FirstLogin = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user.need_change_password !== 1) {
      navigate(ROUTE.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

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
    setLoading(true);
    try {
      const response = await profileApi.changePassword(
        values.currentPassword,
        values.newPassword,
        values.confirmPassword
      );

      // Check for success using code or status
      if (response.code === 200 || response.status === true) {
        notification.success({
          title: t("common.success"),
          description: t("password.passwordChanged")
        });

        // Update user state in redux
        dispatch(updateUser({ need_change_password: 0 }));

        // Redirect to dashboard
        navigate(ROUTE.DASHBOARD, { replace: true });
      } else {
        notification.error({
          title: t("common.error"),
          description: response.message || t("common.updateFailed")
        });
      }
    } catch (error: any) {
      notification.error({
        title: t("common.error"),
        description: error?.response?.data?.message || error?.message || t("common.updateFailed")
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{t("password.firstLoginTitle") || "Đổi mật khẩu lần đầu"}</h2>
        <Text type="secondary">{t("password.firstLoginSubtitle")}</Text>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          label={t("password.currentPassword")}
          name="currentPassword"
          rules={[{ required: true, message: t("validation.passwordRequired") }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder={t("password.enterCurrent")}
          />
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
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder={t("password.enterNew") || "Nhập mật khẩu mới"}
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
            { required: true, message: t("validation.passwordRequired") || "Vui lòng nhập mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("validation.passwordMismatch") || "Mật khẩu không khớp"));
              }
            })
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder={t("password.confirmNew") || "Nhập lại mật khẩu mới"}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 10 }}>
          <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 45, borderRadius: 8 }}>
            {t("password.updateAndContinue") || "Cập nhật và Tiếp tục"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FirstLogin;
