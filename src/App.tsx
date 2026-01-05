import { useTheme } from "@/hooks/useTheme";
import { AppRoutes } from "@/routes";
import { ConfigProvider } from "antd";
import { NotificationProvider } from "./providers/NotificationProvider";
import { useTranslation } from "react-i18next";
import vi_VN from "antd/locale/vi_VN";
import en_US from "antd/locale/en_US";
import { StyleProvider } from "@ant-design/cssinjs";

function App() {
  const { antdTheme } = useTheme();
  const { i18n } = useTranslation();

  return (
    <StyleProvider layer>
      <ConfigProvider theme={antdTheme} locale={i18n.language === "vi" ? vi_VN : en_US}>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </ConfigProvider>
    </StyleProvider>
  );
}

export default App;
