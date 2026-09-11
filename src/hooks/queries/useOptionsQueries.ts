import { optionsApi } from "@/apis/options.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

/**
 * Hook lấy roles options cho Select dropdown
 */
export const useRolesOptions = () => {
  return useQuery({
    queryKey: queryKeys.roles.options(),
    queryFn: () => optionsApi.getRoles(),
    staleTime: 1000 * 60 * 5 // 5 phút — options ít thay đổi
  });
};
