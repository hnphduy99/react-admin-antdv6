import { useState, useEffect } from "react";
import { Row, Col, Card, List, Typography, Tag, Skeleton } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { StatCard } from "@/components/StatCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { mockApi } from "@/services/mock";

const { Text } = Typography;

// Mock data for charts (typically this would be static or config-based)
const revenueData = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 5000, orders: 320 },
  { month: "Apr", revenue: 4500, orders: 278 },
  { month: "May", revenue: 6000, orders: 389 },
  { month: "Jun", revenue: 5500, orders: 349 }
];

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalOrders: number;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: string;
}

export const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await mockApi.dashboard.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        const response = await mockApi.dashboard.getRecentActivities(5);
        if (response.success) {
          setActivities(response.data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchStats();
    fetchActivities();
  }, []);

  // Map activity type to status
  const getActivityStatus = (type: string) => {
    const statusMap: Record<string, string> = {
      order: "success",
      payment: "success",
      profile: "info",
      registration: "info"
    };
    return statusMap[type] || "info";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          {loadingStats ? (
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            <StatCard
              title={t("dashboard.totalUsers")}
              value={stats?.totalUsers || 0}
              trend={12.5}
              icon={<UserOutlined />}
              valueColor="#3b82f6"
            />
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {loadingStats ? (
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            <StatCard
              title={t("dashboard.revenue")}
              value={stats?.totalRevenue || 0}
              prefix="$"
              trend={8.2}
              icon={<DollarOutlined />}
              valueColor="#22c55e"
            />
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {loadingStats ? (
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            <StatCard
              title={t("dashboard.orders")}
              value={stats?.totalOrders || 0}
              trend={-3.1}
              icon={<ShoppingOutlined />}
              valueColor="#f59e0b"
            />
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {loadingStats ? (
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            <StatCard
              title={t("dashboard.activeUsers")}
              value={stats?.activeUsers || 0}
              trend={5.4}
              icon={<RiseOutlined />}
              valueColor="#ef4444"
            />
          )}
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={t("dashboard.revenueOverview")} className="shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title={t("dashboard.monthlyOrders")} className="shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row>
        <Col span={24}>
          <Card title={t("dashboard.recentActivities")} className="shadow-sm" loading={loadingActivities}>
            <List
              dataSource={activities}
              renderItem={(item) => {
                const status = getActivityStatus(item.type);
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        status === "success" ? (
                          <CheckCircleOutlined className="text-green-500 text-xl" />
                        ) : (
                          <ClockCircleOutlined className="text-blue-500 text-xl" />
                        )
                      }
                      title={
                        <div className="flex items-center gap-2">
                          <Text strong>{item.user}</Text>
                          <Text className="text-gray-600">{item.action}</Text>
                        </div>
                      }
                      description={<Text type="secondary">{item.timestamp}</Text>}
                    />
                    <Tag color={status === "success" ? "green" : status === "warning" ? "orange" : "blue"}>
                      {item.type.toUpperCase()}
                    </Tag>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
