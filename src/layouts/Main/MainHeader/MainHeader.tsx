import { Layout } from "antd";

const MainHeader = ({ children }: { children: React.ReactNode }) => {
  return <Layout.Header className="leading-normal md:p-5! md:px-9! h-22.5!">{children}</Layout.Header>;
};

export default MainHeader;
