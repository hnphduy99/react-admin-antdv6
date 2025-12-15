import { Radio } from "antd";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const options = [
    {
      value: "en",
      label: "English"
    },
    {
      value: "vi",
      label: "Tiếng Việt"
    }
  ];

  return (
    <Radio.Group
      vertical
      options={options}
      defaultValue={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
    />
  );
};
