interface DashboardCardProps {
  label: string;
  value: number;
  color?: "blue" | "green" | "red" | "orange" | "gray" | "yellow";
  href?: string;
  sub?: string;
}

const colorMap = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  green: "bg-green-50 border-green-200 text-green-700",
  red: "bg-red-50 border-red-200 text-red-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
  gray: "bg-gray-50 border-gray-200 text-gray-600",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
};

const subColorMap = {
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  orange: "text-orange-600",
  gray: "text-gray-500",
  yellow: "text-yellow-600",
};

const valueColorMap = {
  blue: "text-blue-800",
  green: "text-green-800",
  red: "text-red-800",
  orange: "text-orange-800",
  gray: "text-gray-700",
  yellow: "text-yellow-800",
};

export default function DashboardCard({ label, value, color = "blue", sub }: DashboardCardProps) {
  return (
    <div className={`rounded-xl border-2 p-4 ${colorMap[color]}`}>
      <div className={`text-3xl font-bold ${valueColorMap[color]}`}>{value}</div>
      <div className="text-sm font-medium mt-1">{label}</div>
      {sub && <div className={`text-xs mt-0.5 ${subColorMap[color]}`}>{sub}</div>}
    </div>
  );
}
