import Header from "@/components/header/Header";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import MainContent from "../MainContent/MainContent";
import MainHeader from "../MainHeader/MainHeader";
import MainSider from "../Sider/MainSider/MainSider";

export const MainLayout = () => {
  return (
    <Layout className="h-screen">
      <MainSider />
      <Layout className="md:ml-20 xl:ml-[unset]">
        <MainHeader>
          <Header />
        </MainHeader>
        <MainContent>
          <div>
            <Outlet />
          </div>
        </MainContent>
      </Layout>
    </Layout>
  );
};
