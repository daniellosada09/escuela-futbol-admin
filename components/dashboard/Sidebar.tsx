'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaFutbol,
  FaUsers,
  FaClipboardList,
  FaMoneyBillWave,
  FaCog,
  FaUserTie,
} from 'react-icons/fa';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: FaFutbol },
  { href: '/dashboard/estudiantes', label: 'Estudiantes', icon: FaUsers },
  { href: '/dashboard/profesores', label: 'Profesores', icon: FaUserTie },
  { href: '/dashboard/asistencia', label: 'Asistencia', icon: FaClipboardList },
  { href: '/dashboard/pagos', label: 'Pagos', icon: FaMoneyBillWave },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: FaCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-zinc-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-10 text-yellow-400">
        ⚽ Escuela
      </h1>

      <nav className="space-y-3">

        {links.map(({ href, label, icon: Icon }) => {
          // El Dashboard solo se marca activo en su ruta exacta;
          // las demás también cuando estás en una subruta.
          const isActive =
            href === '/dashboard'
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${
                isActive
                  ? 'bg-yellow-400 text-black font-semibold'
                  : 'hover:bg-zinc-800'
              }`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}
