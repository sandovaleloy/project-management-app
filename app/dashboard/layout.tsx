"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");

    toast.success("Sesión cerrada");

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div
      className="
        min-h-screen
        bg-slate-50

        flex
        flex-col

        md:flex-row
      "
    >
      {/* SIDEBAR */}

      <aside
        className="
          w-full

          md:w-72
          md:min-h-screen

          bg-slate-900
          text-white

          border-b
          md:border-b-0
          md:border-r

          border-slate-800

          p-5
        "
      >
        <h1
          className="
            text-3xl
            font-extrabold
            text-blue-500
          "
        >
          ⚡ TaskFlow
        </h1>

        <p className="text-slate-400 text-sm mt-1 mb-6">Task Management</p>

        <nav
          className="
            flex
            flex-col

            md:flex-col

            gap-3
          "
        >
          <Link
            href="/dashboard"
            className="
              block

              rounded-xl

              bg-slate-800

              px-4
              py-3

              hover:bg-slate-700

              transition
            "
          >
            📊 Dashboard
          </Link>

          <Link
            href="/dashboard/projects"
            className="
              block

              rounded-xl

              bg-slate-800

              px-4
              py-3

              hover:bg-slate-700

              transition
            "
          >
            📁 Proyectos
          </Link>

          <button
            onClick={logout}
            className="
              rounded-xl

              bg-slate-800

              px-4
              py-3

              hover:bg-red-500

              transition

              mt-2
            "
          >
            🚪 Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* CONTENIDO */}

      <main
        className="
          flex-1

          min-w-0

          p-4
          sm:p-6
          lg:p-8
        "
      >
        {children}
      </main>
    </div>
  );
}
