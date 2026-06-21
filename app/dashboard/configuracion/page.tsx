'use client';

import { useEffect, useState } from 'react';

import Sidebar from '../../../components/dashboard/Sidebar';

type Config = {
  nombreEscuela: string;
  direccion: string;
  telefono: string;
  email: string;
  mensualidad: string;
};

const defaultConfig: Config = {
  nombreEscuela: 'Escuela de Fútbol',
  direccion: '',
  telefono: '',
  email: '',
  mensualidad: '50000',
};

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('config');
      if (stored) setConfig({ ...defaultConfig, ...JSON.parse(stored) });
    } catch {
      // ignore
    }
  }, []);

  function handleChange(field: keyof Config, value: string) {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem('config', JSON.stringify(config));
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Configuración ⚙️</h1>
          <p className="text-zinc-600 mt-1">
            Ajusta los datos generales de la escuela
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 max-w-2xl space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium text-zinc-800">
              Nombre de la escuela
            </label>
            <input
              type="text"
              value={config.nombreEscuela}
              onChange={(e) => handleChange('nombreEscuela', e.target.value)}
              className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-zinc-800">Dirección</label>
            <input
              type="text"
              value={config.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Calle 123 #45-67"
              className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-zinc-800">Teléfono</label>
              <input
                type="tel"
                value={config.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="300 123 4567"
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Correo de contacto
              </label>
              <input
                type="email"
                value={config.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contacto@escuela.com"
                className="w-full border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-zinc-800">
              Mensualidad por defecto (COP)
            </label>
            <input
              type="number"
              min="0"
              value={config.mensualidad}
              onChange={(e) => handleChange('mensualidad', e.target.value)}
              placeholder="50000"
              className="w-full md:w-64 border border-zinc-300 rounded-xl p-3 outline-none text-zinc-900 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold transition"
            >
              Guardar cambios
            </button>

            {saved && (
              <span className="text-green-600 font-medium">
                ✓ Cambios guardados
              </span>
            )}
          </div>

        </form>

      </main>

    </div>
  );
}
