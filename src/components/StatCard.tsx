import { Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: ReactNode;
  suffix?: string;
  trend?: number;
  icon?: ReactNode;
  valueColor?: string;
}

export const StatCard = ({ title, value, prefix, suffix, trend, icon, valueColor }: StatCardProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            styles={{ content: { color: valueColor } }}
          />
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        {icon && <div className="text-4xl opacity-25">{icon}</div>}
      </div>
    </Card>
  );
};
