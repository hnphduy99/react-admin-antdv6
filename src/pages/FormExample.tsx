import { Card, Form, Input, Button, Select, DatePicker, Radio, Checkbox, Upload, message, Row, Col, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { UploadProps } from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  birthDate: string;
  gender: string;
  interests: string[];
  bio: string;
}

export const FormExample = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values: FormValues) => {
    console.log("Form values:", values);
    message.success(t("form.submitSuccess"));
  };

  const onReset = () => {
    form.resetFields();
    message.info(t("form.resetInfo"));
  };

  const uploadProps: UploadProps = {
    name: "file",
    maxCount: 1,
    beforeUpload: () => {
      return false; // Prevent automatic upload
    },
    onChange(info) {
      message.success(`${info.file.name} file selected`);
    }
  };

  return (
    <div className="space-y-4">
      <Card title={t("form.userInformation")} className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{
            gender: "male",
            country: "usa"
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("form.firstName")}
                name="firstName"
                rules={[{ required: true, message: t("validation.required") }]}
              >
                <Input placeholder={t("form.firstName")} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("form.lastName")}
                name="lastName"
                rules={[{ required: true, message: t("validation.required") }]}
              >
                <Input placeholder={t("form.lastName")} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("auth.email")}
                name="email"
                rules={[
                  { required: true, message: t("validation.emailRequired") },
                  { type: "email", message: t("validation.emailInvalid") }
                ]}
              >
                <Input placeholder={t("auth.emailPlaceholder")} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("form.phone")}
                name="phone"
                rules={[{ required: true, message: t("validation.required") }]}
              >
                <Input placeholder="+1 (555) 123-4567" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("form.country")}
                name="country"
                rules={[{ required: true, message: t("validation.required") }]}
              >
                <Select placeholder={t("form.country")} size="large">
                  <Option value="usa">United States</Option>
                  <Option value="uk">United Kingdom</Option>
                  <Option value="canada">Canada</Option>
                  <Option value="vietnam">Vietnam</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("form.city")}
                name="city"
                rules={[{ required: true, message: t("validation.required") }]}
              >
                <Input placeholder={t("form.city")} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={t("form.address")}
            name="address"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <TextArea rows={3} placeholder={t("form.address")} />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("form.birthDate")}
                name="birthDate"
                rules={[{ required: true, message: t("validation.required") }]}
              >
                <DatePicker className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("form.gender")}
                name="gender"
                rules={[{ required: true, message: t("validation.required") }]}
              >
                <Radio.Group size="large">
                  <Radio value="male">{t("form.male")}</Radio>
                  <Radio value="female">{t("form.female")}</Radio>
                  <Radio value="other">{t("form.other")}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={t("form.interests")} name="interests">
            <Checkbox.Group>
              <Row>
                <Col span={8}>
                  <Checkbox value="sports">{t("form.sports")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="music">{t("form.music")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="reading">{t("form.reading")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="travel">{t("form.travel")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="technology">{t("form.technology")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="art">{t("form.art")}</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label={t("form.profilePicture")} name="avatar" valuePropName="fileList">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>{t("form.uploadButton")}</Button>
            </Upload>
          </Form.Item>

          <Form.Item label={t("form.bio")} name="bio">
            <TextArea rows={4} placeholder={t("form.bioPlaceholder")} showCount maxLength={500} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {t("common.submit")}
              </Button>
              <Button onClick={onReset} size="large">
                {t("common.reset")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
