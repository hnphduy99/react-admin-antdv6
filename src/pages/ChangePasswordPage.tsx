import PageTitle from "@/components/PageTitle/PageTitle";
import { ChangePassword } from "@/components/profile/ChangePassword/ChangePassword";
import { useTranslation } from "react-i18next";

export const ChangePasswordPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t("password.changePassword")}</PageTitle>
      <ChangePassword />
    </>
  );
};

export default ChangePasswordPage;
