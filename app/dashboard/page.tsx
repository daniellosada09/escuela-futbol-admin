import Sidebar from '../../components/dashboard/Sidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-900">
            Dashboard ⚽
          </h2>

          <p className="text-zinc-500 mt-1">
            Bienvenido al panel administrativo
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <DashboardCard
            title="Estudiantes"
            value="120"
          />

          <DashboardCard
            title="Profesores"
            value="8"
          />

          <DashboardCard
            title="Pagos pendientes"
            value="18"
            color="text-red-500"
          />

          <DashboardCard
            title="Asistencia hoy"
            value="82%"
            color="text-green-500"
          />

        </div>

      </main>

    </div>
  );
}