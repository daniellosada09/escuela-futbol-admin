'use client';

import { useState } from 'react';

type NewStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: {
    nombre: string;
    edad: number;
    categoria: string;
    estado: string;
  }) => void;
};

export default function NewStudentModal({
  isOpen,
  onClose,
  onAddStudent,
}: NewStudentModalProps) {

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [categoria, setCategoria] = useState('Sub-10');

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const edadNumero = Number(edad);

    // Validar nombre
    if (!nombre.trim()) {
      alert('Debes ingresar un nombre');
      return;
    }

    // Validar edad
    if (edadNumero < 4 || edadNumero > 30) {
      alert('La edad debe estar entre 4 y 30 años');
      return;
    }

    onAddStudent({
      nombre,
      edad: edadNumero,
      categoria,
      estado: 'Activo',
    });

    // Limpiar formulario
    setNombre('');
    setEdad('');
    setCategoria('Sub-10');

    // Cerrar modal
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Nuevo estudiante ⚽
            </h2>

            <p className="text-zinc-500 mt-1">
              Agrega un estudiante a la escuela
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 text-xl"
          >
            ✕
          </button>

        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Nombre */}
          <div>
            <label className="block mb-2 font-medium text-zinc-800">
              Nombre completo
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del estudiante"
              className="
                w-full
                border
                border-zinc-300
                rounded-xl
                p-3
                outline-none
                text-zinc-900
                focus:ring-2
                focus:ring-yellow-400
              "
            />
          </div>

          {/* Edad + Categoría */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Edad
              </label>

              <input
                type="number"
                min="4"
                max="30"
                value={edad}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (value >= 0 || e.target.value === '') {
                    setEdad(e.target.value);
                  }
                }}
                placeholder="15"
                className="
                  w-full
                  border
                  border-zinc-300
                  rounded-xl
                  p-3
                  outline-none
                  text-zinc-900
                  focus:ring-2
                  focus:ring-yellow-400
                "
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Categoría
              </label>

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="
                  w-full
                  border
                  border-zinc-300
                  rounded-xl
                  p-3
                  outline-none
                  text-zinc-900
                  focus:ring-2
                  focus:ring-yellow-400
                "
              >
                <option>Sub-10</option>
                <option>Sub-13</option>
                <option>Sub-15</option>
                <option>Sub-17</option>
              </select>
            </div>

          </div>

          {/* Botones */}
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
              Guardar estudiante
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}