'use client';

import { useEffect, useState } from 'react';

import Sidebar from '../../../components/dashboard/Sidebar';

type Student = {
  id: number;
  nombre: string;
  categoria: string;
  edad: number;
  estado: string;
};

// { "2026-06-20": { "1": "Presente", "2": "Ausente" } }
type AttendanceMap = Record<string, Record<string, 'Presente' | 'Ausente'>>;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AsistenciaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const [date, setDate] = useState(todayISO());

  // Cargar estudiantes y asistencia guardada (solo en cliente)
  useEffect(() => {
    try {
      const savedStudents = localStorage.getItem('students');
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedAttendance = localStorage.getItem('attendance');
      if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
    } catch {
      // ignore
    }
  }, []);

  // Guardar asistencia cuando cambie
  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  const dayRecord = attendance[date] ?? {};

  function setStatus(studentId: number, status: 'Presente' | 'Ausente') {
    setAttendance((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] ?? {}),
        [studentId]: status,
      },
    }));
  }

  function markAll(status: 'Presente' | 'Ausente') {
    const record: Record<string, 'Presente' | 'Ausente'> = {};
    students.forEach((s) => {
      record[s.id] = status;
    });
    setAttendance((prev) => ({ ...prev, [date]: record }));
  }

  const presentesList = students.filter((s) => dayRecord[s.id] === 'Presente');
  const ausentesList = students.filter((s) => dayRecord[s.id] === 'Ausente');

  const presentes = presentesList.length;
  const ausentes = ausentesList.length;
  const sinMarcar = students.length - presentes - ausentes;

  // % sobre el total de estudiantes
  const porcentaje =
    students.length > 0 ? Math.round((presentes / students.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-zinc-900">Asistencia 📋</h1>
          <p className="text-zinc-600 mt-1">
            Registra la asistencia de los estudiantes por día
          </p>
        </div>

        {/* Controles: fecha + acciones rápidas */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div>
            <label className="block mb-2 font-medium text-zinc-800">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white text-zinc-900 border border-zinc-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            onClick={() => markAll('Presente')}
            className="px-4 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-medium transition"
          >
            Marcar todos presentes
          </button>

          <button
            onClick={() => markAll('Ausente')}
            className="px-4 py-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 font-medium transition"
          >
            Marcar todos ausentes
          </button>
        </div>

        {/* Barra de progreso de asistencia */}
        {students.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-zinc-800">Asistencia del día</span>
              <span className="font-bold text-zinc-900">
                {presentes}/{students.length} ({porcentaje}%)
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  porcentaje >= 80
                    ? 'bg-green-500'
                    : porcentaje >= 50
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        )}

        {/* Alerta de ausentes */}
        {ausentes > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-700">
                Faltaron {ausentes} {ausentes === 1 ? 'estudiante' : 'estudiantes'}
              </p>
              <p className="text-red-600 text-sm mt-0.5">
                {ausentesList.map((s) => s.nombre).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Aviso de pendientes por marcar */}
        {students.length > 0 && sinMarcar > 0 && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 mb-6 text-zinc-600">
            Quedan <strong>{sinMarcar}</strong> estudiantes sin marcar.
          </div>
        )}

        {/* Todo en orden */}
        {students.length > 0 && ausentes === 0 && sinMarcar === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-green-700 font-medium">
            ✓ Asistencia completa: todos los estudiantes están presentes.
          </div>
        )}

        {/* Lista de estudiantes */}
        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-10 text-center text-zinc-500">
            No hay estudiantes. Agrégalos primero en la sección Estudiantes.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <table className="w-full text-zinc-900">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-zinc-700">Nombre</th>
                  <th className="text-left p-4 font-semibold text-zinc-700">Categoría</th>
                  <th className="text-left p-4 font-semibold text-zinc-700">Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const status = dayRecord[student.id];
                  // Color de fondo según estado para identificar de un vistazo
                  const rowClass =
                    status === 'Ausente'
                      ? 'bg-red-50'
                      : status === 'Presente'
                      ? 'bg-green-50'
                      : '';
                  return (
                    <tr
                      key={student.id}
                      className={`border-t border-zinc-200 transition ${rowClass}`}
                    >
                      <td className="p-4 font-medium flex items-center gap-2">
                        {status === 'Ausente' && <span title="Ausente">🔴</span>}
                        {status === 'Presente' && <span title="Presente">🟢</span>}
                        {student.nombre}
                      </td>
                      <td className="p-4 text-zinc-700">{student.categoria}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setStatus(student.id, 'Presente')}
                            className={`px-4 py-2 rounded-xl font-medium transition ${
                              status === 'Presente'
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            Presente
                          </button>
                          <button
                            onClick={() => setStatus(student.id, 'Ausente')}
                            className={`px-4 py-2 rounded-xl font-medium transition ${
                              status === 'Ausente'
                                ? 'bg-red-500 text-white'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            Ausente
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </main>

    </div>
  );
}
