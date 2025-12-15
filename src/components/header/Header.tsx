import { useResponsive } from "@/hooks/useResponsive";
import { MobileHeader } from "./layouts/MobileDesktop";
import { DesktopHeader } from "./layouts/DesktopHeader";

const Header = () => {
  const { md } = useResponsive();
  return md ? <DesktopHeader /> : <MobileHeader />;
};

export default Header;
