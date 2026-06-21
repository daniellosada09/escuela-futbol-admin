'use client';

import { useEffect, useState } from 'react';

type Teacher = {
  id: number;
  nombre: string;
  especialidad: string;
  categoria: string;
  telefono: string;
  estado: string;
};

type TeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  editingTeacher: Teacher | null;
};

export default function TeacherModal({
  isOpen,
  onClose,
  onAddTeacher,
  onUpdateTeacher,
  editingTeacher,
}: TeacherModalProps) {

  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('Técnica');
  const [categoria, setCategoria] = useState('Sub-10');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('Activo');

  const isEditing = editingTeacher !== null;

  useEffect(() => {
    if (editingTeacher) {
      setNombre(editingTeacher.nombre);
      setEspecialidad(editingTeacher.especialidad);
      setCategoria(editingTeacher.categoria);
      setTelefono(editingTeacher.telefono);
      setEstado(editingTeacher.estado);
    } else {
      setNombre('');
      setEspecialidad('Técnica');
      setCategoria('Sub-10');
      setTelefono('');
      setEstado('Activo');
    }
  }, [editingTeacher, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('Debes ingresar un nombre');
      return;
    }

    if (editingTeacher) {
      onUpdateTeacher({
        ...editingTeacher,
        nombre,
        especialidad,
        categoria,
        telefono,
        estado,
      });
    } else {
      onAddTeacher({ nombre, especialidad, categoria, telefono, estado });
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              {isEditing ? 'Editar profesor ✏️' : 'Nuevo profesor 👔'}
            </h2>
            <p className="text-zinc-500 mt-1">
              {isEditing
                ? 'Actualiza los datos del profesor'
                : 'Agrega un profesor a la escuela'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium text-zinc-800">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del profesor"
              className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Especialidad
              </label>
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              >
                <option>Técnica</option>
                <option>Física</option>
                <option>Arquero</option>
                <option>Táctica</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Categoría de entreno
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              >
                <option>Sub-10</option>
                <option>Sub-13</option>
                <option>Sub-15</option>
                <option>Sub-17</option>
                <option>Todas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Teléfono
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="300 123 4567"
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold transition"
            >
              {isEditing ? 'Guardar cambios' : 'Guardar profesor'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
