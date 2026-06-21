'use client';

import { useEffect, useState } from 'react';

import Sidebar from '../../../components/dashboard/Sidebar';
import TeacherTable from '../../../components/teachers/TeacherTable';
import TeacherModal from '../../../components/teachers/TeacherModal';

type Teacher = {
  id: number;
  nombre: string;
  especialidad: string;
  categoria: string;
  telefono: string;
  estado: string;
};

const defaultTeachers: Teacher[] = [
  {
    id: 1,
    nombre: 'Carlos Restrepo',
    especialidad: 'Técnica',
    categoria: 'Sub-15',
    telefono: '300 123 4567',
    estado: 'Activo',
  },
  {
    id: 2,
    nombre: 'Andrés Gómez',
    especialidad: 'Arquero',
    categoria: 'Sub-13',
    telefono: '310 987 6543',
    estado: 'Activo',
  },
];

export default function ProfesoresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('teachers');
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // ignore parsing errors and fallback to defaults
    }
    return defaultTeachers;
  });

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  function addTeacher(teacher: Omit<Teacher, 'id'>) {
    setTeachers((prev) => [...prev, { id: Date.now(), ...teacher }]);
  }

  function updateTeacher(updated: Teacher) {
    setTeachers((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  }

  function deleteTeacher(id: number) {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  }

  function editTeacher(teacher: Teacher) {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  }

  const filteredTeachers = teachers.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Profesores 👔</h1>
            <p className="text-zinc-600 mt-1">
              Gestiona el cuerpo técnico de la escuela
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTeacher(null);
              setIsModalOpen(true);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold px-5 py-3 rounded-xl transition shadow-sm"
          >
            + Nuevo profesor
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar profesor..."
            className="w-full md:w-96 bg-white text-zinc-900 border border-zinc-300 rounded-xl p-3 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <TeacherTable
          teachers={filteredTeachers}
          onDeleteTeacher={deleteTeacher}
          onEditTeacher={editTeacher}
        />

        <TeacherModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTeacher(null);
          }}
          onAddTeacher={addTeacher}
          onUpdateTeacher={updateTeacher}
          editingTeacher={editingTeacher}
        />

      </main>

    </div>
  );
}
