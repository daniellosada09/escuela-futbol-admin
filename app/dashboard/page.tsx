'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Sidebar from '../../components/dashboard/Sidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';

type Stats = {
  estudiantes: number;
  profesores: number;
  pagosPendientes: number;
  asistencia: string;
  ausentesHoy: number;
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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    estudiantes: 0,
    profesores: 0,
    pagosPendientes: 0,
    asistencia: '—',
    ausentesHoy: 0,
  });

  const [nombreEscuela, setNombreEscuela] = useState('panel administrativo');

  useEffect(() => {
    const students = readJSON<{ id: number }[]>('students', []);
    const teachers = readJSON<{ id: number }[]>('teachers', []);
    const payments = readJSON<{ estado: string }[]>('payments', []);
    const attendance = readJSON<Record<string, Record<string, string>>>('attendance', {});
    const config = readJSON<{ nombreEscuela?: string }>('config', {});

    const pagosPendientes = payments.filter((p) => p.estado === 'Pendiente').length;

    // % de asistencia de hoy (sobre los estudiantes marcados)
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
    });

    if (config.nombreEscuela) setNombreEscuela(config.nombreEscuela);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-900">Dashboard ⚽</h2>
          <p className="text-zinc-500 mt-1">
            Bienvenido a {nombreEscuela}
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardCard title="Estudiantes" value={String(stats.estudiantes)} />
          <DashboardCard title="Profesores" value={String(stats.profesores)} />
          <DashboardCard
            title="Pagos pendientes"
            value={String(stats.pagosPendientes)}
            color="text-red-500"
          />
          <DashboardCard
            title="Asistencia hoy"
            value={stats.asistencia}
            color="text-green-500"
          />
        </div>

      </main>

    </div>
  );
}
