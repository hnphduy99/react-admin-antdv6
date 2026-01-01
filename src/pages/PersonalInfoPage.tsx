import PageTitle from "@/components/PageTitle/PageTitle";
import PersonalInfo from "@/components/profile/PersonalInfo/PersonalInfo";
import { useTranslation } from "react-i18next";

const PersonalInfoPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t("user.personalInfo")}</PageTitle>
      <PersonalInfo />
    </>
  );
};

export default PersonalInfoPage;
