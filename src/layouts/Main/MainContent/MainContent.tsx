import { Layout } from "antd";
import React from "react";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout.Content id="main-content" className="overflow-auto px-3 py-4 md:px-4 md:py-5">
      {children}
    </Layout.Content>
  );
};

export default MainContent;
