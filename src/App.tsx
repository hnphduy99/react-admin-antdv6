import { useTheme } from "@/hooks/useTheme";
import { AppRoutes } from "@/routes";
import { ConfigProvider } from "antd";
import { NotificationProvider } from "./contexts/NotificationContext";

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
