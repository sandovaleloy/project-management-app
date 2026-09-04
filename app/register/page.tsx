"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);

        setLoading(false);

        return;
      }

      toast.success("Usuario creado correctamente");

      router.push("/login");
    } catch (error) {
      console.error(error);

      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-[Inter,ui-sans-serif]">
      {/* Panel de marca */}
      <div
        className="
          relative
          md:w-[45%]
          bg-[#14231F]
          text-[#F5F2EA]
          px-8
          py-12
          md:p-14
          flex
          flex-col
          justify-between
          overflow-hidden
        "
      >
        <div className="relative z-10">
          <h1 className="font-[Fraunces,Georgia,serif] text-4xl md:text-5xl leading-tight">
            TaskFlow
          </h1>

          <p className="mt-3 text-[#B9C4BC] max-w-xs">
            Un lugar tranquilo para organizar lo que sigue.
          </p>
        </div>

        {/* Checklist */}
        <div className="relative z-10 mt-12 md:mt-0 space-y-4 max-w-xs">
          {[
            { label: "Organizar las tareas del día", done: true },
            { label: "Completar lo más importante", done: true },
            { label: "Planear lo que sigue", done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className={`
                  flex
                  items-center
                  justify-center
                  w-5
                  h-5
                  rounded-full
                  border
                  shrink-0
                  ${
                    item.done
                      ? "bg-[#3B8763] border-[#3B8763]"
                      : "border-[#4A5850]"
                  }
                `}
              >
                {item.done && (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6.2L4.7 9L10 3"
                      stroke="#F5F2EA"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              <span
                className={`text-sm ${
                  item.done ? "text-[#8B978F] line-through" : "text-[#E4E7E2]"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-xs text-[#6B7268] mt-12 md:mt-0">
          Organiza. Completa. Avanza.
        </p>
      </div>

      {/* Panel de formulario */}
      <div
        className="
          flex-1
          bg-[#FAF7F0]
          flex
          items-center
          justify-center
          px-6
          py-12
          md:py-0
        "
      >
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1C231F]">
              Crear una cuenta
            </h2>

            <p className="text-[#6B7268] mt-1 text-sm">
              Comienza a organizar tus tareas.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            autoComplete="off"
            className="space-y-5"
          >
            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#1C231F] mb-1.5"
              >
                Nombre
              </label>

              <input
                id="name"
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="
                  w-full
                  px-3.5
                  py-3
                  bg-white
                  border
                  border-[#DDD6C7]
                  rounded-lg
                  text-[#1C231F]
                  placeholder:text-[#A6A093]
                  outline-none
                  focus:border-[#3B8763]
                  focus:ring-2
                  focus:ring-[#3B8763]/15
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Correo */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1C231F] mb-1.5"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="
                  w-full
                  px-3.5
                  py-3
                  bg-white
                  border
                  border-[#DDD6C7]
                  rounded-lg
                  text-[#1C231F]
                  placeholder:text-[#A6A093]
                  outline-none
                  focus:border-[#3B8763]
                  focus:ring-2
                  focus:ring-[#3B8763]/15
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1C231F] mb-1.5"
              >
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                placeholder="********"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="
                  w-full
                  px-3.5
                  py-3
                  bg-white
                  border
                  border-[#DDD6C7]
                  rounded-lg
                  text-[#1C231F]
                  placeholder:text-[#A6A093]
                  outline-none
                  focus:border-[#3B8763]
                  focus:ring-2
                  focus:ring-[#3B8763]/15
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[#1C231F]
                hover:bg-[#14231F]
                text-[#F5F2EA]
                font-medium
                py-3
                rounded-lg
                transition-colors
                disabled:opacity-60
                disabled:cursor-not-allowed
                flex
                items-center
                justify-center
                gap-2
                mt-2
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      w-4
                      h-4
                      border-2
                      border-[#F5F2EA]
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                  />
                  Creando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          {/* Enlace a Login */}
          <p className="text-center mt-7 text-sm text-[#6B7268]">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="
                text-[#3B8763]
                font-medium
                hover:underline
                focus:outline-none
                focus:ring-2
                focus:ring-[#3B8763]/30
                rounded
              "
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
