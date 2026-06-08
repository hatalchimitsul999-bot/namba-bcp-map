import Link from "next/link";

interface MenuCardProps {
  href: string;
  title: string;
  description?: string;
  icon: string;
  color?: "red" | "blue" | "green" | "orange" | "purple";
  badge?: string;
}

const colorMap = {
  red: "border-red-200 hover:border-red-400 hover:bg-red-50",
  blue: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
  green: "border-green-200 hover:border-green-400 hover:bg-green-50",
  orange: "border-orange-200 hover:border-orange-400 hover:bg-orange-50",
  purple: "border-purple-200 hover:border-purple-400 hover:bg-purple-50",
};

const iconBgMap = {
  red: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  purple: "bg-purple-100 text-purple-600",
};

export default function MenuCard({ href, title, description, icon, color = "blue", badge }: MenuCardProps) {
  return (
    <Link
      href={href}
      className={`block p-4 border-2 rounded-xl bg-white transition-colors ${colorMap[color]}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${iconBgMap[color]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-base">{title}</span>
            {badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-gray-400 text-lg">›</span>
      </div>
    </Link>
  );
}
