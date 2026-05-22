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

  const data = await res.json()

  if (res.status === 401) {

    localStorage.removeItem("token")
    window.location.href = "/login"
    return

  }

  setName("")
  fetchProjects()

}
  
const deleteProject = async (id: string) => {

  const token = localStorage.getItem("token")

  console.log(token)

  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (res.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/login"
    return
  }

  fetchProjects()
}

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Mis Proyectos
      </h1>

      {/* Crear proyecto */}

      <div className="flex gap-2 mb-8">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nuevo proyecto"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={createProject}
          className="bg-black text-white px-4 rounded"
        >
          Crear
        </button>

      </div>

      {/* Lista */}

<div className="grid gap-4">

  {projects.map((project: any) => (

    <div
      key={project.id}
      className="p-4 border rounded flex justify-between items-center"
    >

      <Link
        href={`/dashboard/projects/${project.id}`}
        className="hover:underline"
      >
        {project.name}
      </Link>

      <button
        onClick={() => deleteProject(project.id)}
        className="text-red-500 hover:text-red-700"
      >
        Eliminar
      </button>

    </div>

  ))}

</div>

    </div>
  )
}