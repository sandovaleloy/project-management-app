"use client"

import { useEffect, useState } from "react"

interface Project {
  id: string
  name: string
}

export default function ProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {

    const token = localStorage.getItem("token")

    const res = await fetch("/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (Array.isArray(data)) {
      setProjects(data)
    }

    setLoading(false)
  }

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

    if (res.ok) {

      setName("")
      fetchProjects()

    } else {

      alert("Error creando proyecto")

    }

  }

  if (loading) {
    return <div className="p-10">Cargando proyectos...</div>
  }

  return (
    <div className="p-10 max-w-xl">

      <h1 className="text-2xl font-bold mb-6 text-slate-700">
        Mis Proyectos
      </h1>

      <div className="flex gap-2 mb-6">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del proyecto"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={createProject}
          className="bg-black text-white px-4 rounded"
        >
          Crear
        </button>

      </div>

      {projects.length === 0 ? (
        <p>No tienes proyectos todavía</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id} className="border p-3 rounded">
              <a href={`/projects/${p.id}`}>
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}