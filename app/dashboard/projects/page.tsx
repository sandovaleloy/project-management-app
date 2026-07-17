"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function ProjectsPage() {

  const [projects, setProjects] = useState<any[]>([])
  const [name, setName] = useState("")

  const fetchProjects = async () => {

    const token = localStorage.getItem("token")

    const res = await fetch("/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (res.status === 401 || res.status === 500) {

      localStorage.removeItem("token")
      window.location.href = "/login"
      return

    }

    setProjects(data)

  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const createProject = async () => {

    if (!name.trim()) return

    const token = localStorage.getItem("token")

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name
      })
    })

    if (res.status === 401) {

      localStorage.removeItem("token")
      window.location.href = "/login"
      return

    }

    setName("")
    fetchProjects()

  }

  const deleteProject = async (
    id: string
  ) => {

    const token = localStorage.getItem("token")

    const res = await fetch(
      `/api/projects/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.status === 401) {

      localStorage.removeItem("token")
      window.location.href = "/login"
      return

    }

    fetchProjects()

  }

  return (

  <div
    className="
      min-h-screen
      bg-slate-50
      p-4
      sm:p-6
      lg:p-10
    "
  >

    <div className="max-w-5xl mx-auto">

      {/* HEADER */}

      <div className="mb-8">

        <h1
          className="
            text-3xl
            sm:text-4xl
            font-bold
            text-slate-900
          "
        >
          Mis Proyectos
        </h1>

        <p
          className="
            text-slate-500
            mt-2
          "
        >
          Organiza y administra todos tus proyectos.
        </p>

      </div>

      {/* CREAR PROYECTO */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          shadow-md
          p-5
          mb-8

          flex
          flex-col
          sm:flex-row

          gap-3
        "
      >

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nuevo proyecto"

          className="
            flex-1

            border
            border-slate-300

            rounded-xl

            p-3

            outline-none
            placeholder-slate-400
            focus:ring-2
            focus:ring-blue-200
            focus:border-blue-500

            transition
          "
        />

        <button
          onClick={createProject}
          className="
            w-full
            sm:w-auto

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
          Crear proyecto
        </button>

      </div>

      {/* LISTA */}

      {projects.length === 0 ? (

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-md

            p-12

            text-center
          "
        >

          <div className="text-5xl mb-4">
            📁
          </div>

          <h2
            className="
              text-xl
              font-semibold
              text-slate-800
            "
          >
            No tienes proyectos
          </h2>

          <p
            className="
              text-slate-500
              mt-2
            "
          >
            Crea tu primer proyecto para comenzar.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {projects.map((project: any) => (

            <div
              key={project.id}

              className="
                bg-white
                border
                border-slate-200

                rounded-2xl

                shadow-sm
                hover:shadow-lg

                transition-all

                p-5

                flex
                flex-col
                sm:flex-row

                items-start
                sm:items-center

                justify-between

                gap-4
              "
            >

              <Link
                href={`/dashboard/projects/${project.id}`}

                className="
                  text-lg
                  font-semibold

                  text-slate-800

                  hover:text-blue-600

                  transition

                  break-all
                "
              >
                {project.name}
              </Link>

              <button
                onClick={() => deleteProject(project.id)}

                className="
                  px-4
                  py-2

                  rounded-lg

                  text-red-600

                  hover:bg-red-50
                  hover:text-red-700

                  transition
                "
              >
                Eliminar
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>

)

}