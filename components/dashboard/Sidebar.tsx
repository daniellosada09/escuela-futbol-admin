import Link from 'next/link';
import {
  FaFutbol,
  FaUsers,
  FaClipboardList,
  FaMoneyBillWave,
  FaCog,
  FaUserTie
} from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="w-72 bg-zinc-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-10 text-yellow-400">
        ⚽ Escuela
      </h1>

      <nav className="space-y-3">

        <Link
          href="/dashboard"
          className="flex items-center gap-3 w-full p-3 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          <FaFutbol />
          Dashboard
        </Link>

        <Link
          href="/dashboard/estudiantes"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <FaUsers />
          Estudiantes
        </Link>

        <Link
          href="/dashboard/profesores"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <FaUserTie />
          Profesores
        </Link>

        <Link
          href="/dashboard/asistencia"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <FaClipboardList />
          Asistencia
        </Link>

        <Link
          href="/dashboard/pagos"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <FaMoneyBillWave />
          Pagos
        </Link>

        <Link
          href="/dashboard/configuracion"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <FaCog />
          Configuración
        </Link>

      </nav>

    </aside>
  );
}