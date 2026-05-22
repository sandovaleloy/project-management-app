"use client"

import { useEffect, useState } from "react"
import ProjectsList from "@/components/projectList"
import Link from "next/link"

export default function DashboardPage() {

  const [stats, setStats] = useState<any>(null)

  useEffect(() => {

    const token = localStorage.getItem("token")

    fetch("/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setStats(data))

  }, [])

  if (!stats) {
    return <p className="p-10">Cargando...</p>
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <Link
        href="/dashboard/projects"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Ver proyectos
      </Link>

      <ProjectsList />
      
      <div className="grid grid-cols-4 gap-6">

        <div className="p-6 shadow rounded-lg">
          <h2 className="text-gray-500">Projects</h2>
          <p className="text-3xl font-bold">{stats.projects}</p>
        </div>

        <div className="p-6 shadow rounded-lg">
          <h2 className="text-gray-500">Tasks</h2>
          <p className="text-3xl font-bold">{stats.tasks}</p>
        </div>

        <div className="p-6 shadow rounded-lg">
          <h2 className="text-gray-500">Completed</h2>
          <p className="text-3xl font-bold">{stats.completedTasks}</p>
        </div>

        <div className="p-6 shadow rounded-lg">
          <h2 className="text-gray-500">Pending</h2>
          <p className="text-3xl font-bold">{stats.pendingTasks}</p>
        </div>

      </div>

    </div>
  )
}