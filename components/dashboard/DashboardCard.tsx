import Link from 'next/link';
import type { IconType } from 'react-icons';

type DashboardCardProps = {
  title: string;
  value: string;
  icon: IconType;
  href: string;
  /** Clases de color para el círculo del ícono, ej: 'bg-yellow-100 text-yellow-600' */
  accent?: string;
  /** Texto pequeño debajo del valor */
  hint?: string;
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  href,
  accent = 'bg-yellow-100 text-yellow-600',
  hint,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 transition hover:shadow-md hover:border-yellow-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-zinc-500 text-sm">{title}</h3>
          <p className="font-display text-3xl font-bold mt-2 text-zinc-900">
            {value}
          </p>
          {hint && <p className="text-xs text-zinc-400 mt-1">{hint}</p>}
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${accent}`}
        >
          <Icon />
        </div>
      </div>
    </Link>
  );
}
