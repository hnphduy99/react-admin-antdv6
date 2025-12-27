import SelectWithApi from "@/components/common/SelectWithApi/SelectWithApi";
import type { IUser } from "@/interfaces/user.interface";
import { MailOutlined } from "@ant-design/icons";
import { Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { Option } = Select;

interface UserFormModalProps {
  open: boolean;
  editingUser: IUser | null;
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
      maskClosable={false}
      width={800}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="ma_vai_tro"
              label={t("user.role")}
              rules={[{ required: true, message: t("validation.roleRequired") }]}
            >
              <SelectWithApi
                apiEndpoint="/roles/options"
                placeholder={t("common.select")}
                labelKey="label"
                valueKey="value"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="ma_nhan_vien" label={t("user.employeeCode")}>
              <Input placeholder={t("user.employeeCode")} />
            </Form.Item>
          </Col>
          <Col span={8}>
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
          <Col span={8}>
            <Form.Item name="ho" label={"Họ"} rules={[{ required: true, message: t("validation.nameRequired") }]}>
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="ten" label={"Tên"} rules={[{ required: true, message: t("validation.nameRequired") }]}>
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="so_dien_thoai"
              label={"Số điện thoại"}
              rules={[
                { required: true, message: t("validation.phoneRequired") },
                {
                  pattern: /^\d{10}$/, // Chỉ cho phép nhập 10 chữ số
                  message: t("validation.phoneInvalid")
                }
              ]}
            >
              <Input placeholder="0123456789" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="tai_khoan"
              label={"Tài khoản"}
              rules={[{ required: true, message: t("validation.accountRequired") }]}
            >
              <Input placeholder="user123" />
            </Form.Item>
          </Col>
          {!editingUser && (
            <>
              <Col span={8}>
                <Form.Item
                  name="mat_khau"
                  label={"Mật khẩu"}
                  rules={[
                    { required: true, message: t("validation.passwordRequired") },
                    { min: 6, message: t("validation.passwordMin") },
                    { max: 20, message: t("validation.passwordMax") },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const confirmPassword = getFieldValue("xac_nhan_mat_khau");
                        if (!confirmPassword) {
                          return Promise.resolve();
                        }
                        if (!value || confirmPassword === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t("validation.passwordNotMatch")));
                      }
                    })
                  ]}
                >
                  <Input.Password placeholder="user123" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="xac_nhan_mat_khau"
                  label={"Xác nhận mật khẩu"}
                  rules={[
                    { required: true, message: t("validation.passwordRequired") },
                    { min: 6, message: t("validation.passwordMin") },
                    { max: 20, message: t("validation.passwordMax") },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const password = getFieldValue("mat_khau");
                        if (!password) return Promise.reject(new Error(t("validation.passwordRequired")));
                        if (!value || password === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t("validation.passwordNotMatch")));
                      }
                    })
                  ]}
                >
                  <Input.Password placeholder="user123" />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={8}>
            <Form.Item
              name="ngay_sinh"
              label={t("user.birthday")}
              getValueProps={(i) => ({ value: i ? dayjs(i, "YYYY-MM-DD") : null })}
              getValueFromEvent={(i) => (i ? dayjs(i).format("YYYY-MM-DD") : null)}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="gioi_tinh" label={t("user.gender")}>
              <Select placeholder="Select gender">
                <Option value={1}>Nam</Option>
                <Option value={0}>Nữ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="trang_thai"
              label={t("table.status")}
              rules={[{ required: true, message: "Please select status" }]}
              initialValue={1}
            >
              <Select placeholder="Select status">
                <Option value={1}>{t("table.active")}</Option>
                <Option value={0}>{t("table.inactive")}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="dia_chi" label={t("user.address")}>
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder="Address" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
