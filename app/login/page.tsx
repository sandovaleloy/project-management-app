"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        toast.success("Bienvenido");

        router.push("/dashboard/projects");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-50
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-violet-100
          border
          border-slate-200
          rounded-3xl
          shadow-xl
          p-8
        "
      >
        <div className="text-center mb-8">
          <h1
            className="
              text-4xl
              font-extrabold
              text-blue-600
              tracking-tight
            "
          >
            TaskFlow
          </h1>

          <p
            className="
              text-slate-500
              mt-2
            "
          >
            Gestiona tus proyectos y tareas
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              "
            >
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="
                w-full
                p-3
                border
                border-slate-300
                rounded-xl
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                transition
                bg-white
              "
            />
          </div>

          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              "
            >
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="
                w-full
                p-3
                border
                border-slate-300
                rounded-xl
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                bg-white
                transition
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              py-3
              rounded-xl
              transition-all
              shadow-lg
              disabled:opacity-70
              disabled:cursor-not-allowed
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {loading ? (
              <>
                <span
                  className="
                    w-5
                    h-5
                    border-2
                    border-white
                    border-t-transparent
                    rounded-full
                    animate-spin
                  "
                />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <p
          className="
            text-center
            mt-6
            text-sm
            text-slate-500
          "
        >
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="
              text-blue-600
              font-medium
              hover:underline
            "
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
