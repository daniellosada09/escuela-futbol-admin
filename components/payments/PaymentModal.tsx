'use client';

import { useEffect, useState } from 'react';

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

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
  onUpdatePayment: (payment: Payment) => void;
  editingPayment: Payment | null;
  studentNames: string[];
};

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function PaymentModal({
  isOpen,
  onClose,
  onAddPayment,
  onUpdatePayment,
  editingPayment,
  studentNames,
}: PaymentModalProps) {

  const [estudiante, setEstudiante] = useState('');
  const [mes, setMes] = useState(meses[new Date().getMonth()]);
  const [monto, setMonto] = useState('');
  const [estado, setEstado] = useState<'Pagado' | 'Pendiente'>('Pendiente');
  const [comprobante, setComprobante] = useState<Comprobante | undefined>(undefined);

  const isEditing = editingPayment !== null;

  useEffect(() => {
    if (editingPayment) {
      setEstudiante(editingPayment.estudiante);
      setMes(editingPayment.mes);
      setMonto(String(editingPayment.monto));
      setEstado(editingPayment.estado);
      setComprobante(editingPayment.comprobante);
    } else {
      setEstudiante(studentNames[0] ?? '');
      setMes(meses[new Date().getMonth()]);
      setMonto('');
      setEstado('Pendiente');
      setComprobante(undefined);
    }
  }, [editingPayment, isOpen, studentNames]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Límite de 1 MB: los archivos se guardan en el navegador (localStorage)
    if (file.size > 1024 * 1024) {
      alert('El archivo es muy grande. El máximo permitido es 1 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setComprobante({ nombre: file.name, dataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!estudiante.trim()) {
      alert('Debes seleccionar o escribir un estudiante');
      return;
    }

    const montoNumero = Number(monto);
    if (!monto || montoNumero <= 0) {
      alert('Ingresa un monto válido');
      return;
    }

    if (editingPayment) {
      onUpdatePayment({ ...editingPayment, estudiante, mes, monto: montoNumero, estado, comprobante });
    } else {
      onAddPayment({ estudiante, mes, monto: montoNumero, estado, comprobante });
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              {isEditing ? 'Editar pago ✏️' : 'Registrar pago 💵'}
            </h2>
            <p className="text-zinc-500 mt-1">
              {isEditing ? 'Actualiza los datos del pago' : 'Registra una mensualidad'}
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
            <label className="block mb-2 font-medium text-zinc-800">Estudiante</label>
            {studentNames.length > 0 ? (
              <select
                value={estudiante}
                onChange={(e) => setEstudiante(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              >
                {studentNames.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={estudiante}
                onChange={(e) => setEstudiante(e.target.value)}
                placeholder="Nombre del estudiante"
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-zinc-800">Mes</label>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              >
                {meses.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-zinc-800">Monto</label>
              <input
                type="number"
                min="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="50000"
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-zinc-800">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as 'Pagado' | 'Pendiente')}
              className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
            >
              <option>Pendiente</option>
              <option>Pagado</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-zinc-800">
              Comprobante (opcional)
            </label>

            {comprobante ? (
              <div className="flex items-center justify-between gap-3 border border-zinc-300 rounded-xl p-3">
                <a
                  href={comprobante.dataUrl}
                  download={comprobante.nombre}
                  className="text-yellow-700 font-medium underline truncate"
                >
                  📎 {comprobante.nombre}
                </a>
                <button
                  type="button"
                  onClick={() => setComprobante(undefined)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium shrink-0"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFile}
                className="w-full border border-zinc-300 rounded-xl p-3 text-zinc-900 file:mr-3 file:rounded-lg file:border-0 file:bg-yellow-400 file:px-4 file:py-1.5 file:font-semibold file:text-zinc-900 hover:file:bg-yellow-500"
              />
            )}

            <p className="text-xs text-zinc-400 mt-1">
              Imagen o PDF, máximo 1 MB.
            </p>
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
              {isEditing ? 'Guardar cambios' : 'Registrar pago'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
