'use client';

import { useEffect, useState } from 'react';

import Sidebar from '../../../components/dashboard/Sidebar';
import StudentTable from '../../../components/students/StudentTable';
import NewStudentModal from '../../../components/students/NewStudentModal';

type Student = {
  id: number;
  nombre: string;
  categoria: string;
  edad: number;
  estado: string;
};

export default function EstudiantesPage() {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [search, setSearch] =
    useState('');

  // estudiante que se está editando
  const [
    editingStudent,
    setEditingStudent,
  ] = useState<Student | null>(
    null
  );

  const [students, setStudents] =
    useState<Student[]>(() => {
      try {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('students');
          if (saved) return JSON.parse(saved);
        }
      } catch (e) {
        // ignore parsing errors and fallback to defaults
      }

      return [
        {
          id: 1,
          nombre: 'Daniel Losada',
          categoria: 'Sub-15',
          edad: 15,
          estado: 'Activo',
        },
        {
          id: 2,
          nombre: 'Juan Pérez',
          categoria: 'Sub-13',
          edad: 13,
          estado: 'Activo',
        },
      ];
    });

  // Guardar automáticamente
  useEffect(() => {
    localStorage.setItem(
      'students',
      JSON.stringify(students)
    );
  }, [students]);

  function addStudent(
    student: Omit<Student, 'id'>
  ) {
    const newStudent = {
      id: Date.now(),
      ...student,
    };

    setStudents((prev) => [
      ...prev,
      newStudent,
    ]);
  }

  function deleteStudent(
    id: number
  ) {
    const filteredStudents =
      students.filter(
        (student) =>
          student.id !== id
      );

    setStudents(filteredStudents);
  }

  // actualizar un estudiante existente
  function updateStudent(
    updated: Student
  ) {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === updated.id
          ? updated
          : student
      )
    );
  }

  // abrir modal para editar
  function editStudent(
    student: Student
  ) {
    setEditingStudent(student);
    setIsModalOpen(true);
  }

  // buscar estudiantes
  const filteredStudents =
    students.filter(
      (student) =>
        student.nombre
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              Estudiantes 👥
            </h1>

            <p className="text-zinc-600 mt-1">
              Gestiona los
              estudiantes de la
              escuela
            </p>
          </div>

          <button
            onClick={() => {
              setEditingStudent(
                null
              );
              setIsModalOpen(true);
            }}
            className="
              bg-yellow-400
              hover:bg-yellow-500
              text-zinc-900
              font-semibold
              px-5
              py-3
              rounded-xl
              transition
              shadow-sm
            "
          >
            + Nuevo estudiante
          </button>

        </div>

        {/* Buscador */}
        <div className="mb-6">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Buscar estudiante..."
            className="
              w-full
              md:w-96
              bg-white
              text-zinc-900
              border
              border-zinc-300
              rounded-xl
              p-3
              outline-none
              placeholder:text-zinc-400
              focus:ring-2
              focus:ring-yellow-400
            "
          />

        </div>

        {/* Tabla */}
        <StudentTable
          students={
            filteredStudents
          }
          onDeleteStudent={
            deleteStudent
          }
          onEditStudent={
            editStudent
          }
        />

        {/* Modal */}
        <NewStudentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
          onAddStudent={addStudent}
          onUpdateStudent={updateStudent}
          editingStudent={editingStudent}
        />

      </main>

    </div>
  );
}