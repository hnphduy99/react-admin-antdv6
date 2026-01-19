import { rolesApi } from "@/apis/roles.api";
import type { IRoles } from "@/interfaces/roles.interface";
import { Checkbox, Form, Input, Modal, Table, type FormInstance } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";

interface RolesFormModalProps {
  t: TFunction<"translation", undefined>;
  open: boolean;
  editingItem: IRoles | null;
  loading: boolean;
  form: FormInstance;
  onOk: () => void;
  onCancel: () => void;
}

export const RolesFormModal = ({ t, open, editingItem, loading, form, onOk, onCancel }: RolesFormModalProps) => {
  const [actions, setActions] = useState<string[]>([]);

  const getDefaultPermissions = async () => {
    const response = await rolesApi.getDefaultPermissions();
    return response.data as any;
  };

  useEffect(() => {
    if (open) {
      const initForm = async () => {
        try {
          const defaultData = await getDefaultPermissions();
          if (Array.isArray(defaultData) && defaultData.length > 0) {
            const firstPerm = defaultData[0];
            if (firstPerm && firstPerm.actions) {
              setActions(Object.keys(firstPerm.actions));
            }
          }

          if (editingItem) {
            form.setFieldsValue(editingItem);
          } else {
            form.resetFields();
            form.setFieldsValue({
              phan_quyen: defaultData
            });
          }
        } catch (error) {
          console.error(error);
        }
      };
      initForm();
    }
  }, [open, editingItem, form]);

  const permissions = Form.useWatch("phan_quyen", form);

  const handleCheckAllRow = (index: number, checked: boolean) => {
    const currentPermissions = form.getFieldValue("phan_quyen");
    const updatedRow = { ...currentPermissions[index] };
    const newActions = { ...updatedRow.actions };

    actions.forEach((action) => {
      newActions[action] = checked;
    });

    updatedRow.actions = newActions;
    const newPermissions = [...currentPermissions];
    newPermissions[index] = updatedRow;
    form.setFieldValue("phan_quyen", newPermissions);
  };

  const isRowCheckedAll = (index: number) => {
    if (!permissions || !permissions[index]) return false;
    const rowActions = permissions[index].actions;
    return actions.every((action) => rowActions[action]);
  };

  const columns: ColumnsType<any> = [
    {
      title: t("roles.resource"),
      dataIndex: "name",
      key: "name",
      render: (_, field) => {
        const permissions = form.getFieldValue("phan_quyen");
        return (
          <>
            {permissions?.[field.name]?.name}
            <Form.Item name={[field.name, "name"]} hidden initialValue={permissions?.[field.name]?.name}>
              <Input />
            </Form.Item>
          </>
        );
      }
    },
    ...actions.map((action) => ({
      title: t(`roles.actions.${action}`),
      dataIndex: ["actions", action],
      key: action,
      align: "center" as const,
      render: (_: any, field: any) => (
        <Form.Item name={[field.name, "actions", action]} valuePropName="checked" style={{ marginBottom: 0 }}>
          <Checkbox />
        </Form.Item>
      )
    })),
    {
      // title: (
      //   <Checkbox checked={isGlobalCheckedAll()} onChange={(e) => handleCheckAllGlobal(e.target.checked)}>
      //     {t("common.selectAll")}
      //   </Checkbox>
      // ),
      title: t("common.selectAll"),
      key: "all",
      align: "center" as const,
      render: (_: any, field: any) => (
        <Checkbox
          checked={isRowCheckedAll(field.name)}
          onChange={(e) => handleCheckAllRow(field.name, e.target.checked)}
        />
      )
    }
  ];

  return (
    <Modal
      title={editingItem ? `${t("common.edit")} ${t("roles.roles")}` : `${t("common.addNew")} ${t("roles.roles")}`}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
      centered
      maskClosable={false}
      width={1000}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="ma_vai_tro"
          label={t("roles.roleCode")}
          rules={[{ required: true, message: t("validation.required") }]}
        >
          <Input placeholder={t("roles.enterRoleCode")} />
        </Form.Item>
        <Form.Item
          name="ten_vai_tro"
          label={t("roles.roleName")}
          rules={[{ required: true, message: t("validation.required") }]}
        >
          <Input placeholder={t("roles.enterRoleName")} />
        </Form.Item>
        <Form.List name="phan_quyen">
          {(fields) => (
            <Table dataSource={fields} bordered columns={columns} pagination={false} rowKey="key" size="small" />
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
