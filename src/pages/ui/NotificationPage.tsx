import { useNotification } from "@/contexts/NotificationContext";
import { Button, Card, Flex } from "antd";

export default function NotificationPage() {
  const notification = useNotification();

  return (
    <Card>
      <Flex gap={8}>
        <Button type="primary" onClick={() => notification.success({ title: "Success" })}>
          Success
        </Button>
        <Button type="primary" onClick={() => notification.info({ title: "Info", description: "Info" })}>
          Info
        </Button>
        <Button type="primary" onClick={() => notification.warning({ title: "Warning", description: "Warning" })}>
          Warning
        </Button>
        <Button type="primary" onClick={() => notification.error({ title: "Error", description: "Error" })}>
          Error
        </Button>
      </Flex>
    </Card>
  );
}
