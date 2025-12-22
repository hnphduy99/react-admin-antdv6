import { Modal, Form, Input, Select, Row, Col } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Option } = Select;

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive";
  joinDate: string;
  avatar?: string;
}

interface UserFormModalProps {
  open: boolean;
  editingUser: UserData | null;
  loading: boolean;
  form: any;
  onOk: () => void;
  onCancel: () => void;
}

export const UserFormModal = ({ open, editingUser, loading, form, onOk, onCancel }: UserFormModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={editingUser ? t("common.edit") + " " + t("user.user") : t("common.addNew") + " " + t("user.user")}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
      centered
      width={800}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t("table.name")}
              rules={[{ required: true, message: t("validation.nameRequired") }]}
            >
              <Input prefix={<UserOutlined />} placeholder="John Doe" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label={t("auth.email")}
              rules={[
                { required: true, message: t("validation.emailRequired") },
                { type: "email", message: t("validation.emailInvalid") }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="user@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="role" label={t("user.role")} rules={[{ required: true, message: "Please select a role" }]}>
              <Select placeholder="Select role">
                <Option value="admin">{t("user.admin")}</Option>
                <Option value="moderator">{t("user.moderator")}</Option>
                <Option value="user">{t("user.user")}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label={t("table.status")}
              rules={[{ required: true, message: "Please select status" }]}
              initialValue="active"
            >
              <Select placeholder="Select status">
                <Option value="active">{t("table.active")}</Option>
                <Option value="inactive">{t("table.inactive")}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
