'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">

        {/* Header amarillo Dortmund */}
        <div className="bg-yellow-400 p-6 text-center">
          <h1 className="text-3xl font-extrabold text-zinc-900">
            Escuela de Fútbol ⚽
          </h1>

          <p className="text-zinc-800 mt-2 text-sm">
            Plataforma administrativa
          </p>
        </div>

        {/* Formulario */}
        <div className="p-8">

          <p className="text-center text-zinc-500 mb-6">
            Inicia sesión para continuar
          </p>

          <form className="space-y-5">

            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Correo
              </label>

              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="
                  w-full
                  border
                  border-zinc-300
                  rounded-xl
                  p-3
                  outline-none
                  transition
                  focus:ring-2
                  focus:ring-yellow-400
                  focus:border-yellow-400
                "
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-zinc-800">
                Contraseña
              </label>

              <input
                type="password"
                placeholder="********"
                className="
                  w-full
                  border
                  border-zinc-300
                  rounded-xl
                  p-3
                  outline-none
                  transition
                  focus:ring-2
                  focus:ring-yellow-400
                  focus:border-yellow-400
                "
              />
            </div>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="
                w-full
                bg-yellow-400
                text-zinc-900
                font-semibold
                p-3
                rounded-xl
                transition
                hover:bg-yellow-500
                active:scale-[0.98]
              "
            >
              Ingresar
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}