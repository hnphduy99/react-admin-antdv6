import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useNotification } from "@/providers/NotificationProvider";
import { updateUser } from "@/store/slices/authSlice";
import { checkBeforeUpload, getBase64 } from "@/utils/utils";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UploadOutlined,
  UserOutlined
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Avatar, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const { Option } = Select;

export const UserProfile = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const notification = useNotification();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const handleUploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      // const response = await userApi.updateAvatar(formData);

      const base64 = await getBase64(file);
      dispatch(updateUser({ avatar: base64 }));
      setAvatarUrl(base64);

      notification.success({
        title: "Success",
        description: "Cập nhật ảnh đại diện thành công"
      });
    } catch (error) {
      console.error("Upload avatar error:", error);
      notification.error({
        title: "Error",
        description: "Có lỗi xảy ra khi cập nhật ảnh đại diện"
      });
    } finally {
      setUploading(false);
    }
  };

  const onFinish = (values: any) => {
    console.log("Profile update:", values);
    notification.success({
      title: "Success",
      description: "Profile updated successfully!"
    });
  };

  const onChangePassword = (values: any) => {
    console.log("Change password:", values);
    notification.success({
      title: "Success",
      description: t("password.passwordChanged")
    });
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    showUploadList: false,
    accept: "image/*",
    beforeUpload: async (file) => {
      const result = checkBeforeUpload(file, ["image/jpeg", "image/png"], 30, notification);
      if (result === false) {
        const preview = await getBase64(file);
        setAvatarUrl(preview);
        notification.success({
          title: "Success",
          description: `${file.name} đã được xử lý`
        });
        handleUploadAvatar(file);
      }
      return result;
    },
    onChange(info) {
      if (info.file.status === "removed") {
        setAvatarUrl(user?.avatar);
      }
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card title={t("user.userProfile")} className="shadow-sm mb-6">
          <div className="flex flex-col items-center mb-6">
            <ImgCrop rotationSlider aspect={1 / 1} cropShape="round">
              <Upload {...uploadProps} showUploadList={false} disabled={uploading}>
                <div className="relative group cursor-pointer w-40 h-40 rounded-full overflow-hidden border-2 border-gray-100 hover:border-blue-400 transition-all duration-300">
                  <Avatar size={160} icon={<UserOutlined />} src={avatarUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <UploadOutlined style={{ color: "white" }} className="text-2xl" />
                    )}
                  </div>
                </div>
              </Upload>
            </ImgCrop>
            <h2 className="text-xl font-semibold mt-4">{user?.ho_va_ten || "Admin User"}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-2">
              {t("user.role")}: {user?.ma_vai_tro || "Admin"}
            </p>
          </div>

          <div>
            <div
              className={`flex items-center p-2 mb-2 cursor-pointer rounded-xl transition-all duration-300 ${
                activeTab === "profile" ? "bg-blue-50/50" : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mr-4">
                <UserOutlined className="text-orange-500! text-lg" />
              </div>
              <span
                className={`text-base font-medium transition-colors duration-300 ${
                  activeTab === "profile" ? "text-primary-500" : "text-gray-700"
                }`}
              >
                {t("user.personalInfo")}
              </span>
            </div>

            <div
              className={`flex items-center p-2 cursor-pointer rounded-xl transition-all duration-300 ${
                activeTab === "password" ? "bg-blue-50/50" : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("password")}
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mr-4">
                <SafetyOutlined className="text-green-500! text-lg" />
              </div>
              <span
                className={`text-base font-medium transition-colors duration-300 ${
                  activeTab === "password" ? "text-primary-500" : "text-gray-700"
                }`}
              >
                {t("password.changePassword")}
              </span>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} md={16}>
        {activeTab === "profile" ? (
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
        ) : (
          <Card title={t("password.changePassword")} className="shadow-sm">
            <Form layout="vertical" onFinish={onChangePassword}>
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
                  { min: 6, message: t("validation.passwordMin") }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder={t("password.enterNew")} />
              </Form.Item>

              <Form.Item
                label={t("password.confirmNewPassword")}
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: t("validation.confirmPasswordRequired") },
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

              <Form.Item className="mt-8 mb-2">
                <Space>
                  <Button type="primary" htmlType="submit" size="large">
                    {t("password.changePassword")}
                  </Button>
                  <Button htmlType="reset" size="large">
                    {t("common.reset")}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default UserProfile;
