import { SettingOutlined } from "@ant-design/icons";
import { Button, Card, Collapse, Dropdown, type CollapseProps } from "antd";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export const SettingDropdown = () => {
  const items: CollapseProps["items"] = [
    {
      key: "LanguageSwitcher",
      label: "Change language",
      children: <LanguageSwitcher />
    },
    {
      key: "ThemeToggle",
      label: "Change theme",
      children: <ThemeToggle />
    }
  ];

  const settingContent = (
    <Card className="shadow-lg" styles={{ body: { padding: 8 } }}>
      <Collapse expandIconPlacement="end" items={items} ghost />
    </Card>
  );

  return (
    <Dropdown popupRender={() => settingContent} placement="bottom" arrow trigger={["click"]}>
      <Button size="large" type="text" icon={<SettingOutlined />} />
    </Dropdown>
  );
};
