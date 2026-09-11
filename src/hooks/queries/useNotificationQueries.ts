import { notificationApi } from "@/apis/notification.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

/**
 * Hook lấy danh sách notifications
 */
export const useNotifications = () => {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => notificationApi.getNotifications(),
    select: (response) => (response.status ? response.data : []),
    staleTime: 1000 * 30 // 30 giây — notifications cần fresh hơn
  });
};

/**
 * Hook đánh dấu một notification là đã đọc
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() });
    }
  });
};

/**
 * Hook đánh dấu tất cả notifications là đã đọc
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() });
    }
  });
};
