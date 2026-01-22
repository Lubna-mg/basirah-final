import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GazeChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: "اليسار", value: stats.left || 0 },
    { name: "المنتصف", value: stats.center || 0 },
    { name: "اليمين", value: stats.right || 0 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#135C8A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
