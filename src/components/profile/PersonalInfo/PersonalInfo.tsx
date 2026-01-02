import { profileApi } from "@/apis/profile.api";
import { useAppSelector } from "@/hooks/useRedux";
import type { IUser } from "@/interfaces/user.interface";
import { useNotification } from "@/providers/NotificationProvider";
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const PersonalInfo = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.user);
  const notification = useNotification();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await profileApi.getProfile();
        if (response.code === 200) {
          form.setFieldsValue(response.data);
        }
      } catch (error) {
        console.error("Get profile error:", error);
      }
    };
    getProfile();
  }, [form]);

  const onFinish = async (values: IUser) => {
    try {
      const response = await profileApi.updateProfile(values);
      if (response.code === 200) {
        notification.success({
          title: t("common.success"),
          description: t("common.updateSuccess")
        });
        form.setFieldsValue(response.data);
      } else {
        notification.error({
          title: t("common.error"),
          description: Array.isArray(response?.data) ? response.data.join(", ") : `Failed to update profile`
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  return (
    <Card title={t("user.personalInfo")} className="shadow-sm">
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={user || {}}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t("form.lastName")}
              name="ho"
              rules={[{ required: true, message: t("validation.nameRequired") }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t("form.firstName")}
              name="ten"
              rules={[{ required: true, message: t("validation.nameRequired") }]}
            >
              <Input prefix={<UserOutlined />} />
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
              <Input prefix={<MailOutlined />} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={t("form.phone")}
              name="so_dien_thoai"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={"Giới tính"}
              name="gioi_tinh"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select>
                <Option value={1}>Nam</Option>
                <Option value={0}>Nữ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={"Ngày sinh"}
              name="ngay_sinh"
              rules={[{ required: true, message: t("validation.required") }]}
              getValueProps={(i) => ({ value: i ? dayjs(i, "YYYY-MM-DD") : null })}
              getValueFromEvent={(i) => (i ? dayjs(i).format("YYYY-MM-DD") : null)}
            >
              <DatePicker format="DD/MM/YYYY" className="w-full" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t("form.address")} name="dia_chi">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={null}>
          <Space>
            <Button type="primary" htmlType="submit">
              {t("common.save")}
            </Button>
            <Button htmlType="reset">{t("common.reset")}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PersonalInfo;
