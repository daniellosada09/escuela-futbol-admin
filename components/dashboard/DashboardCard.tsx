type DashboardCardProps = {
  title: string;
  value: string;
  color?: string;
};

export default function DashboardCard({
  title,
  value,
  color = 'text-zinc-900',
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">

      <h3 className="text-zinc-500 text-sm">
        {title}
      </h3>

      <p className={`text-3xl font-bold mt-3 ${color}`}>
        {value}
      </p>

    </div>
  );
}