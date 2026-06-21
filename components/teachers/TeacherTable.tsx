type Teacher = {
  id: number;
  nombre: string;
  especialidad: string;
  categoria: string;
  telefono: string;
  estado: string;
};

type TeacherTableProps = {
  teachers: Teacher[];
  onDeleteTeacher: (id: number) => void;
  onEditTeacher: (teacher: Teacher) => void;
};

export default function TeacherTable({
  teachers,
  onDeleteTeacher,
  onEditTeacher,
}: TeacherTableProps) {

  if (teachers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-10 text-center text-zinc-500">
        No hay profesores registrados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">

      <table className="w-full text-zinc-900">

        <thead className="bg-zinc-100">
          <tr>
            <th className="text-left p-4 font-semibold text-zinc-700">Nombre</th>
            <th className="text-left p-4 font-semibold text-zinc-700">Especialidad</th>
            <th className="text-left p-4 font-semibold text-zinc-700">Categoría de entreno</th>
            <th className="text-left p-4 font-semibold text-zinc-700">Teléfono</th>
            <th className="text-left p-4 font-semibold text-zinc-700">Estado</th>
            <th className="text-left p-4 font-semibold text-zinc-700">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {teachers.map((teacher) => (
            <tr
              key={teacher.id}
              className="border-t border-zinc-200 hover:bg-zinc-50 transition"
            >
              <td className="p-4 font-medium text-zinc-900">{teacher.nombre}</td>
              <td className="p-4 text-zinc-700">{teacher.especialidad}</td>
              <td className="p-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-700">
                  {teacher.categoria || '—'}
                </span>
              </td>
              <td className="p-4 text-zinc-700">{teacher.telefono || '—'}</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    teacher.estado === 'Activo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {teacher.estado}
                </span>
              </td>

              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditTeacher(teacher)}
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-xl font-medium transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDeleteTeacher(teacher.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-xl font-medium transition"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}
