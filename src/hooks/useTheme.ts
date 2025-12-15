import { useMemo, useEffect } from "react";
import { theme } from "antd";
import type { ThemeConfig } from "antd";
import { useAppSelector } from "./useRedux";

export const useTheme = () => {
  const themeMode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  const antdTheme: ThemeConfig = useMemo(
    () => ({
      algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: "#0ea5e9",
        colorSuccess: "#22c55e",
        colorWarning: "#f59e0b",
        colorError: "#ef4444",
        colorInfo: "#3b82f6",
        borderRadius: 4,
        borderRadiusLG: 6,
        controlHeightXS: 24,
        controlHeightSM: 32,
        controlHeightLG: 40
      },
      components: {
        Card: {
          bodyPadding: 16,
          borderRadius: 8
        },
        Layout: {
          headerBg: themeMode === "dark" ? "#1f2937" : "#ffffff",
          headerHeight: 70,
          bodyBg: themeMode === "dark" ? "#111827" : "#f3f4f6",
          siderBg: themeMode === "dark" ? "#1f2937" : "#0ea5e9",
          triggerBg: themeMode === "dark" ? "#1f2937" : "#0ea5e9",
          triggerColor: themeMode === "dark" ? "#ffffff" : "#ffffff",
          headerPadding: 16
        },
        Menu: {
          itemBg: "#0ea5e9",
          itemSelectedColor: "#FFB765",
          itemHoverColor: "#FFB765",
          itemColor: "#fff",
          itemBorderRadius: 4,
          itemSelectedBg: "rgba(0, 0, 0, 0.05)",
          subMenuItemSelectedColor: "#FFB765",
          //darkmode
          darkItemBg: "#1f2937",
          darkItemColor: "#fff",
          darkItemHoverColor: "#FFB765",
          darkItemHoverBg: "rgba(255, 255, 255, 0.2)",
          darkItemSelectedColor: "#FFB765",
          darkSubMenuItemBg: "transparent",
          darkPopupBg: "#1f2937"
        },
        Table: {
          headerBorderRadius: 4,
          headerBg: themeMode === "dark" ? "#1f2937" : "#f5f7fa",
          headerColor: themeMode === "dark" ? "#fff" : "#0ea5e9",
          colorIcon: themeMode === "dark" ? "#fff" : "#000"
        }
      }
    }),
    [themeMode]
  );

  return { themeMode, antdTheme };
};
