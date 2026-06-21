'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaUsers,
  FaUserTie,
  FaMoneyBillWave,
  FaClipboardCheck,
  FaUserPlus,
  FaPlus,
} from 'react-icons/fa';

import Sidebar from '../../components/dashboard/Sidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';

type Stats = {
  estudiantes: number;
  profesores: number;
  pagosPendientes: number;
  asistencia: string;
  ausentesHoy: number;
  recaudado: number;
  pendiente: number;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatCOP(value: number) {
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    estudiantes: 0,
    profesores: 0,
    pagosPendientes: 0,
    asistencia: '—',
    ausentesHoy: 0,
    recaudado: 0,
    pendiente: 0,
  });

  const [nombreEscuela, setNombreEscuela] = useState('panel administrativo');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const students = readJSON<{ id: number }[]>('students', []);
    const teachers = readJSON<{ id: number }[]>('teachers', []);
    const payments = readJSON<{ estado: string; monto: number }[]>('payments', []);
    const attendance = readJSON<Record<string, Record<string, string>>>('attendance', {});
    const config = readJSON<{ nombreEscuela?: string }>('config', {});

    const pagosPendientes = payments.filter((p) => p.estado === 'Pendiente').length;
    const recaudado = payments
      .filter((p) => p.estado === 'Pagado')
      .reduce((s, p) => s + (p.monto || 0), 0);
    const pendiente = payments
      .filter((p) => p.estado === 'Pendiente')
      .reduce((s, p) => s + (p.monto || 0), 0);

    const hoy = attendance[todayISO()] ?? {};
    const marcados = Object.values(hoy);
    const presentes = marcados.filter((s) => s === 'Presente').length;
    const ausentesHoy = marcados.filter((s) => s === 'Ausente').length;
    const asistencia =
      marcados.length > 0
        ? `${Math.round((presentes / marcados.length) * 100)}%`
        : '—';

    setStats({
      estudiantes: students.length,
      profesores: teachers.length,
      pagosPendientes,
      asistencia,
      ausentesHoy,
      recaudado,
      pendiente,
    });

    if (config.nombreEscuela) setNombreEscuela(config.nombreEscuela);

    setFecha(
      new Date().toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  const totalPagos = stats.recaudado + stats.pendiente;
  const pctRecaudado =
    totalPagos > 0 ? Math.round((stats.recaudado / totalPagos) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* Encabezado */}
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-zinc-900">
            Hola, bienvenido ⚽
          </h2>
          <p className="text-zinc-500 mt-1">
            {nombreEscuela}
            {fecha && <span className="capitalize"> · {fecha}</span>}
          </p>
        </div>

        {/* Alerta de ausentes de hoy */}
        {stats.ausentesHoy > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-700 font-medium">
              Hoy faltaron {stats.ausentesHoy}{' '}
              {stats.ausentesHoy === 1 ? 'estudiante' : 'estudiantes'}.{' '}
              <Link href="/dashboard/asistencia" className="underline">
                Ver asistencia
              </Link>
            </p>
          </div>
        )}

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Estudiantes"
            value={String(stats.estudiantes)}
            icon={FaUsers}
            href="/dashboard/estudiantes"
            accent="bg-blue-100 text-blue-600"
          />
          <DashboardCard
            title="Profesores"
            value={String(stats.profesores)}
            icon={FaUserTie}
            href="/dashboard/profesores"
            accent="bg-purple-100 text-purple-600"
          />
          <DashboardCard
            title="Pagos pendientes"
            value={String(stats.pagosPendientes)}
            icon={FaMoneyBillWave}
            href="/dashboard/pagos"
            accent="bg-red-100 text-red-600"
            hint={stats.pendiente > 0 ? formatCOP(stats.pendiente) : undefined}
          />
          <DashboardCard
            title="Asistencia hoy"
            value={stats.asistencia}
            icon={FaClipboardCheck}
            href="/dashboard/asistencia"
            accent="bg-green-100 text-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Resumen de pagos */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
            <h3 className="font-display text-lg font-bold text-zinc-900 mb-4">
              Resumen de pagos
            </h3>

            {totalPagos > 0 ? (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-600 font-medium">
                    Recaudado · {formatCOP(stats.recaudado)}
                  </span>
                  <span className="text-red-500 font-medium">
                    Pendiente · {formatCOP(stats.pendiente)}
                  </span>
                </div>
                <div className="w-full h-4 bg-red-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${pctRecaudado}%` }}
                  />
                </div>
                <p className="text-sm text-zinc-500 mt-3">
                  Has recaudado el <strong>{pctRecaudado}%</strong> del total
                  registrado este periodo.
                </p>
              </>
            ) : (
              <p className="text-zinc-500">
                Aún no hay pagos registrados.{' '}
                <Link href="/dashboard/pagos" className="text-yellow-700 underline">
                  Registrar el primero
                </Link>
              </p>
            )}
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
            <h3 className="font-display text-lg font-bold text-zinc-900 mb-4">
              Accesos rápidos
            </h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/estudiantes"
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-yellow-50 hover:text-yellow-700 transition font-medium text-zinc-700"
              >
                <FaUserPlus /> Registrar estudiante
              </Link>
              <Link
                href="/dashboard/asistencia"
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-yellow-50 hover:text-yellow-700 transition font-medium text-zinc-700"
              >
                <FaClipboardCheck /> Tomar asistencia
              </Link>
              <Link
                href="/dashboard/pagos"
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-yellow-50 hover:text-yellow-700 transition font-medium text-zinc-700"
              >
                <FaPlus /> Registrar pago
              </Link>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
