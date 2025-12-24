import { WEB_NAME } from "@/constants/constants";
import React from "react";

export default function PageTitle({ children }: { children: React.ReactNode }) {
  const title = `${children} | ${WEB_NAME}`;
  return <title>{title}</title>;
}
