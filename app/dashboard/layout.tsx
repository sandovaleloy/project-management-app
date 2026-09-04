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
        bg-[#FAF7F0]
        flex
        flex-col
        md:flex-row
        font-[Inter,ui-sans-serif]
      "
    >
      {/* SIDEBAR */}

      <aside
        className="
          w-full
          md:w-72
          md:min-h-screen

          bg-[#14231F]
          text-[#F5F2EA]

          border-b
          md:border-b-0
          md:border-r
          border-[#26352F]

          p-5
          md:p-6

          flex
          flex-col
        "
      >
        {/* BRAND */}

        <div className="mb-8">
          <h1
            className="
              text-3xl
              font-[Fraunces,Georgia,serif]
              tracking-tight
              text-[#F5F2EA]
            "
          >
            TaskFlow
          </h1>

          <p
            className="
              text-sm
              text-[#B9C4BC]
              mt-1
            "
          >
            Organiza. Completa. Avanza.
          </p>
        </div>

        {/* NAVIGATION */}

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="
              block
              rounded-lg
              px-4
              py-3

              bg-[#1C3029]
              text-[#F5F2EA]

              hover:bg-[#264138]

              transition-colors
            "
          >
            <span className="mr-2">📊</span>
            Dashboard
          </Link>

          <Link
            href="/dashboard/projects"
            className="
              block
              rounded-lg
              px-4
              py-3

              bg-[#1C3029]
              text-[#F5F2EA]

              hover:bg-[#264138]

              transition-colors
            "
          >
            <span className="mr-2">📁</span>
            Proyectos
          </Link>

          <button
            onClick={logout}
            className="
              rounded-lg
              px-4
              py-3

              text-left

              bg-[#1C3029]
              text-[#F5F2EA]

              hover:bg-[#3A2928]

              transition-colors

              mt-2
            "
          >
            <span className="mr-2">🚪</span>
            Cerrar sesión
          </button>
        </nav>

        {/* SIDEBAR FOOTER */}

        <div
          className="
            hidden
            md:block
            mt-auto
            pt-8
          "
        >
          <p className="text-xs text-[#8B978F]">TaskFlow</p>

          <p className="text-xs text-[#66736C] mt-1">
            Tu espacio para organizar lo que sigue.
          </p>
        </div>
      </aside>

      {/* CONTENIDO */}

      <main
        className="
          flex-1
          min-w-0

          p-4
          sm:p-6
          lg:p-8

          text-[#1C231F]
        "
      >
        {children}
      </main>
    </div>
  );
}
