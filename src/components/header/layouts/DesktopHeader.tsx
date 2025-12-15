import { NotificationDropdown } from "@/components/header/NotificationDropdown";
import { UserDropdown } from "@/components/header/UserDropdown";
import { Breadcrumb, Col, Flex, Row, type BreadcrumbProps } from "antd";
import { useLocation } from "react-router-dom";
import { SettingDropdown } from "../SettingDropdown/SettingDropdown";

const getBreadcrumbItems = (pathname: string) => {
  const paths = pathname.split("/").filter((path) => path);

  const items: BreadcrumbProps["items"] = [];

  paths.forEach((path) => {
    items.push({
      title: path.charAt(0).toUpperCase() + path.slice(1)
    });
  });

  return items;
};

export const DesktopHeader = () => {
  const location = useLocation();

  return (
    <Row justify={"space-between"} align={"middle"} className="h-full">
      <Col lg={8} xxl={8}>
        <Breadcrumb items={getBreadcrumbItems(location.pathname)} />
      </Col>
      <Col lg={8} xxl={8}>
        <Flex justify={"end"} gap={8}>
          <NotificationDropdown />
          <SettingDropdown />
          <UserDropdown />
        </Flex>
      </Col>
    </Row>
  );
};
