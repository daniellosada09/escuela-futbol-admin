type Student = {
  id: number;
  nombre: string;
  categoria: string;
  edad: number;
  estado: string;
};

type StudentTableProps = {
  students: Student[];
  onDeleteStudent: (id: number) => void;
};

export default function StudentTable({
  students,
  onDeleteStudent,
}: StudentTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">

      <table className="w-full text-zinc-900">

        <thead className="bg-zinc-100">
          <tr>

            <th className="text-left p-4 font-semibold text-zinc-700">
              Nombre
            </th>

            <th className="text-left p-4 font-semibold text-zinc-700">
              Categoría
            </th>

            <th className="text-left p-4 font-semibold text-zinc-700">
              Edad
            </th>

            <th className="text-left p-4 font-semibold text-zinc-700">
              Estado
            </th>

            <th className="text-left p-4 font-semibold text-zinc-700">
              Acciones
            </th>

          </tr>
        </thead>

        <tbody>

          {students.map((student) => (
            <tr
              key={student.id}
              className="border-t border-zinc-200 hover:bg-zinc-50 transition"
            >
              <td className="p-4 font-medium text-zinc-900">
                {student.nombre}
              </td>

              <td className="p-4 text-zinc-700">
                {student.categoria}
              </td>

              <td className="p-4 text-zinc-700">
                {student.edad}
              </td>

              <td className="p-4">
                <span
                  className={`
                    px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      student.estado === 'Activo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  `}
                >
                  {student.estado}
                </span>
              </td>

              <td className="p-4">

                <button
                  onClick={() => onDeleteStudent(student.id)}
                  className="
                    bg-red-100
                    text-red-600
                    hover:bg-red-200
                    px-4
                    py-2
                    rounded-xl
                    font-medium
                    transition
                  "
                >
                  Eliminar
                </button>

              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}