'use client';

import { useEffect, useState } from 'react';

import Sidebar from '../../../components/dashboard/Sidebar';
import PaymentModal from '../../../components/payments/PaymentModal';

type Comprobante = {
  nombre: string;
  dataUrl: string;
};

type Payment = {
  id: number;
  estudiante: string;
  mes: string;
  monto: number;
  estado: 'Pagado' | 'Pendiente';
  comprobante?: Comprobante;
};

type Student = { nombre: string };

const defaultPayments: Payment[] = [
  { id: 1, estudiante: 'Daniel Losada', mes: 'Junio', monto: 50000, estado: 'Pagado' },
  { id: 2, estudiante: 'Juan Pérez', mes: 'Junio', monto: 50000, estado: 'Pendiente' },
];

function formatCOP(value: number) {
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

export default function PagosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [studentNames, setStudentNames] = useState<string[]>([]);

  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('payments');
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return defaultPayments;
  });

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  // Cargar nombres de estudiantes para el selector del modal
  useEffect(() => {
    try {
      const saved = localStorage.getItem('students');
      if (saved) {
        const students: Student[] = JSON.parse(saved);
        setStudentNames(students.map((s) => s.nombre));
      }
    } catch {
      // ignore
    }
  }, []);

  function addPayment(payment: Omit<Payment, 'id'>) {
    setPayments((prev) => [...prev, { id: Date.now(), ...payment }]);
  }

  function updatePayment(updated: Payment) {
    setPayments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function deletePayment(id: number) {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }

  function toggleEstado(id: number) {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, estado: p.estado === 'Pagado' ? 'Pendiente' : 'Pagado' }
          : p
      )
    );
  }

  function editPayment(payment: Payment) {
    setEditingPayment(payment);
    setIsModalOpen(true);
  }

  const recaudado = payments
    .filter((p) => p.estado === 'Pagado')
    .reduce((sum, p) => sum + p.monto, 0);

  const pendiente = payments
    .filter((p) => p.estado === 'Pendiente')
    .reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Pagos 💵</h1>
            <p className="text-zinc-600 mt-1">
              Controla las mensualidades de los estudiantes
            </p>
          </div>

          <button
            onClick={() => {
              setEditingPayment(null);
              setIsModalOpen(true);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold px-5 py-3 rounded-xl transition shadow-sm"
          >
            + Registrar pago
          </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200">
            <p className="text-sm text-zinc-500">Recaudado</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCOP(recaudado)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200">
            <p className="text-sm text-zinc-500">Pendiente</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{formatCOP(pendiente)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200">
            <p className="text-sm text-zinc-500">Total registros</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{payments.length}</p>
          </div>
        </div>

        {/* Tabla */}
        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-10 text-center text-zinc-500">
            No hay pagos registrados.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <table className="w-full text-zinc-900">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-zinc-700">Estudiante</th>
                  <th className="text-left p-4 font-semibold text-zinc-700">Mes</th>
                  <th className="text-left p-4 font-semibold text-zinc-700">Monto</th>
                  <th className="text-left p-4 font-semibold text-zinc-700">Estado</th>
                  <th className="text-left p-4 font-semibold text-zinc-700">Comprobante</th>
                  <th className="text-left p-4 font-semibold text-zinc-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-zinc-200 hover:bg-zinc-50 transition"
                  >
                    <td className="p-4 font-medium">{payment.estudiante}</td>
                    <td className="p-4 text-zinc-700">{payment.mes}</td>
                    <td className="p-4 text-zinc-700">{formatCOP(payment.monto)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleEstado(payment.id)}
                        title="Clic para cambiar el estado"
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                          payment.estado === 'Pagado'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {payment.estado}
                      </button>
                    </td>
                    <td className="p-4">
                      {payment.comprobante ? (
                        <a
                          href={payment.comprobante.dataUrl}
                          download={payment.comprobante.nombre}
                          title={payment.comprobante.nombre}
                          className="text-yellow-700 font-medium underline"
                        >
                          📎 Ver
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editPayment(payment)}
                          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-xl font-medium transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deletePayment(payment.id)}
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
        )}

        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPayment(null);
          }}
          onAddPayment={addPayment}
          onUpdatePayment={updatePayment}
          editingPayment={editingPayment}
          studentNames={studentNames}
        />

      </main>

    </div>
  );
}
