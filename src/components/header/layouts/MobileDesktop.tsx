import { useAppDispatch } from "@/hooks/useRedux";
import { toggleSidebar } from "@/store/slices/sidebarSlice";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { NotificationDropdown } from "../NotificationDropdown";
import { SettingDropdown } from "../SettingDropdown/SettingDropdown";
import { UserDropdown } from "../UserDropdown";

export const MobileHeader = () => {
  const dispatch = useAppDispatch();
  const toggleSider = () => dispatch(toggleSidebar());
  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Button type="text" onClick={toggleSider} icon={<MenuOutlined />} size="large" />
      </Col>
      <Col>
        <Row align="middle" gutter={[10, 10]}>
          <Col>
            <NotificationDropdown />
          </Col>
          <Col>
            <SettingDropdown />
          </Col>
        </Row>
      </Col>
      <Col>
        <UserDropdown />
      </Col>
    </Row>
  );
};
