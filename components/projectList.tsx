"use client"

import { useEffect, useState } from "react"

type Project = {
  id: string
  name: string
}

export default function ProjectsList() {

  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState("")

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
    } else {
      console.error("Error API:", data)
      setProjects([])
    }
  }

  const createProject = async () => {

    const token = localStorage.getItem("token")

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name
      })
    })

    if (res.ok) {
      setName("")
      fetchProjects()
    }

  }

  return (

    <div className="space-y-4">

      <h2 className="text-xl font-bold">
        Proyectos
      </h2>

      <div className="flex gap-2">

        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={createProject}
          className="bg-black text-white px-4 rounded"
        >
          Crear
        </button>

      </div>

      <div className="space-y-2">

        {projects.map((project) => (

          <div
            key={project.id}
            className="border p-3 rounded"
          >
            {project.name}
          </div>

        ))}

      </div>

    </div>
  )
}