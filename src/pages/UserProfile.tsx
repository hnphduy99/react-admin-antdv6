import { Card, Form, Input, Button, Upload, Avatar, Row, Col, Select, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/useRedux";
import type { UploadProps } from "antd";

const { Option } = Select;

export const UserProfile = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.user);

  const onFinish = (values: any) => {
    console.log("Profile update:", values);
    message.success("Profile updated successfully!");
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
      <Col span={24}>
        <Card title={t("user.userProfile")} className="shadow-sm mb-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar size={160} icon={<UserOutlined />} src={user?.avatar} />
            <h2 className="text-xl font-semibold mt-4">{user?.name || "Admin User"}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-2">
              {t("user.role")}: {user?.role || "Admin"}
            </p>
          </div>

          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} className="w-full mb-6">
              {t("form.uploadButton")}
            </Button>
          </Upload>
        </Card>
      </Col>

      <Col span={24}>
        <Card title={t("user.personalInfo")} className="shadow-sm">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: user?.name || "Admin User",
              email: user?.email || "admin@example.com",
              phone: "+1 (555) 123-4567",
              country: "usa",
              city: "New York",
              address: "123 Main Street, Apt 4B",
              role: user?.role || "admin"
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t("form.firstName")}
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

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t("form.phone")}
                  name="phone"
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Input prefix={<PhoneOutlined />} size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("user.role")} name="role">
                  <Select size="large">
                    <Option value="admin">{t("user.admin")}</Option>
                    <Option value="user">{t("user.user")}</Option>
                    <Option value="moderator">{t("user.moderator")}</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label={t("form.country")} name="country">
                  <Select size="large">
                    <Option value="usa">United States</Option>
                    <Option value="uk">United Kingdom</Option>
                    <Option value="vietnam">Vietnam</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("form.city")} name="city">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t("form.address")} name="address">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                {t("common.save")}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
