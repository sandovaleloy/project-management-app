"use client"

import { useEffect, useState } from "react"
import ProjectsList from "@/components/ProjectList"
import Link from "next/link"
import { toast } from "sonner"

interface Stats {
  projects: number
  tasks: number
  doneTasks: number
  inProgressTasks: number
}

export default function DashboardPage() {

  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token")

        const res = await fetch("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()

        setStats(data)

      } catch (error) {

        toast.error("Error al cargar el dashboard")

      }

    }

    fetchDashboard()

  }, [])

  const isFirstProject =
  stats?.projects === 0 &&
  stats?.tasks === 0

  return (

    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="mb-10">

        <h1
          className="
            text-4xl
            md:text-5xl
            font-extrabold
            tracking-tight
            text-slate-900
          "
        >
          Dashboard
        </h1>

        <p
          className="
            text-slate-500
            mt-2
            text-lg
          "
        >
          Resumen general de tus proyectos y tareas
        </p>

      </div>

      {/* CTA */}

      <Link
        href="/dashboard/projects"
        className="
          inline-flex
          items-center
          px-5
          py-3
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-medium
          transition-all
          shadow-lg
        "
      >
        Ver proyectos
      </Link>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
          mt-10
        "
      >

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >

          <h2
            className="
              text-slate-500
              text-sm
              font-medium
            "
          >
            Proyectos
          </h2>

          <p
            className="
              text-4xl
              font-extrabold
              text-slate-900
              mt-2
            "
          >
            {stats?.projects ?? 0}
          </p>

        </div>

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >

          <h2
            className="
              text-slate-500
              text-sm
              font-medium
            "
          >
            Tareas
          </h2>

          <p
            className="
              text-4xl
              font-extrabold
              text-slate-900
              mt-2
            "
          >
            {stats?.tasks ?? 0}
          </p>

        </div>

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >

          <h2
            className="
              text-slate-500
              text-sm
              font-medium
            "
          >
            Completadas
          </h2>

          <p
            className="
              text-4xl
              font-extrabold
              text-green-600
              mt-2
            "
          >
            {stats?.doneTasks ?? 0}
          </p>

        </div>

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >

          <h2
            className="
              text-slate-500
              text-sm
              font-medium
            "
          >
            En progreso
          </h2>

          <p
            className="
              text-4xl
              font-extrabold
              text-blue-600
              mt-2
            "
          >
            {stats?.inProgressTasks ?? 0}
          </p>

        </div>

      </div>

     {/* PROYECTOS */}

      <div className="mt-12">

        {isFirstProject ? (

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-10
              shadow-sm
              text-center
            "
          >

            <div className="text-5xl mb-4">
              👋
            </div>

            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              ¡Bienvenido a TaskFlow!
            </h2>

            <p
              className="
                mt-3
                text-slate-500
                max-w-md
                mx-auto
              "
            >
              Aún no tienes proyectos.
              Empieza creando el primero para organizar tu trabajo.
            </p>

            <Link
              href="/dashboard/projects"
              className="
                inline-flex
                mt-6
                px-6
                py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-medium
                transition
              "
            >
              Crear mi primer proyecto
            </Link>

          </div>

        ) : (

          <>

            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
                mb-6
              "
            >
              Proyectos recientes
            </h2>

            <ProjectsList />

          </>

        )}

      </div>

    </div>

  )

}