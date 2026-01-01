import { Card, Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import ProfileNav from "./ProfileNav/ProfileNav";
import { useEffect } from "react";

const ProfileLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/profile") {
      navigate("personal-info", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card title={t("user.userProfile")} className="shadow-sm mb-6">
          <ProfileInfo />
          <ProfileNav />
        </Card>
      </Col>
      <Col xs={24} md={16}>
        <Outlet />
      </Col>
    </Row>
  );
};

export default ProfileLayout;
