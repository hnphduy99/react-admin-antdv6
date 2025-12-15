import { useMediaQuery } from "./useMediaQuery";

/**
 * Ant Design breakpoints
 */
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
};

export interface ResponsiveInfo {
  xs: boolean; // < 576px
  sm: boolean; // >= 576px
  md: boolean; // >= 768px
  lg: boolean; // >= 992px
  xl: boolean; // >= 1200px
  xxl: boolean; // >= 1600px
  isMobile: boolean; // < 768px
  isTablet: boolean; // >= 768px && < 992px
  isDesktop: boolean; // >= 992px
}

/**
 * Custom hook to detect responsive breakpoints
 * Matches Ant Design's breakpoint system
 * @returns Object with boolean flags for each breakpoint
 */
export const useResponsive = (): ResponsiveInfo => {
  const xs = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
  const sm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);
  const md = useMediaQuery(`(min-width: ${breakpoints.md}px)`);
  const lg = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
  const xl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
  const xxl = useMediaQuery(`(min-width: ${breakpoints.xxl}px)`);

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    isMobile: !md,
    isTablet: md && !lg,
    isDesktop: lg
  };
};

/**
 * Hook to get current breakpoint name
 * @returns Current breakpoint string ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')
 */
export const useBreakpoint = (): string => {
  const { xs, sm, md, lg, xl, xxl } = useResponsive();

  if (xxl) return "xxl";
  if (xl) return "xl";
  if (lg) return "lg";
  if (md) return "md";
  if (sm) return "sm";
  if (xs) return "xs";
  return "xs";
};
