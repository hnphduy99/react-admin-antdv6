import { useTheme } from "@/hooks/useTheme";
import { AppRoutes } from "@/routes";
import { ConfigProvider } from "antd";
import { NotificationProvider } from "./providers/NotificationProvider";

function App() {
  const { antdTheme } = useTheme();

  return (
    <ConfigProvider theme={antdTheme}>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </ConfigProvider>
  );
}

export default App;
