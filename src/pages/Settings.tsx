import { Card, Form, Input, Button, Switch, Select, message, Divider, Avatar, Upload, Row, Col, Flex } from "antd";
import {
  UserOutlined,
  MailOutlined,
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  EyeOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { toggleTheme } from "@/store/slices/themeSlice";
import type { UploadProps } from "antd";

const { Option } = Select;

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Settings updated:", values);
    message.success(t("settings.saveSuccess"));
  };

  const handleThemeChange = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    message.success(t("settings.languageChanged"));
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    beforeUpload: () => false,
    onChange(info) {
      message.success(`${info.file.name} file selected`);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {/* Account Settings */}
      <Col span={24}>
        <Card
          title={
            <div className="flex items-center gap-2">
              <UserOutlined />
              <span>{t("user.accountSettings")}</span>
            </div>
          }
          className="shadow-sm"
        >
          <Flex vertical align="center" gap={16}>
            <Avatar size={160} icon={<UserOutlined />} src={user?.avatar} />
            <Upload {...uploadProps} className="mt-4">
              <Button icon={<UploadOutlined />}>{t("settings.changeAvatar")}</Button>
            </Upload>
          </Flex>
          <br />
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: user?.name || "Admin User",
              email: user?.email || "admin@example.com"
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t("auth.fullName")}
                  name="name"
                  rules={[{ required: true, message: t("validation.nameRequired") }]}
                >
                  <Input prefix={<UserOutlined />} size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t("auth.email")}
                  name="email"
                  rules={[
                    { required: true, message: t("validation.emailRequired") },
                    { type: "email", message: t("validation.emailInvalid") }
                  ]}
                >
                  <Input prefix={<MailOutlined />} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                {t("common.save")}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      {/* Notification Settings */}
      <Col span={24}>
        <Card
          title={
            <div className="flex items-center gap-2">
              <BellOutlined />
              <span>{t("settings.notifications")}</span>
            </div>
          }
          className="shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.emailNotifications")}</div>
                <div className="text-sm text-gray-500">{t("settings.emailNotificationsDesc")}</div>
              </div>
              <Switch defaultChecked />
            </div>
            <Divider className="my-3" />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.pushNotifications")}</div>
                <div className="text-sm text-gray-500">{t("settings.pushNotificationsDesc")}</div>
              </div>
              <Switch defaultChecked />
            </div>
            <Divider className="my-3" />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.smsNotifications")}</div>
                <div className="text-sm text-gray-500">{t("settings.smsNotificationsDesc")}</div>
              </div>
              <Switch />
            </div>
            <Divider className="my-3" />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.marketingEmails")}</div>
                <div className="text-sm text-gray-500">{t("settings.marketingEmailsDesc")}</div>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </Col>

      {/* Security & Privacy */}
      <Col span={24}>
        <Card
          title={
            <div className="flex items-center gap-2">
              <LockOutlined />
              <span>{t("settings.security")}</span>
            </div>
          }
          className="shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.twoFactor")}</div>
                <div className="text-sm text-gray-500">{t("settings.twoFactorDesc")}</div>
              </div>
              <Switch />
            </div>
            <Divider className="my-3" />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.sessionTimeout")}</div>
                <div className="text-sm text-gray-500">{t("settings.sessionTimeoutDesc")}</div>
              </div>
              <Select defaultValue="30" className="w-32">
                <Option value="15">15 min</Option>
                <Option value="30">30 min</Option>
                <Option value="60">1 hour</Option>
                <Option value="120">2 hours</Option>
              </Select>
            </div>
            <Divider className="my-3" />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.loginHistory")}</div>
                <div className="text-sm text-gray-500">{t("settings.loginHistoryDesc")}</div>
              </div>
              <Button icon={<EyeOutlined />}>{t("settings.viewHistory")}</Button>
            </div>
          </div>
        </Card>
      </Col>

      {/* Appearance Settings */}
      <Col span={24}>
        <Card
          title={
            <div className="flex items-center gap-2">
              <GlobalOutlined />
              <span>{t("settings.appearance")}</span>
            </div>
          }
          className="shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.darkMode")}</div>
                <div className="text-sm text-gray-500">{t("settings.darkModeDesc")}</div>
              </div>
              <Switch checked={themeMode === "dark"} onChange={handleThemeChange} />
            </div>
            <Divider className="my-3" />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.language")}</div>
                <div className="text-sm text-gray-500">{t("settings.languageDesc")}</div>
              </div>
              <Select value={i18n.language} onChange={handleLanguageChange} className="w-40">
                <Option value="en">English</Option>
                <Option value="vi">Tiếng Việt</Option>
              </Select>
            </div>
            <Divider className="my-3" />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.compactMode")}</div>
                <div className="text-sm text-gray-500">{t("settings.compactModeDesc")}</div>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
