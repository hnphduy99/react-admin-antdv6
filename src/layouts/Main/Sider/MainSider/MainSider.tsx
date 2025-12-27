import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toggleSidebar } from "@/store/slices/sidebarSlice";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import SiderLogo from "../SiderLogo";
import SiderMenu from "../SiderMenu/SiderMenu";
import { useResponsive } from "@/hooks/useResponsive";

const MainSider = () => {
  const { isMobile } = useResponsive();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.sidebar.collapsed);

  const toggleSider = () => dispatch(toggleSidebar());

  return (
    <>
      <Layout.Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        className="fixed! overflow-visible z-6 min-h-screen max-h-screen text-secondary-500 md:right-[unset] md:left-0 xl:relative!"
        width={260}
      >
        <SiderLogo />
        <div className="overflow-y-auto overflow-x-hidden h-[calc(100vh-140px)]">
          <SiderMenu />
        </div>
        {!isMobile && (
          <div className="absolute bottom-2 left-1/2 transition-all -translate-x-1/2">
            <Button
              color="primary"
              variant="filled"
              onClick={toggleSider}
              icon={<LeftOutlined rotate={Number(collapsed) ? 180 : 0} />}
            />
          </div>
        )}
      </Layout.Sider>
      {isMobile && !collapsed && (
        <div onClick={toggleSider} className="absolute top-0 left-0 w-full h-full z-5 backdrop-blur-xs "></div>
      )}
    </>
  );
};

export default MainSider;
