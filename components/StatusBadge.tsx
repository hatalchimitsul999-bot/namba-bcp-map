interface StatusBadgeProps {
  label: string;
  color: "green" | "yellow" | "red" | "orange" | "gray" | "purple" | "blue";
  size?: "sm" | "md";
}

const colorMap = {
  green: "bg-green-100 text-green-800 border-green-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  red: "bg-red-100 text-red-800 border-red-300",
  orange: "bg-orange-100 text-orange-800 border-orange-300",
  gray: "bg-gray-100 text-gray-600 border-gray-300",
  purple: "bg-purple-100 text-purple-800 border-purple-300",
  blue: "bg-blue-100 text-blue-800 border-blue-300",
};

export default function StatusBadge({ label, color, size = "md" }: StatusBadgeProps) {
  const sizeClass = size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2.5 py-1";
  return (
    <span className={`inline-block border rounded-full font-medium ${sizeClass} ${colorMap[color]}`}>
      {label}
    </span>
  );
}

export function safetyBadgeColor(status: string): "green" | "yellow" | "red" | "orange" | "gray" | "purple" | "blue" {
  switch (status) {
    case "safe": return "green";
    case "damaged": return "red";
    case "checking": return "yellow";
    case "evacuated": return "orange";
    default: return "gray";
  }
}

export function businessBadgeColor(status: string): "green" | "yellow" | "red" | "orange" | "gray" | "purple" | "blue" {
  switch (status) {
    case "open": return "green";
    case "partially_open": return "yellow";
    case "closed": return "red";
    case "preparing": return "blue";
    case "checking": return "orange";
    default: return "gray";
  }
}

export function supportStatusBadgeColor(status: string): "green" | "yellow" | "red" | "orange" | "gray" | "purple" | "blue" {
  switch (status) {
    case "open": return "red";
    case "in_progress": return "yellow";
    case "closed": return "green";
    default: return "gray";
  }
}

export function urgencyBadgeColor(urgency: string): "green" | "yellow" | "red" | "orange" | "gray" | "purple" | "blue" {
  switch (urgency) {
    case "high": return "red";
    case "middle": return "orange";
    case "low": return "green";
    default: return "gray";
  }
}
